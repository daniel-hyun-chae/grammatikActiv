import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { Button } from "../ui/Button";

const unitCreationFormSchema = z.object({
  title: z.string().min(1),
});
type UnitCreationForm = z.infer<typeof unitCreationFormSchema>;

export const unitCreationSchema = unitCreationFormSchema.extend({
  subTitle: z.string().nullable(),
  sectionId: z.string(),
  prevUnitId: z.string().nullable(),
});

type UnitCreatorFormProp = {
  onCancelCallback?: () => void;
  sectionId: string;
  prevUnitId: string | null;
};

export function UnitCreatorForm({
  onCancelCallback,
  sectionId,
  prevUnitId,
}: UnitCreatorFormProp) {
  const queryClient = useQueryClient();
  const addUnit = trpc.unit.post.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([["course", "getById"]]);
      onCancelCallback && onCancelCallback();
    },
  });

  const { register, handleSubmit } = useForm<UnitCreationForm>({
    resolver: zodResolver(unitCreationFormSchema),
  });

  const onSubmit = handleSubmit((data) => {
    addUnit.mutate({
      prevUnitId,
      sectionId,
      subTitle: null,
      title: data.title,
    });
  });

  return (
    <form className="flex flex-col" onSubmit={onSubmit}>
      <input
        className="mb-2 bg-neutral-700 px-1"
        placeholder="Enter unit title"
        {...register("title")}
      />
      <div className="flex justify-end space-x-1">
        <Button intent="primary" size="sm" label="Save" type="submit" />
        <Button
          intent="secondary"
          size="sm"
          label="Cancel"
          onClick={() => {
            onCancelCallback && onCancelCallback();
          }}
        />
      </div>
    </form>
  );
}
