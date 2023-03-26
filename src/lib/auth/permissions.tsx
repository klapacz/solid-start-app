import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { createServerData$, redirect } from "solid-start/server";
import type { SessionData } from "./session";
import { getSession } from "./session";

export const withProtection = (
  Component: VoidComponent<{ session: SessionData }>
) => {
  return () => {
    const data = createServerData$(async (_, { request }) => {
      const session = await getSession(request);
      if (session.isErr()) {
        throw redirect("/login");
      }
      return session.value.data;
    });

    return (
      <Show when={data()} keyed>
        {(session) => <Component session={session} />}
      </Show>
    );
  };
};

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
