import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type ChapterProps = {
  chapterNumber: number;
  chapterTitle: string;
};

const unitSchema = z.object({
  unitTitle: z.string().min(1),
});

type Unit = z.infer<typeof unitSchema>;

export default function Chapter({ chapterTitle }: ChapterProps) {
  const [units, setUnits] = useState<Unit[]>([]);

  const onSubmit: SubmitHandler<Unit> = (data) => {
    setUnits([...units, { unitTitle: data.unitTitle }]);
    setUnitFormOpen(false);
  };

  const { register, handleSubmit } = useForm<Unit>({
    resolver: zodResolver(unitSchema),
  });

  const [unitFormOpen, setUnitFormOpen] = useState(false);
  return (
    <div className="flex flex-col border-b">
      <div className="text-lg">{chapterTitle}</div>
      <ul className="pl-2">
        {units.map((unit, index) => {
          return <li key={index}>{unit.unitTitle}</li>;
        })}
      </ul>
      {!unitFormOpen && (
        <button
          className="flex items-center justify-end text-sm hover:text-cyan-500"
          onClick={() => {
            setUnitFormOpen(true);
          }}
        >
          <PlusCircleIcon className="h-5 w-5 hover:text-cyan-500" />
          Add Unit
        </button>
      )}
      {unitFormOpen && (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <input type="text" {...register("unitTitle")} />
          <div className="flex justify-end">
            <button
              onClick={() => {
                setUnitFormOpen(false);
              }}
            >
              Cancel
            </button>
            <button type="submit">Save Unit</button>
          </div>
        </form>
      )}
    </div>
  );
}
