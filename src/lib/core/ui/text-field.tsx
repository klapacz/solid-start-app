import type { VoidComponent } from "solid-js";
import { Show } from "solid-js";
import { splitProps } from "solid-js";
import { TextField } from "@kobalte/core";
import type { TextFieldRootProps } from "@kobalte/core/dist/types/text-field";

export type XTextFieldProps = TextFieldRootProps & {
  label?: string;
};

export const XTextField: VoidComponent<XTextFieldProps> = (props) => {
  const [local, pass] = splitProps(props, ["label"]);
  return (
    <TextField.Root {...pass} class="grid w-full gap-1.5">
      <Show when={local.label}>
        <TextField.Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {local.label}
        </TextField.Label>
      </Show>
      <TextField.Input class="flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900" />
    </TextField.Root>
  );
};
