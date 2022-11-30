import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const courseRouter = router({
  postCourse: publicProcedure
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
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const course = await ctx.prisma.course.findFirst({
      where: {
        id: input,
      },
      include: {
        sections: true,
      },
    });

    if (course) {
      course.sections = course.sectionsIdList.map((sectionId) => {
        return course.sections.find((section) => {
          return section.id === sectionId;
        });
      });
    }
    return course;
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.course.findMany();
  }),
});
