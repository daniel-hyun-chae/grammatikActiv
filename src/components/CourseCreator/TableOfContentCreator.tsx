import type { Section, Unit } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import SectionCreator from "./SectionCreator";
import { SectionCreatorForm } from "./SectionCreatorForm";

export const TableOfContentCreator = ({
  courseId,
  sections,
  sectionIdList,
}: {
  courseId: string;
  sections: (Section & { units: Unit[] })[];
  sectionIdList: string[];
}) => {
  const [draggingItemIndex, setDraggingItemIndex] = useState<number | null>(
    null
  );
  const [hoveringPosition, setHoveringPosition] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const updateSectionIdList = trpc.course.updateSectionIdList.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([["course", "getById"]]);
    },
  });

  function handleDragStart(position: number) {
    setDraggingItemIndex(position);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, position: number) {
    const updatedList = sectionIdList ? [...sectionIdList] : [];
    if (typeof draggingItemIndex === "number" && updatedList) {
      const draggingItem = updatedList.at(draggingItemIndex);
      if (draggingItem) {
        updatedList.splice(position, 0, draggingItem);
      }
      if (draggingItemIndex >= position) {
        updatedList.splice(draggingItemIndex + 1, 1);
      } else {
        updatedList.splice(draggingItemIndex, 1);
      }
      updateSectionIdList.mutate({
        courseId,
        newSectionIdList: updatedList,
      });
    } else {
      console.log("something wrong");
    }
  }
  return (
    <div>
      {sections.length === 0 && (
        <div>
          <div>Create the first section</div>
          <SectionCreatorForm sectionId={null} />
        </div>
      )}
      {sections.map((section, index) => {
        return (
          <div key={section.id}>
            {index === 0 && (
              <hr
                className={`border-8 border-transparent ${
                  draggingItemIndex === 0 && "invisible"
                } ${hoveringPosition === 0 && "border-neutral-500"}`}
                draggable
                onDragOver={(e) => {
                  e.preventDefault();
                  setHoveringPosition(0);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setHoveringPosition(null);
                }}
                onDrop={(e) => {
                  setHoveringPosition(null);
                  handleDrop(e, 0);
                }}
              />
            )}
            <SectionCreator
              dragStartCallback={handleDragStart}
              units={section.units}
              sectionId={section.id}
              index={index}
              title={section.title}
            />
            <hr
              className={`border-8 border-transparent ${
                (draggingItemIndex === index ||
                  draggingItemIndex === index + 1) &&
                "invisible"
              } ${hoveringPosition === index + 1 && "border-neutral-500"}`}
              draggable
              onDragOver={(e) => {
                e.preventDefault();
                setHoveringPosition(index + 1);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setHoveringPosition(null);
              }}
              onDrop={(e) => {
                setHoveringPosition(null);
                handleDrop(e, index + 1);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
