import { createServerAction$, redirect } from "solid-start/server";
import { getSession, storage } from "./session";

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
