export function classNames(
  ...classes: Array<string | null | undefined | false>
) {
  return classes.filter(Boolean).join(" ");
}
