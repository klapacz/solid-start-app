import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { storage } from "~/routes/api/auth/login";
import type { IContext } from "./context";

export const t = initTRPC.context<IContext>().create();
export const router = t.router;
export const procedure = t.procedure;

export const authedProcedure = t.procedure.use(
  t.middleware(async ({ ctx, next }) => {
    const session = await storage.getSession(ctx.req.headers.get("Cookie"));
    const email = z.string().email().parse(session.get("email"));

    return next({ ctx: { ...ctx, email } });
  })
);
