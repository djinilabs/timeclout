import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./libs/graphql/src/schema/**/schema.graphql",
  documents: [
    "./apps/frontend/src/graphql/queries/*.graphql",
    "./apps/frontend/src/graphql/mutations/*.graphql",
  ],
  ignoreNoDocuments: true,
  generates: {
    "libs/graphql/src": defineConfig(),
    "apps/frontend/src/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
      documents: [
        "./apps/frontend/src/graphql/queries/*.graphql",
        "./apps/frontend/src/graphql/mutations/*.graphql",
      ],
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
    "apps/frontend/src/graphql.queries.d.ts": {
      documents: ["./apps/frontend/src/graphql/queries/*.graphql"],
      plugins: ["typescript-graphql-files-modules"],
      config: {
        modulePathPrefix: "graphql-client/queries/",
        prefix: "@/",
      },
    },
    "apps/frontend/src/graphql.mutations.d.ts": {
      documents: ["./apps/frontend/src/graphql/mutations/*.graphql"],
      plugins: ["typescript-graphql-files-modules"],
      config: {
        modulePathPrefix: "graphql-client/mutations/",
        prefix: "@/",
      },
    },
  },
};
export default config;
