export type AccessibleElement = {
  role: string;
  description: string;
  attributes: Record<string, string>;
  domElement?: Element;
  children: AccessibleElement[] | null;
};

export type AccessibilityObjectModel = {
  root: AccessibleElement;
};
