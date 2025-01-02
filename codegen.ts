import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  schema: "libs/graphql/src/schema/**/schema.graphql",
  generates: {
    "libs/graphql/src": defineConfig(),
  },
};
export default config;
