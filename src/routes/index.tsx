import { type VoidComponent } from "solid-js";
import { createLogoutAction$ } from "~/lib/auth/actions";
import { withProtection } from "~/lib/auth/permissions";

const Home: VoidComponent = withProtection((props) => {
  const [, logout] = createLogoutAction$();

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
      {props.session.email}
    </div>
  );
});

export default Home;
