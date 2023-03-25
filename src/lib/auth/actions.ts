import { createServerAction$, redirect } from "solid-start/server";
import { getSession, storage } from "./session";

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
