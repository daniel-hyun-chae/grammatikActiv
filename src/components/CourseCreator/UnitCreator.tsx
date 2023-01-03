import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";
import type { Unit } from "@prisma/client";
import { useState } from "react";
import { IconWithTooltip } from "../IconWithTooltip";
import { UnitCreatorForm } from "./UnitCreatorForm";
import { useContext } from "react";
import { selectedUnitContext } from "./ContentCreator";

export const UnitCreator = ({
  sectionId,
  unit,
}: {
  sectionId: string;
  unit: Unit;
}) => {
  const [unitCreatorFormOpen, setUnitCreatorFormOpen] =
    useState<boolean>(false);

  const { setSelectedUnitId } = useContext(selectedUnitContext);

  return (
    <div className="UNIT">
      <div
        className="[UNIT-HEADER items-center] group flex border-l-4 pl-4"
        key={unit.id}
      >
        <div
          className="[SECTION-HEADER-TITLE] grow cursor-pointer pl-1 font-semibold capitalize text-neutral-400 hover:bg-neutral-600"
          onClick={() => {
            setSelectedUnitId && setSelectedUnitId(unit.id);
          }}
        >
          {unit.title}
        </div>
        <div
          className={`[SECTION-HEADER-MENU] invisible mr-1 flex items-center space-x-1 ${"group-hover:visible"}`}
        >
          <IconWithTooltip
            Icon={PlusIcon}
            tooltipMessage="Click to add a new section below"
            onClickCallback={() => {
              setUnitCreatorFormOpen(true);
            }}
          />
          <IconWithTooltip
            Icon={MinusIcon}
            tooltipMessage="Click to delete the section"
          />
          <IconWithTooltip
            Icon={PencilIcon}
            tooltipMessage="Click to edit the section"
          />
          <IconWithTooltip
            Icon={QueueListIcon}
            tooltipMessage="Drag to reposition the section"
          />
        </div>
      </div>
      {unitCreatorFormOpen && (
        <div className="mt-2 border-l-4 px-4">
          <UnitCreatorForm
            onCancelCallback={() => {
              setUnitCreatorFormOpen(false);
            }}
            prevUnitId={unit.id}
            sectionId={sectionId}
          />
        </div>
      )}
    </div>
  );
};
