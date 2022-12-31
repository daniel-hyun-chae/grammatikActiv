import { z } from "zod";
import {
  sectionCreateSchema,
  sectionSchema,
} from "../../../components/CourseCreator/ContentCreator";
import cuid from "cuid";

import { router, publicProcedure } from "../trpc";

export const sectionRouter = router({
  delete: publicProcedure
    .input(sectionSchema.pick({ sectionId: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Find the course that contains the section to be deleted
        const course = await ctx.prisma.course.findFirst({
          where: {
            sectionsIdList: {
              hasEvery: [input.sectionId],
            },
          },
        });

        if (!course) throw new Error();

        // Prepare the updated list of section IDs.
        const newSectionList = course.sectionsIdList.filter((sectionId) => {
          return sectionId !== input.sectionId;
        });

        await ctx.prisma.$transaction([
          ctx.prisma.course.update({
            where: {
              id: course.id,
            },
            data: {
              sectionsIdList: newSectionList,
            },
          }),
          ctx.prisma.section.delete({
            where: {
              id: input.sectionId,
            },
          }),
        ]);
      } catch (error) {
        console.log(error);
      }
    }),
  updateTitle: publicProcedure
    .input(sectionSchema.pick({ sectionId: true, title: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedSection = await ctx.prisma.section.update({
          where: {
            id: input.sectionId,
          },
          data: {
            title: input.title,
          },
        });
        return updatedSection;
      } catch (error) {
        console.log(error);
      }
    }),
  post: publicProcedure
    .input(sectionCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sectionId = cuid();

        // Find the course for which the section is to be created
        const course = await ctx.prisma.course.findUnique({
          where: {
            id: input.courseId,
          },
        });
        if (!course) throw new Error();

        // Prepare the updated list of section IDs.
        const sectionIdList = course.sectionsIdList;
        let newSectionList;
        if (!input.prevSectionId) {
          newSectionList = [sectionId];
        } else {
          const sectionIndex = sectionIdList?.indexOf(input.prevSectionId);
          sectionIdList.splice(sectionIndex + 1, 0, sectionId);
          newSectionList = sectionIdList;
        }

        // Perform creation of the new section and update of section ID list in transaction
        const [newSection] = await ctx.prisma.$transaction([
          ctx.prisma.section.create({
            data: {
              id: sectionId,
              title: input.title,
              courseId: input.courseId,
            },
          }),
          ctx.prisma.course.update({
            where: {
              id: input.courseId,
            },
            data: {
              sectionsIdList: newSectionList,
            },
          }),
        ]);

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
