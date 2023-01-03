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
import { UnitCreator } from "./UnitCreator";
import type { Unit } from "@prisma/client";
import { UnitCreatorForm } from "./UnitCreatorForm";

type SectionCreatorProps = {
  sectionId: string;
  title: string;
  index: number;
  units: Unit[];
  dragStartCallback: (
    // e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => void;
};

export const sectionUpdateSchema = z.object({
  title: z.string().min(1),
});

type SectionUpdate = z.infer<typeof sectionUpdateSchema>;

export default function SectionCreator({
  title,
  sectionId,
  index,
  units,
  dragStartCallback,
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
    updateSession.mutate({
      title: data.title,
      sectionId,
    });
  };

  return (
    <div className="space-y-2">
      <div
        className="[SECTION] border-l-4 border-cyan-500"
        onDragStart={() => {
          dragStartCallback(index);
        }}
        draggable
      >
        <Collapsible.Root open={sectionOpen} onOpenChange={setSectionOpen}>
          <div className="[SECTION-HEADER] group flex items-center">
            <div className="[SECTION-HEADER-TITLE] mr-1 flex grow">
              <Collapsible.Trigger asChild>
                <button>
                  <ChevronUpDownIcon className="h-5 w-5" />
                </button>
              </Collapsible.Trigger>
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
                <div className="[SECTION-HEADER-TITLE] flex grow text-lg font-semibold text-white">
                  <span className="grow px-1 capitalize group-hover:bg-neutral-700">
                    {title}
                  </span>
                </div>
              )}
            </div>
            <div
              className={`[SECTION-HEADER-MENU] invisible mr-1 flex items-center space-x-1 ${
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
          </div>
          <Collapsible.Content>
            <div className="px-2 pt-2">
              {units.length === 0 && (
                <div className="flex flex-col space-y-1 pl-2">
                  <div className="">Add the first unit for the section</div>
                  <UnitCreatorForm prevUnitId={null} sectionId={sectionId} />
                </div>
              )}
              <ul className="space-y-2">
                {units.map((unit) => {
                  return (
                    <li key={unit.id}>
                      <UnitCreator sectionId={sectionId} unit={unit} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
      {newSectionFormOpen && (
        <div className="border-l-4 border-cyan-500 px-2">
          <SectionCreatorForm
            sectionId={sectionId}
            onSubmitCallback={sectionCreationFormCallback}
          />
        </div>
      )}
    </div>
  );
}
