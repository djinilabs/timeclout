/// <reference types="vite/client" />

declare module "*.md?raw" {
  const content: string;
  export default content;
}

declare module "*?worker" {
  const WorkerConstructor: {
    new (): Worker;
  };
  export default WorkerConstructor;
}
