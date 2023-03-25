import { createCookieSessionStorage } from "solid-start";
import type { APIEvent } from "solid-start/api";
import { redirect } from "solid-start/api";
import { json } from "solid-start/api";
import { createServerAction$, createServerData$ } from "solid-start/server";
import { Err, Ok } from "ts-results";
import { z } from "zod";
import { serverEnv } from "~/env/server";
import { redis } from "~/server/redis";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: serverEnv.NODE_ENV === "production",
    secrets: [serverEnv.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

const SessionSchema = z.object({
  // todo: use user id
  email: z.string().email(),
});

export async function getSession(request: Request) {
  const rawSession = await storage.getSession(request.headers.get("Cookie"));
  const rawData = SessionSchema.safeParse({
    email: rawSession.get("email"),
  });
  if (!rawData.success) {
    return Err(rawData.error);
  }
  return Ok({ data: rawData.data, session: rawSession });
}

export function protected$() {
  return createServerData$(
    async (_, { request }) => {
      const session = await getSession(request);
      if (session.err) {
        throw redirect("/login");
      }
      return session.val.data;
    },
    {
      key: ["session"],
    }
  );
}

export function createLogoutAction$() {
  return createServerAction$(
    async (_, { request }) => {
      console.log("logout");
      const { session } = (await getSession(request)).unwrap();
      return redirect("/login", {
        headers: {
          "Set-Cookie": await storage.destroySession(session),
        },
      });
    },
    {
      invalidate: ["session"],
    }
  );
}

export function unprotected$() {
  return createServerData$(async (_, { request }) => {
    const session = await getSession(request);
    if (session.ok) {
      throw redirect("/");
    }
  });
}

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return json({ message: "Token not provided." }, { status: 400 });
  }

  const savedEmail = await redis.getdel<string>(`email:${token}`);
  const email = z.string().email().safeParse(savedEmail);

  if (!email.success) {
    return json({ message: "Bad request." }, { status: 400 });
  }

  const session = await storage.getSession();
  session.set("email", email.data);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
