import type { Section, Unit } from "@prisma/client";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { currentUnitContext } from "../pages/myCourse/[courseId]";

export const TableOfContent = ({
  courseId,
  sections,
}: {
  courseId: string;
  sections: (Section & { units: Unit[] })[];
}) => {
  return (
    <div className="min-h-full w-64 border-l border-r">
      <div className="border-b py-2 px-2">Table of Contents</div>
      <ul>
        {sections.map((section, index) => {
          return (
            <SectionItem
              title={section.title}
              number={index + 1}
              units={section.units}
            />
          );
        })}
      </ul>
    </div>
  );
};

function SectionItem({
  title,
  number,
  units,
}: {
  title: string;
  number: number;
  units: Unit[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b">
      <div
        className="flex items-center justify-between bg-neutral-50 py-2 px-3 text-sm font-semibold hover:cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div>
          <span>Section {number}: </span>
          <span>{title}</span>
        </div>
        {open ? (
          <ChevronDownIcon className="h-4 w-4" />
        ) : (
          <ChevronRightIcon className="h-4 w-4" />
        )}
      </div>
      {open && (
        <ul>
          {units.map((unit) => {
            return <UnitItem title={unit.title} id={unit.id} />;
          })}
        </ul>
      )}
    </li>
  );
}

function UnitItem({ title, id }: { title: string; id: string }) {
  const { setCurrentUnitId } = useContext(currentUnitContext);
  return (
    <li>
      <button
        className="flex h-full w-full border-cyan-400 py-1 pl-5 hover:border-l-4"
        onClick={() => {
          setCurrentUnitId && setCurrentUnitId(id);
        }}
      >
        <span>{title}</span>
      </button>
    </li>
  );
}
