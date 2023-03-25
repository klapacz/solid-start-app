import { createSignal, type VoidComponent } from "solid-js";
import { unprotected$ } from "~/lib/auth/permissions";
import { XTextField } from "~/lib/core/ui/text-field";
import { trpc } from "~/utils/trpc";

export function routeData() {
  return unprotected$();
}

const LoginPage: VoidComponent = () => {
  const [email, setEmail] = createSignal("");
  const login = trpc.example.auth.login.useMutation();

  return (
    <div class="rounded-md border border-slate-100 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-800">
      <XTextField value={email()} onValueChange={setEmail} label="Email" />
      <button
        onClick={() => {
          login.mutate({ email: email() });
        }}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
