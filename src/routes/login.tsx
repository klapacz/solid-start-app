import { createSignal, type VoidComponent } from "solid-js";
import { login$ } from "~/lib/auth/actions";
import { unprotected$ } from "~/lib/auth/permissions";
import { XButton } from "~/lib/core/ui/button";
import { XTextField } from "~/lib/core/ui/text-field";

export function routeData() {
  return unprotected$();
}

const LoginPage: VoidComponent = () => {
  const [email, setEmail] = createSignal("");
  const login = login$();

  return (
    <div class="rounded-md border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-800">
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
