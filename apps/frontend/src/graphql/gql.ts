const documents = {};
export function graphql(source: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (documents as any)[source] ?? {};
}
