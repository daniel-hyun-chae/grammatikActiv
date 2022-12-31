import cuid from "cuid";
import { router, publicProcedure } from "../trpc";
import { unitCreationSchema } from "../../../components/SectionCreator/UnitCreator";

export const unitRouter = router({
  // delete: publicProcedure
  //   .input(sectionSchema.pick({ sectionId: true }))
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       // Find the course that contains the section to be deleted
  //       const course = await ctx.prisma.course.findFirst({
  //         where: {
  //           sectionsIdList: {
  //             hasEvery: [input.sectionId],
  //           },
  //         },
  //       });

  //       if (!course) throw new Error();

  //       // Prepare the updated list of section IDs.
  //       const newSectionList = course.sectionsIdList.filter((sectionId) => {
  //         return sectionId !== input.sectionId;
  //       });

  //       await ctx.prisma.$transaction([
  //         ctx.prisma.course.update({
  //           where: {
  //             id: course.id,
  //           },
  //           data: {
  //             sectionsIdList: newSectionList,
  //           },
  //         }),
  //         ctx.prisma.section.delete({
  //           where: {
  //             id: input.sectionId,
  //           },
  //         }),
  //       ]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }),
  // updateTitle: publicProcedure
  //   .input(sectionSchema.pick({ sectionId: true, title: true }))
  //   .mutation(async ({ ctx, input }) => {
  //     try {
  //       const updatedSection = await ctx.prisma.section.update({
  //         where: {
  //           id: input.sectionId,
  //         },
  //         data: {
  //           title: input.title,
  //         },
  //       });
  //       return updatedSection;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }),
  post: publicProcedure
    .input(unitCreationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const unitId = cuid();

        // Find the section under which the unit is to be created
        const section = await ctx.prisma.section.findUnique({
          where: {
            id: input.sectionId,
          },
        });
        if (!section) throw new Error();

        // Prepare the updated list of unit IDs.
        const unitIdList = section.unitsIdList;
        let newUnitIdList;
        if (!input.prevUnitId) {
          newUnitIdList = [unitId];
        } else {
          const unitIndex = unitIdList?.indexOf(input.prevUnitId);
          unitIdList.splice(unitIndex + 1, 0, unitId);
          newUnitIdList = unitIdList;
        }

        // Perform creation of the new unit and update of unit ID list in transaction
        const [newUnit] = await ctx.prisma.$transaction([
          ctx.prisma.unit.create({
            data: {
              id: unitId,
              title: input.title,
              sectionId: input.sectionId,
            },
          }),
          ctx.prisma.section.update({
            where: {
              id: input.sectionId,
            },
            data: {
              unitsIdList: newUnitIdList,
            },
          }),
        ]);

        return newUnit;
      } catch (error) {
        console.log(error);
      }
    }),
  // getAll: publicProcedure.input(z.string()).query(({ ctx, input }) => {
  //   return ctx.prisma.section.findMany({
  //     where: {
  //       courseId: input,
  //     },
  //   });
  // }),
});
