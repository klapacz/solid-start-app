import { Suspense, type VoidComponent } from "solid-js";
import { useRouteData } from "solid-start";
import { createLogoutAction$ } from "~/lib/auth/actions";
import { protected$ } from "~/lib/auth/permissions";

export function routeData() {
  return protected$();
}

const Home: VoidComponent = () => {
  const [, logout] = createLogoutAction$();
  const session = useRouteData<typeof routeData>();

  return (
    <div class="rounded-md border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-800">
      <button
        onClick={() => {
          console.log("logout fe");
          logout();
        }}
        class="border-red-500 border-2"
      >
        Logout
      </button>
      <Suspense fallback={"loading"}>{session()?.email}</Suspense>
    </div>
  );
};

export default Home;
