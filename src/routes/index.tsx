import { createSignal, Suspense, type VoidComponent } from "solid-js";
import { createServerData$, redirect } from "solid-start/server";
import { z } from "zod";
import { trpc } from "~/utils/trpc";
import { storage } from "./api/auth/login";

export function routeData() {
  return createServerData$(async (_, { request }) => {
    const session = await storage.getSession(request.headers.get("Cookie"));
    const email = z.string().email().safeParse(session.get("email"));

    if (!email.success) {
      throw redirect("/login");
    }
  });
}

const Home: VoidComponent = () => {
  const [name, setName] = createSignal("");
  const session = trpc.example.auth.session.useQuery();

  return (
    <div class="rounded-md border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-800">
      <Suspense fallback={"loading"}>{session.data?.email}</Suspense>

      <input type="text" onChange={(e) => setName(e.currentTarget.value)} />
    </div>
  );
};

export default Home;
