import { createServerAction$, redirect } from "solid-start/server";
import { getSession, storage } from "./session";
import { mutation$ } from "@prpc/solid";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { redis } from "~/lib/core/redis";
import { Users } from "~/lib/auth/user";

const BASE_URL = "http://localhost:3000/";

export function createLogoutAction$() {
  return createServerAction$(
    async (_, { request }) => {
      const session = await getSession(request);
      return redirect("/login", {
        headers: {
          "Set-Cookie": await storage.destroySession(
            session.isOk() ? session.value.session : session.error.session
          ),
        },
      });
    },
    {
      invalidate: ["session"],
    }
  );
}

export const login$ = mutation$(
  async ({ payload }) => {
    const user = await Users.findOrCreateByEmail(payload.email);
    if (user.isErr()) {
      throw new Error("Couldn't find or create user for given email.");
    }
    const token = uuid();
    redis.set(`email:${token}`, user.value.id, {
      ex: 60 * 60 * 24, // expires in 24 hours
    });
    const url = new URL(`api/auth/login?token=${token}`, BASE_URL).toString();

    // TODO: sending mail and rate limiting
    console.log("login url:", url);
    return null;
  },
  "auth-login",
  z.object({ email: z.string().email() })
);
