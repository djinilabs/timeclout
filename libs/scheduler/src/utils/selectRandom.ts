export const selectRandom = <T>(from: Array<T>): T => {
  if (from.length < 1) {
    throw new TypeError("No elements to select from");
  }
  return from[Math.floor(Math.random() * from.length)]!;
};
