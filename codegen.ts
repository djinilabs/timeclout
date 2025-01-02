import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  schema: "libs/graphql/src/schema/**/schema.graphql",
  documents: "apps/frontend/src/**/*.tsx",
  ignoreNoDocuments: true,
  generates: {
    "libs/graphql/src": defineConfig(),
    "apps/frontend/src/graphql/": {
      preset: "client",
    },
  },
};
export default config;
