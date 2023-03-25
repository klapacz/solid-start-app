import { err, ok, ResultAsync } from "neverthrow";
import { createCookieSessionStorage } from "solid-start";
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

export function getSession(request: Request) {
  return ResultAsync.fromSafePromise(
    storage.getSession(request.headers.get("Cookie"))
  ).andThen((session) => {
    const data = SessionSchema.safeParse({
      email: session.get("email"),
    });
    return data.success
      ? ok({ data: data.data, session })
      : // on error we can return created session anyway
        err({ error: data.error, session });
  });
}
