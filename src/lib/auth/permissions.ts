import { createServerData$, redirect } from "solid-start/server";
import { getSession } from "./session";

export function unprotected$() {
  createServerData$(async (_, { request }) => {
    const session = await getSession(request);
    if (session.ok) {
      throw redirect("/");
    }
  });
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
