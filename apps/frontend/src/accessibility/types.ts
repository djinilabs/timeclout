export type AccessibleElement = Record<string, unknown> & {
  role: string;
  description: string;
  children: AccessibleElement[] | null;
};

export type AccessibilityObjectModel = {
  root: AccessibleElement;
};
