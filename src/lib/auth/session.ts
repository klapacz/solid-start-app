import { createCookieSessionStorage } from "solid-start";
import { Err, Ok } from "ts-results";
import { z } from "zod";
import { serverEnv } from "~/env/server";

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
