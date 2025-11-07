/* eslint-disable */

const documents = {};
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
