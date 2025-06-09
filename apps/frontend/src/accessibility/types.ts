export type AccessibleElement = Record<string, unknown> & {
  role: string;
  description: string;
  domElement?: Element;
  children: AccessibleElement[] | null;
};

export type AccessibilityObjectModel = {
  root: AccessibleElement;
};
