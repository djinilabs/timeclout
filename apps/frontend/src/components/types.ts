import { FC, ReactNode } from "react";

export type FieldValue = {
  name: string;
  state: {
    value: string;
    meta: {
      errors: string[];
    };
  };
  handleChange: (value: string) => void;
};

export type FieldComponent = FC<{
  name?: string;
  defaultValue?: string;
  validators?: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  children?: (field: FieldValue) => ReactNode;
}>;
