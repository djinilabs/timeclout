/* eslint-disable @typescript-eslint/no-explicit-any */

const documents = {};
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
