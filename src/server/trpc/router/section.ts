import { z } from "zod";
import { sectionSchema } from "../../../components/CourseContent";

import { router, publicProcedure } from "../trpc";

export const sectionRouter = router({
  postSection: publicProcedure
    .input(sectionSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const newSection = await ctx.prisma.section.create({
          data: {
            title: input.title,
            courseId: input.courseId,
          },
        });

        const course = await ctx.prisma.course.findUnique({
          where: {
            id: input.courseId,
          },
        });

        if (!course) throw new Error();

        const sectionIdList = course.sectionsIdList;
        let newSectionList;
        if (!input.sectionId) {
          newSectionList = [newSection.id];
        } else {
          const sectionIndex = sectionIdList?.indexOf(input.sectionId);
          sectionIdList.splice(sectionIndex + 1, 0, newSection.id);
          newSectionList = sectionIdList;
        }

        await ctx.prisma.course.update({
          where: {
            id: input.courseId,
          },
          data: {
            sectionsIdList: newSectionList,
          },
        });

        return newSection;
      } catch (error) {
        console.log(error);
      }
    }),
  getAll: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.section.findMany({
      where: {
        courseId: input,
      },
    });
  }),
});
