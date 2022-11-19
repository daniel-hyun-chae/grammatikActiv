import { router } from "../trpc";
import { authRouter } from "./auth";
import { bookRouter } from "./book";
import { guestbookRouter } from "./guestbook";

export const appRouter = router({
  guestbook: guestbookRouter,
  book: bookRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
