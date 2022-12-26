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
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Collapsible from "@radix-ui/react-collapsible";
import type { SubmitHandler } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { SectionCreatorForm } from "./SectionCreatorForm";

type SectionCreatorProps = {
  sectionId: string;
  title: string;
};

export const sectionUpdateSchema = z.object({
  title: z.string().min(1),
});

type SectionUpdate = z.infer<typeof sectionUpdateSchema>;

export default function SectionCreator({
  title,
  sectionId,
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
    <div className="[SECTION]">
      <Collapsible.Root open={sectionOpen} onOpenChange={setSectionOpen}>
        <div className="[SECTION-HEADER] group flex items-center justify-between">
          <div className="[SECTION-HEADER-LEFT] flex items-center space-x-2">
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  className={`invisible ${
                    !newSectionFormOpen && "group-hover:visible"
                  }`}
                >
                  <button
                    className="flex items-center"
                    onClick={() => {
                      setNewSectionFormOpen(true);
                    }}
                  >
                    <PlusIcon
                      className={`h-5 w-5 rounded hover:bg-neutral-100  hover:dark:bg-neutral-700`}
                    />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={5}
                    className="rounded bg-neutral-700 p-1 text-xs text-neutral-200"
                  >
                    Click to add a new section below
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  className={`invisible ${
                    !newSectionFormOpen && "group-hover:visible"
                  }`}
                >
                  <button
                    className="flex items-center"
                    onClick={() => {
                      deleteSession.mutate({ sectionId });
                    }}
                  >
                    <MinusIcon
                      className={`h-5 w-5 rounded hover:bg-neutral-100  hover:dark:bg-neutral-700`}
                    />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={5}
                    className="rounded bg-neutral-700 p-1 text-xs text-neutral-200"
                  >
                    Click to delete the section
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  className={`invisible ${
                    !newSectionFormOpen && "group-hover:visible"
                  }`}
                >
                  <button
                    className="flex items-center"
                    onClick={() => {
                      setSectionUpdateFormOpen(true);
                    }}
                  >
                    <PencilIcon
                      className={`h-5 w-5 rounded hover:bg-neutral-100  hover:dark:bg-neutral-700`}
                    />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={5}
                    className="rounded bg-neutral-700 p-1 text-xs text-neutral-200"
                  >
                    Click to edit the section
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger
                  className={`invisible ${
                    !newSectionFormOpen && "group-hover:visible"
                  }`}
                >
                  <button
                    className="flex items-center"
                    onClick={() => {
                      setNewSectionFormOpen(true);
                    }}
                  >
                    <QueueListIcon
                      className={`h-5 w-5 rounded hover:bg-neutral-100  hover:dark:bg-neutral-700`}
                    />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={5}
                    className="rounded bg-neutral-700 p-1 text-xs text-neutral-200"
                  >
                    Drag to move the section
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            {sectionUpdateFormOpen ? (
              <form
                className="flex"
                onSubmit={handleSubmit(onSectionUpdateHandler)}
              >
                <input
                  defaultValue={title}
                  className="bg-neutral-800 text-white"
                  {...register("title")}
                />
                <button type="submit">
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSectionUpdateFormOpen(false);
                  }}
                ></button>
                <XMarkIcon className="h-5 w-5" />
              </form>
            ) : (
              <>
                <span>{title}</span>
                <Collapsible.Trigger asChild>
                  <button>
                    <ChevronUpDownIcon className="h-5 w-5" />
                  </button>
                </Collapsible.Trigger>
              </>
            )}
          </div>
        </div>
        <Collapsible.Content className="pl-10"></Collapsible.Content>
      </Collapsible.Root>
      {newSectionFormOpen && (
        <SectionCreatorForm
          sectionId={sectionId}
          onSubmitCallback={sectionCreationFormCallback}
        />
      )}
    </div>
  );
}
