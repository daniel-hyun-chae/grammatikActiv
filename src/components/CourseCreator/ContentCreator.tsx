import { useRouter } from "next/router";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import Section from "./SectionCreator";
import { TableOfContentCreator } from "./TableOfContentCreator";

export const sectionCreateSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().min(1),
  prevSectionId: z.string().min(1).nullable(),
});

export const sectionSchema = sectionCreateSchema.extend({
  sectionId: z.string().min(1),
});

export type Section = z.infer<typeof sectionSchema>;

export default function CourseContentCreator() {
  const router = useRouter();
  const courseId = router.query.id as string;
  const { data: course, isLoading } = trpc.course.getById.useQuery(courseId);

  if (isLoading) {
    // Replace it to be a spinner
    return <div>Loading...</div>;
  } else if (!course) {
    router.push("/500");
    return null;
  } else {
    return (
      <div className="flex h-full">
        <div className="[SIDEBAR] h-full w-96 overflow-x-auto border-r dark:bg-neutral-800">
          <TableOfContentCreator
            sectionIdList={course.sectionsIdList}
            courseId={courseId}
            sections={course.sections}
          />
        </div>
        <div className="[CONTENT]">Content planner</div>
      </div>
    );
  }
}
