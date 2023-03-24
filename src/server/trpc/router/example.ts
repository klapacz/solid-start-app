import { z } from "zod";
import { authedProcedure, procedure, router } from "../utils";
import { v4 as uuid } from "uuid";
import { redis } from "~/server/redis";

const BASE_URL = "http://localhost:3000/";

export default router({
  auth: router({
    login: procedure
      .input(
        z.object({
          email: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        const token = uuid();
        redis.set(`email:${token}`, input.email, {
          ex: 60 * 60 * 24, // expires in 24 hours
        });
        const url = new URL(
          `api/auth/login?token=${token}`,
          BASE_URL
        ).toString();

        console.log("login url:", url);
        return null;
      }),
    session: authedProcedure.query(async ({ ctx }) => {
      return {
        email: ctx.session.data.email,
      };
    }),
  }),
  hello: procedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      await new Promise((resolve) => setTimeout(resolve, 10000));
      return `Hello ${input.name}`;
    }),
  random: procedure
    .input(z.object({ num: z.number() }))
    .mutation(async ({ input }) => {
      return Math.floor(Math.random() * 100) / input.num;
    }),
});
