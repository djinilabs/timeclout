import { Field, Label } from "@headlessui/react";
import { Switch } from "@headlessui/react";
import { FC, ReactNode } from "react";

export interface LabeledSwitchProps {
  id?: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const LabeledSwitch: FC<LabeledSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
}) => {
  return (
    <Field className="flex items-center">
      <div className="flex items-center">
        <Switch
          id={id}
          checked={checked}
          onChange={onChange}
          className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 data-checked:bg-teal-600"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
          />
        </Switch>
        <Label htmlFor={id} as="label" className="ml-3 text-sm">
          <span className="font-medium text-gray-900">{label}</span>
        </Label>
      </div>
    </Field>
  );
};
