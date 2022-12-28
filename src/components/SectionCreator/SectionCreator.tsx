import {
  ChevronUpDownIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Collapsible from "@radix-ui/react-collapsible";
import type { SubmitHandler } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { SectionCreatorForm } from "./SectionCreatorForm";
import { IconWithTooltip } from "../IconWithTooltip";

type SectionCreatorProps = {
  sectionId: string;
  title: string;
  index: number;
  dragStartCallback: (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => void;
  dragEndCallback: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
};

export const sectionUpdateSchema = z.object({
  title: z.string().min(1),
});

type SectionUpdate = z.infer<typeof sectionUpdateSchema>;

export default function SectionCreator({
  title,
  sectionId,
  index,
  dragStartCallback,
  dragEndCallback,
}: SectionCreatorProps) {
  // internal states
  const [newSectionFormOpen, setNewSectionFormOpen] = useState(false);
  const [sectionUpdateFormOpen, setSectionUpdateFormOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  // server states
  const queryClient = useQueryClient();
  const deleteSession = trpc.section.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([["sections", "getAll"]]);
      queryClient.invalidateQueries([["course", "getById"]]);
    },
  });
  const updateSession = trpc.section.updateTitle.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([["course", "getById"]]);
      setSectionUpdateFormOpen(false);
    },
  });

  // form related
  const { register, handleSubmit } = useForm<SectionUpdate>({
    resolver: zodResolver(sectionUpdateSchema),
  });
  const sectionCreationFormCallback = () => {
    setNewSectionFormOpen(false);
  };
  const onSectionUpdateHandler: SubmitHandler<SectionUpdate> = (data) => {
    console.log("called");
    updateSession.mutate({
      title: data.title,
      sectionId,
    });
  };

  return (
    <div
      className="[SECTION]"
      onDragStart={(e) => {
        console.log("started");
        dragStartCallback(e, index);
      }}
      draggable
    >
      <Collapsible.Root open={sectionOpen} onOpenChange={setSectionOpen}>
        <div
          className="[SECTION-HEADER] group flex items-center"
          onDrag={() => {
            console.log("test");
          }}
        >
          <div
            className={`[SECTION-HEADER-MENU] invisible mr-2 flex items-center space-x-1 ${
              !newSectionFormOpen && "group-hover:visible"
            }`}
          >
            <IconWithTooltip
              Icon={PlusIcon}
              tooltipMessage="Click to add a new section below"
              onClickCallback={() => {
                setNewSectionFormOpen(true);
              }}
            />
            <IconWithTooltip
              Icon={MinusIcon}
              tooltipMessage="Click to delete the section"
              onClickCallback={() => {
                deleteSession.mutate({ sectionId });
              }}
            />
            <IconWithTooltip
              Icon={PencilIcon}
              tooltipMessage="Click to edit the section"
              onClickCallback={() => {
                setSectionUpdateFormOpen(true);
              }}
            />
            <IconWithTooltip
              Icon={QueueListIcon}
              tooltipMessage="Drag to reposition the section"
            />
          </div>
          <div className="[SECTION-HEADER-TITLE] grow">
            {sectionUpdateFormOpen ? (
              <form
                className="[SECTION-HEADER-TITLE-UPDATEFORM] flex"
                onSubmit={handleSubmit(onSectionUpdateHandler)}
              >
                <input
                  defaultValue={title}
                  className="grow rounded bg-neutral-600 px-1 text-white"
                  {...register("title")}
                />
                <button type="submit">
                  <CheckIcon className="h-5 w-5 text-green-400" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSectionUpdateFormOpen(false);
                  }}
                >
                  <XMarkIcon className="h-5 w-5 text-red-500" />
                </button>
              </form>
            ) : (
              <div className="[SECTION-HEADER-TITLE] flex">
                <span className="grow px-1 group-hover:bg-neutral-700">
                  {title}
                </span>
                <Collapsible.Trigger asChild>
                  <button>
                    <ChevronUpDownIcon className="h-5 w-5" />
                  </button>
                </Collapsible.Trigger>
              </div>
            )}
            {newSectionFormOpen && (
              <SectionCreatorForm
                sectionId={sectionId}
                onSubmitCallback={sectionCreationFormCallback}
              />
            )}
          </div>
        </div>
        <Collapsible.Content className="pl-10"></Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
