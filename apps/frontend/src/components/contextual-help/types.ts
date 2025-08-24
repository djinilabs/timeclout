import { ReactNode, ReactElement, ComponentType } from "react";

import { FeatureDependenciesHelpProps as FeatureDependenciesHelpProperties } from "./components/FeatureDependenciesHelp";
import { RoleBasedHelpProps as RoleBasedHelpProperties } from "./components/RoleBasedHelp";

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
  screenshots?: {
    caption: string;
    alt?: string;
    src?: string;
  }[];
  dependencies?: ReactNode;
  roles?: ReactNode;
  content?: ReactElement;
}

export type HelpComponentName = "FeatureDependenciesHelp" | "RoleBasedHelp";
export type HelpComponentProps =
  | FeatureDependenciesHelpProperties
  | RoleBasedHelpProperties;

export type LanguageComponents = {
  [K in HelpComponentName]: ComponentType<HelpComponentProps>;
};

export type LanguageComponentsMap = {
  en: LanguageComponents;
  pt: LanguageComponents;
};
