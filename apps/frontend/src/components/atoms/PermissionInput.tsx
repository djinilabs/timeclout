/* eslint-disable react/no-children-prop */
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { i18n } from "@lingui/core";

import { ListBox } from "../particles/ListBox";
import { FieldComponent } from "../types";

export interface PermissionInputProps {
  Field: FieldComponent;
}

export const PermissionInput = ({ Field }: PermissionInputProps) => {
  return (
    <Field
      name="permission"
      defaultValue="1"
      validators={{
        onChange: ({ value }) => {
          if (!value) {
            return i18n.t("Please select a permission");
          }
        },
      }}
      children={(field) => {
        return (
          <div className="grid grid-cols-1">
            <ListBox
              options={[
                { key: "1", value: i18n.t("Member") },
                { key: "2", value: i18n.t("Admin") },
                { key: "3", value: i18n.t("Owner") },
              ]}
              selected={field.state.value ?? "2"}
              onChange={(value) => field.handleChange(value.toString())}
            />
            {field.state.meta.errors.length > 0 ? (
              <ExclamationCircleIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
              />
            ) : null}
            {field.state.meta.errors.length > 0 ? (
              <p className="mt-2 text-sm text-red-600">
                {field.state.meta.errors.join(", ")}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
};
