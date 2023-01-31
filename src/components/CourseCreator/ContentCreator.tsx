import { useRouter } from "next/router";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useState } from "react";

import { z } from "zod";
import { trpc } from "../../utils/trpc";
import Section from "./SectionCreator";
import { TableOfContentCreator } from "./TableOfContentCreator";
import UnitContentDesigner from "./UnitContentDesigner";

export const sectionCreateSchema = z.object({
  title: z.string().min(1),
  courseId: z.string().min(1),
  prevSectionId: z.string().min(1).nullable(),
});

export const sectionSchema = sectionCreateSchema.extend({
  sectionId: z.string().min(1),
});

export type Section = z.infer<typeof sectionSchema>;

export const selectedUnitContext = createContext<{
  selectedUnitId: string | undefined;
  setSelectedUnitId: Dispatch<SetStateAction<string | undefined>> | undefined;
}>({ selectedUnitId: undefined, setSelectedUnitId: undefined });

export default function CourseContentCreator() {
  const router = useRouter();
  const courseId = router.query.id as string;

  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(
    undefined
  );

  const { data: course, isLoading } = trpc.course.getById.useQuery(courseId, {
    onSuccess: () => {
      setSelectedUnitId(course?.sections[0]?.id);
    },
  });

  if (isLoading) {
    // Replace it to be a spinner
    return <div>Loading...</div>;
  } else if (!course) {
    router.push("/500");
    return null;
  } else {
    return (
      <selectedUnitContext.Provider
        value={{ selectedUnitId, setSelectedUnitId }}
      >
        <div className="flex h-full w-full">
          <div className="[SIDEBAR] h-full w-96 border-r dark:bg-neutral-800">
            <TableOfContentCreator
              sectionIdList={course.sectionsIdList}
              courseId={courseId}
              sections={course.sections}
            />
          </div>
          <div className="[unit-content-designer-wrapper] h-full w-full overflow-hidden">
            <UnitContentDesigner selectedUnitId={selectedUnitId} />
          </div>
        </div>
      </selectedUnitContext.Provider>
    );
  }
}
