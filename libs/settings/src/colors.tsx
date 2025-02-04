export const colors: Record<string, string> = {
  blue: "#60a5fa", // A pleasant sky blue
  green: "#4ade80", // A fresh mint green
  red: "#f87171", // A soft coral red
  yellow: "#fbbf24", // A warm yellow
  purple: "#a78bfa", // A soft purple
  pink: "#f9a8d4", // A gentle rose pink
  orange: "#fdba74", // A muted peach orange
  teal: "#5eead4", // A calming sea teal
  indigo: "#818cf8", // A dreamy indigo
  lime: "#bef264", // A fresh spring lime
  gray: "#9ca3af", // A neutral gray
};

export const colorNames = Object.keys(colors) as [string, ...string[]];

export type ColorName = (typeof colorNames)[number];
