export type AccessibleElement = {
  role: string;
  description: string;
  children: AccessibleElement[] | null;
};

export type AccessibilityObjectModel = {
  root: AccessibleElement;
};
