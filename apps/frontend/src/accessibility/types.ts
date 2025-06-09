export type AccessibleElement = {
  "aria-role": string;
  "aria-description": string;
  attributes: Record<string, string>;
  domElement?: Element;
  children: AccessibleElement[] | null;
};

export type AccessibilityObjectModel = {
  root: AccessibleElement;
};
