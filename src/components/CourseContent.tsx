import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Chapter from "./Chapter";

export default function CourseContent() {
  const [chapters, setChapters] = useState<Chapter[]>([
    { chapterTitle: "test" },
    { chapterTitle: "test2" },
  ]);

  const chapterSchema = z.object({
    chapterTitle: z.string().min(1),
  });

  type Chapter = z.infer<typeof chapterSchema>;

  const { register, handleSubmit } = useForm<Chapter>({
    resolver: zodResolver(chapterSchema),
  });

  const onSubmit: SubmitHandler<Chapter> = (data) => {
    setChapters([...chapters, { chapterTitle: data.chapterTitle }]);
  };

  return (
    <div className="flex h-full p-10">
      <div className="[SIDEBAR] h-full border-r px-5 dark:bg-neutral-800">
        <div>
          {chapters.map((chapter, index) => {
            return (
              <Chapter
                key={index}
                chapterNumber={index + 1}
                chapterTitle={chapter.chapterTitle}
              />
            );
          })}
        </div>
        <div>
          <div className="flex cursor-pointer items-center space-x-2">
            <PlusCircleIcon className="h-5 w-5 text-cyan-600" />
            <span className="semib text-cyan-600">Add a chapter</span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label>Chapter title: </label>
              <input {...register("chapterTitle")} />
            </div>
            <button type="submit">Save chapter</button>
          </form>
        </div>
      </div>
      <div className="[CONTENT]">Content planner</div>
    </div>
  );
}
