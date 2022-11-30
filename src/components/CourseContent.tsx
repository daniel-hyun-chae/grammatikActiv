import { useRouter } from "next/router";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import SectionCreator from "./SectionCreator";
import Section from "./SectionCreator";

export const sectionSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().min(1),
  sectionId: z.string().min(1).nullable(),
});
export type Section = z.infer<typeof sectionSchema>;

export default function CourseContent() {
  const router = useRouter();
  const { data: course } = trpc.course.getById.useQuery(router.query.id);
  const { data: sections } = trpc.section.getAll.useQuery(router.query.id);

  return (
    <div className="flex h-full p-10">
      <div className="[SIDEBAR] h-full w-72 border-r px-5 dark:bg-neutral-800">
        <div>
          {course?.sections?.length === 0 && (
            <SectionCreator sectionId={null} initial={true} />
          )}
          {course &&
            course.sections.map((section, index) => {
              return (
                <SectionCreator
                  sectionId={section.id}
                  key={index}
                  number={index + 1}
                  title={section.title}
                />
              );
            })}
        </div>
      </div>
      <div className="[CONTENT]">Content planner</div>
    </div>
  );
}
