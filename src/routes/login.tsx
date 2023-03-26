import { createSignal, type VoidComponent } from "solid-js";
import { login$ } from "~/lib/auth/actions";
import { XButton } from "~/lib/core/ui/button";
import { XTextField } from "~/lib/core/ui/text-field";
import { getSession } from "~/lib/auth/session";
import { createServerData$, redirect } from "solid-start/server";

const LoginPage: VoidComponent = () => {
  const [email, setEmail] = createSignal("");
  const login = login$();
  const protector = createServerData$(async (_, { request }) => {
    const session = await getSession(request);
    if (session.isOk()) {
      throw redirect("/");
    }
    return null;
  });

  return (
    <div class="rounded-md border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-800">
      {/* protector must be read to execute redirect */}
      {protector()}
      <XTextField value={email()} onValueChange={setEmail} label="Email" />
      <XButton
        onClick={() => {
          login.mutate({ email: email() });
        }}
      >
        Login
      </XButton>
    </div>
  );
};

export default LoginPage;
