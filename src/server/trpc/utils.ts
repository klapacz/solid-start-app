import { initTRPC } from "@trpc/server";
import { getSession } from "~/routes/api/auth/login";
import type { IContext } from "./context";

export const t = initTRPC.context<IContext>().create();
export const router = t.router;
export const procedure = t.procedure;

export const authedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    const session = await getSession(ctx.req);
    if (session.ok) {
      return next({ ctx: { ...ctx, session: session.val } });
    }
    throw session.val;
  })
);
