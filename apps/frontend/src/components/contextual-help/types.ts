import { ReactNode, ReactElement, ComponentType } from "react";
import { FeatureDependenciesHelpProps } from "./components/FeatureDependenciesHelp";
import { RoleBasedHelpProps } from "./components/RoleBasedHelp";

export interface HelpSection {
  title: string;
  description: ReactNode;
  features?: {
    title: string;
    description: ReactNode;
  }[];
  sections?: {
    title: string;
    content: ReactNode;
  }[];
  dependencies?: ReactNode;
  roles?: ReactNode;
  content?: ReactElement;
}

export type HelpComponentName = "FeatureDependenciesHelp" | "RoleBasedHelp";
export type HelpComponentProps =
  | FeatureDependenciesHelpProps
  | RoleBasedHelpProps;

export type LanguageComponents = {
  [K in HelpComponentName]: ComponentType<HelpComponentProps>;
};

export type LanguageComponentsMap = {
  en: LanguageComponents;
  pt: LanguageComponents;
};
