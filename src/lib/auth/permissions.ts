import { createServerData$, redirect } from "solid-start/server";
import { getSession } from "./session";

export function unprotected$() {
  createServerData$(async (_, { request }) => {
    const session = await getSession(request);
    if (session.isOk()) {
      throw redirect("/");
    }
  });
}

export function protected$() {
  return createServerData$(
    async (_, { request }) => {
      const session = await getSession(request);
      if (session.isErr()) {
        throw redirect("/login");
      }
      return session.value.data;
    },
    {
      key: ["session"],
    }
  );
}
