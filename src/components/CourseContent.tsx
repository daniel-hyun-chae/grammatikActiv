import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import SectionCreator from "./SectionCreator/SectionCreator";
import Section from "./SectionCreator/SectionCreator";

export const sectionCreateSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().min(1),
  prevSectionId: z.string().min(1).nullable(),
});

export const sectionSchema = sectionCreateSchema.extend({
  sectionId: z.string().min(1),
});

export type Section = z.infer<typeof sectionSchema>;

export default function CourseContent() {
  const router = useRouter();
  const courseId = router.query.id as string;
  const { data: course, isLoading } = trpc.course.getById.useQuery(courseId);

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

  function handleDragStart(
    // e: React.DragEvent<HTMLDivElement>,
    position: number
  ) {
    setDraggingItemIndex(position);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, position: number) {
    const updatedList = [...course?.sectionsIdList];
    console.log("toBe", updatedList);
    console.log(draggingItemIndex);
    if (typeof draggingItemIndex === "number" && updatedList) {
      updatedList.splice(position, 0, updatedList.at(draggingItemIndex));
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

  if (isLoading) {
    // Replace it to be a spinner
    return <div>Loading...</div>;
  } else if (!course) {
    router.push("/500");
    return null;
  } else {
    return (
      <div className="flex h-full">
        <div className="[SIDEBAR] h-full w-96 overflow-x-auto border-r px-5 dark:bg-neutral-800">
          <div>
            {course.sections.length === 0 && (
              // <>
              //   {!sectionFormOpen && (
              //     <button
              //       className="flex items-center space-x-2 text-cyan-500"
              //       onClick={() => {
              //         setSectionFormOpen(true);
              //       }}
              //     >
              //       <PlusCircleIcon className="h-5 w-5" />
              //       <span>Add a section</span>
              //     </button>
              //   )}
              //   {sectionFormOpen && (
              //     <SectionCreationForm
              //       sectionId={null}
              //       onSubmitCallback={sectionCreationFormCallback}
              //     />
              //   )}
              // </>
              <div>test</div>
            )}
            {course.sections.map((section, index) => {
              return (
                <div key={section.id}>
                  {index === 0 && (
                    <hr
                      className={`border-2 border-transparent ${
                        (draggingItemIndex === 0 || draggingItemIndex === 1) &&
                        "invisible"
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
                    sectionId={section.id}
                    index={index}
                    title={section.title}
                  />
                  <hr
                    className={`border-2 border-transparent ${
                      (draggingItemIndex === index ||
                        draggingItemIndex === index + 1) &&
                      "invisible"
                    } ${
                      hoveringPosition === index + 1 && "border-neutral-500"
                    }`}
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
        </div>
        <div className="[CONTENT]">Content planner</div>
      </div>
    );
  }
}
