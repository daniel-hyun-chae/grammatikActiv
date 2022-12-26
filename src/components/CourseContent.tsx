import { useRouter } from "next/router";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import SectionCreator from "./SectionCreator/SectionCreator";
import Section from "./SectionCreator/SectionCreator";

export const sectionCreateSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().min(1),
  prevSectionId: z.string().min(1).nullable(),
});

export const sectionSchema = sectionCreateSchema.extend({
  sectionId: z.string().min(1),
});

export type Section = z.infer<typeof sectionSchema>;

export default function CourseContent() {
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
        <div className="[SIDEBAR] h-full w-96 overflow-x-auto border-r px-5 dark:bg-neutral-800">
          <div>
            {course.sections.length === 0 && (
              // <>
              //   {!sectionFormOpen && (
              //     <button
              //       className="flex items-center space-x-2 text-cyan-500"
              //       onClick={() => {
              //         setSectionFormOpen(true);
              //       }}
              //     >
              //       <PlusCircleIcon className="h-5 w-5" />
              //       <span>Add a section</span>
              //     </button>
              //   )}
              //   {sectionFormOpen && (
              //     <SectionCreationForm
              //       sectionId={null}
              //       onSubmitCallback={sectionCreationFormCallback}
              //     />
              //   )}
              // </>
              <div>test</div>
            )}
            {course.sections.map((section, index) => {
              return (
                <SectionCreator
                  sectionId={section.id}
                  key={index}
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
}
