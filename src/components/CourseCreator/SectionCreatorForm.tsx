import { sectionFormSchema } from "../../types/section";
import { useRouter } from "next/router";
import type { SectionForm } from "../../types/section";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";

export function SectionCreatorForm({
  onSubmitCallback,
  sectionId = null,
}: {
  onSubmitCallback?: () => void;
  sectionId: string | null;
}) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<SectionForm>({
    resolver: zodResolver(sectionFormSchema),
  });

  const postSession = trpc.section.post.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries([["sections", "getAll"]]);
      queryClient.invalidateQueries([["course", "getById"]]);
    },
  });

  const onSubmitHandler: SubmitHandler<SectionForm> = (data) => {
    postSession.mutate({
      prevSectionId: sectionId,
      courseId: router.query.id,
      title: data.title,
    });
    onSubmitCallback && onSubmitCallback();
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmitHandler)}>
      <input
        className="mt-2 border-b bg-transparent p-1 text-sm"
        placeholder="Enter section title"
        type="text"
        {...register("title")}
      />
      <div className="mt-2 flex justify-end">
        <button
          className="rounded bg-slate-500 p-1 text-sm font-semibold text-neutral-100"
          onClick={() => {
            onSubmitCallback && onSubmitCallback();
          }}
        >
          Cancel
        </button>
        <button
          className="rounded bg-cyan-500 p-1 text-sm font-semibold text-neutral-100"
          type="submit"
        >
          Save Section
        </button>
      </div>
    </form>
  );
}
