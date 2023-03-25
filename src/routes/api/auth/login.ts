import type { APIEvent } from "solid-start/api";
import { redirect } from "solid-start/api";
import { json } from "solid-start/api";
import { z } from "zod";
import { storage } from "~/lib/auth/session";
import { redis } from "~/server/redis";

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
