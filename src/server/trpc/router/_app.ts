import { router } from "../trpc";
import { authRouter } from "./auth";
import { courseRouter } from "./course";
import { courseImageRouter } from "./courseImage";
import { guestbookRouter } from "./guestbook";
import { sectionRouter } from "./section";
import { unitRouter } from "./unit";

export const appRouter = router({
  guestbook: guestbookRouter,
  course: courseRouter,
  auth: authRouter,
  courseImage: courseImageRouter,
  section: sectionRouter,
  unit: unitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
