import { ReactNode } from "react";

export interface HelpSection {
  title: string;
  description: ReactNode;
  features?: {
    title: string;
    description: string;
  }[];
  sections?: {
    title: string;
    content: ReactNode;
  }[];
  dependencies?: ReactNode;
  roles?: ReactNode;
}
