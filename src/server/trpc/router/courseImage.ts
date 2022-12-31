import { z } from "zod";
import uploadCourseCoverImage from "../../../utils/s3.server";

import { router, publicProcedure } from "../trpc";

export const courseImageRouter = router({
  postPresignedPost: publicProcedure
    .input(z.object({ fileExtension: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const preSignedPost = await uploadCourseCoverImage(input.fileExtension);
        return preSignedPost;
      } catch (error) {
        console.log(error);
      }
    }),
});
