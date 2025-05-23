import { FC, ReactNode } from "react";
import { type User } from "../graphql/graphql";

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

export interface LeaveRequest {
  startDate: string;
  endDate: string;
  type: string;
  approved?: boolean | null;
  reason?: string | null;
  createdAt: string;
  createdBy: User;
  approvedBy?: User[] | null;
  approvedAt?: string[] | null;
  beneficiary: User;
  pk: string;
  sk: string;
}

export interface LeaveDay {
  type: string;
  icon?: ReactNode;
  color?: string;
  leaveRequest?: LeaveRequest;
}
