import type { Section } from "@prisma/client";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const courseRouter = router({
  post: publicProcedure
    .input(
      z.object({
        title: z.string(),
        edition: z.number().nullable(),
        publisher: z.string(),
        coverImageUrl: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.course.create({
          data: {
            title: input.title,
            publisher: input.publisher,
            edition: input.edition,
            coverImageUrl: input.coverImageUrl,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  updateSectionIdList: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
        newSectionIdList: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.course.update({
          where: {
            id: input.courseId,
          },
          data: { sectionsIdList: input.newSectionIdList },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const course = await ctx.prisma.course.findUniqueOrThrow({
        where: {
          id: input,
        },
        include: {
          sections: true,
        },
      });

      course.sections = course.sectionsIdList.map((sectionId) => {
        const section = course.sections.find((section) => {
          return section.id === sectionId;
        });
        return section as Section;
      });

      return course;
    } catch (error) {
      console.log(error);
    }
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.course.findMany();
  }),
});
