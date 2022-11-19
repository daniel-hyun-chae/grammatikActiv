import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const bookRouter = router({
  postBook: publicProcedure
    .input(
      z.object({
        title: z.string(),
        edition: z.number().nullable(),
        publisher: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.book.create({
          data: {
            title: input.title,
            publisher: input.publisher,
            edition: input.edition,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.book.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.book.findMany();
  }),
});
