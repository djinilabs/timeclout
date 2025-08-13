import { FullConfig } from "@playwright/test";
import { spawn, ChildProcess } from "child_process";
import { validateEnvironment } from "./config/env";

let backendProcess: ChildProcess | null = null;
let frontendProcess: ChildProcess | null = null;

async function globalSetup(config: FullConfig) {
  // Validate environment variables before starting tests
  console.log("Validating environment configuration...");
  validateEnvironment();

  const { baseURL } = config.projects[0].use;
  console.log("Setting up test environment...");
  console.log(`Base URL: ${baseURL}`);

  // Start the backend sandbox
  console.log("Starting backend sandbox...");

  try {
    // Start the backend sandbox process
    backendProcess = spawn("pnpm", ["dev:backend"], {
      cwd: process.cwd(),
      stdio: "pipe",
      detached: false,
      env: {
        ...process.env,
      },
    });

    // Wait for the backend to be ready
    console.log("Waiting for backend to start...");
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Backend startup timeout"));
      }, 30000); // 30 second timeout

      if (backendProcess?.stdout) {
        backendProcess.stdout.on("data", (data: Buffer) => {
          const output = data.toString();
          console.log(`Backend: ${output.trim()}`);

          // Check if the backend is ready
          if (
            output.includes("Sandbox Started") ||
            output.includes("Local environment ready")
          ) {
            clearTimeout(timeout);
            resolve(true);
          }
        });
      }

      if (backendProcess?.stderr) {
        backendProcess.stderr.on("data", (data: Buffer) => {
          const output = data.toString();
          console.log(`Backend stderr: ${output.trim()}`);
        });
      }

      if (backendProcess) {
        backendProcess.on("error", (error: Error) => {
          clearTimeout(timeout);
          reject(error);
        });

        backendProcess.on("exit", (code: number) => {
          if (code !== 0) {
            clearTimeout(timeout);
            reject(new Error(`Backend process exited with code ${code}`));
          }
        });
      }
    });

    console.log("✅ Backend sandbox started successfully");

    // Wait a bit more for the backend to fully initialize
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Start the frontend server
    console.log("Starting frontend server...");
    frontendProcess = spawn("pnpm", ["dev:frontend"], {
      cwd: process.cwd(),
      stdio: "pipe",
      detached: false,
    });

    // Wait for the frontend to be ready
    console.log("Waiting for frontend to start...");
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Frontend startup timeout"));
      }, 30000); // 30 second timeout

      if (frontendProcess?.stdout) {
        frontendProcess.stdout.on("data", (data: Buffer) => {
          const output = data.toString();
          console.log(`Frontend: ${output.trim()}`);

          // Check if the frontend is ready (Vite typically shows "Local:" when ready)
          if (
            output.includes("Local:") ||
            output.includes("ready in") ||
            output.includes("VITE v")
          ) {
            clearTimeout(timeout);
            resolve(true);
          }
        });
      }

      if (frontendProcess?.stderr) {
        frontendProcess.stderr.on("data", (data: Buffer) => {
          const output = data.toString();
          console.log(`Frontend stderr: ${output.trim()}`);
        });
      }

      if (frontendProcess) {
        frontendProcess.on("error", (error: Error) => {
          clearTimeout(timeout);
          reject(error);
        });

        frontendProcess.on("exit", (code: number) => {
          if (code !== 0) {
            clearTimeout(timeout);
            reject(new Error(`Frontend process exited with code ${code}`));
          }
        });
      }
    });

    console.log("✅ Frontend server started successfully");

    // Wait a bit more for the frontend to fully initialize
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("Failed to start services:", error);
    throw error;
  }
}

export default globalSetup;

// Export the processes so they can be accessed in teardown
export { backendProcess, frontendProcess };
