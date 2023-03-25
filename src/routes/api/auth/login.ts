import type { APIEvent } from "solid-start/api";
import { redirect } from "solid-start/api";
import { json } from "solid-start/api";
import { storage } from "~/lib/auth/session";
import { Users } from "~/lib/auth/user";
import { redis } from "~/server/redis";

export async function GET({ request }: APIEvent) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return json({ message: "Token not provided." }, { status: 400 });
  }

  const userId = await redis.getdel<string>(`email:${token}`);
  if (!userId) {
    return json({ message: "Invalid token." }, { status: 400 });
  }
  const user = await Users.updateSetConfirmed(userId);
  if (user.isErr()) {
    return json("Server error.", { status: 500 });
  }

  const session = await storage.getSession();
  session.set("email", user.value.email);
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}
