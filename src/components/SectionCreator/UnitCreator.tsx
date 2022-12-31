import MinusIcon from "@heroicons/react/24/outline/MinusIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Unit } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { IconWithTooltip } from "../IconWithTooltip";

export const unitCreationSchema = z.object({
  title: z.string().min(1),
  subTitle: z.string().nullable(),
  sectionId: z.string(),
  prevUnitId: z.string().nullable(),
});

const firstUnitCreationSchema = unitCreationSchema.pick({ title: true });

type FirstUnitCreation = z.infer<typeof firstUnitCreationSchema>;
// type UnitCreation = z.infer<typeof unitCreationSchema>;

export const UnitCreator = ({
  sectionId,
  units,
}: {
  sectionId: string;
  units: Unit[];
}) => {
  const addUnit = trpc.unit.post.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FirstUnitCreation>({
    resolver: zodResolver(firstUnitCreationSchema),
  });

  const onSubmit = handleSubmit(
    (data) => {
      console.log("data", data);
      addUnit.mutate({
        prevUnitId: null,
        sectionId,
        subTitle: null,
        title: data.title,
      });
    },
    () => {
      console.log("testss");
    }
  );

  return (
    <div className="UNIT border-l-4">
      <div>{errors.title?.message}</div>
      {units.length === 0 && (
        <div className="flex flex-col space-y-1 pl-2">
          <div className="">Add the first unit for the section</div>
          <form className="flex items-center" onSubmit={onSubmit} id="test">
            <input
              className="mr-2 bg-neutral-700 px-1 py-0.5"
              placeholder="Enter unit title"
              {...register("title")}
            />
            <button
              form="test"
              type="submit"
              className="flex items-center rounded-full bg-green-600 px-1 py-0.5"
            >
              {/* <PlusIcon className="h-5 w-5 stroke-2" /> */}
              <span className="text-md ml-0.5 font-semibold capitalize">
                Save
              </span>
            </button>
          </form>
        </div>
      )}
      {units.map((unit) => {
        return (
          <div
            className="[UNIT-HEADER items-center] group flex pl-4"
            key={unit.id}
          >
            <div className="[SECTION-HEADER-TITLE] grow pl-1 hover:bg-neutral-600">
              {unit.title}
            </div>
            <div
              className={`[SECTION-HEADER-MENU] invisible mr-1 flex items-center space-x-1 ${"group-hover:visible"}`}
            >
              <IconWithTooltip
                Icon={PlusIcon}
                tooltipMessage="Click to add a new section below"
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
        );
      })}
    </div>
  );
};
