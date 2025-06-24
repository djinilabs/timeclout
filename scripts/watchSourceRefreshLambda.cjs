const chokidar = require("chokidar");
const { sync: glob } = require("glob");
const { execSync } = require("child_process");

const watcher = chokidar.watch("./libs", {
  ignoreInitial: true,
});

console.log("Watching for changes in libs");

watcher.on("all", async () => {
  try {
    // Find all index.ts files in both directories
    const httpFiles = glob("apps/backend/src/http/**/index.ts");
    const queueFiles = glob("apps/backend/src/queues/**/index.ts");
    const manifestFiles = glob("package.json");
    const allFiles = [...httpFiles, ...queueFiles, ...manifestFiles];

    // Touch each file by reading and writing back its contents
    for (const file of allFiles) {
      console.log("Touching", file);
      execSync(`touch "${file}"`);
      await new Promise(resolve => setTimeout(resolve, 500));
    };

  } catch (error) {
    console.error("Error updating files:", error);
  }
});
