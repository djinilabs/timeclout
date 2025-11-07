import { exec } from "child_process";
import { promisify } from "util";

import { timeout } from "../../libs/utils/src";

import { backendProcess, frontendProcess } from "./global-setup";

const execAsync = promisify(exec);

async function findAndKillProcessesOnPort(port: number): Promise<void> {
  try {
    // Find processes listening on the specified port
    const { stdout } = await execAsync(`lsof -ti:${port}`);

    if (stdout.trim()) {
      const pids = stdout.trim().split("\n");
      console.log(`Found ${pids.length} process(es) on port ${port}:`, pids);

      // Kill each process
      for (const pid of pids) {
        try {
          await execAsync(`kill -9 ${pid}`);
          console.log(`Killed process ${pid}`);
        } catch (error) {
          console.log(`Failed to kill process ${pid}:`, error);
        }
      }
    } else {
      console.log(`No processes found on port ${port}`);
    }
  } catch (error) {
    // If lsof fails (e.g., on Windows), try alternative approach
    console.log(`lsof failed, trying alternative method:`, error);
    try {
      // Alternative: use netstat (works on more systems)
      const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
      if (stdout.trim()) {
        const lines = stdout.trim().split("\n");
        for (const line of lines) {
          const match = line.match(/\s+(\d+)\s*$/);
          if (match) {
            const pid = match[1];
            try {
              await execAsync(`taskkill /PID ${pid} /F`);
              console.log(`Killed process ${pid} using taskkill`);
            } catch (error) {
              console.log(`Failed to kill process ${pid}:`, error);
            }
          }
        }
      }
    } catch (altError) {
      console.log(`Alternative method also failed:`, altError);
    }
  }
}

async function globalTeardown() {
  console.log("Cleaning up test environment...");

  // Check if we're testing against localhost to determine if we need to clean up local services
  const baseURL = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL;

  if (!baseURL || !baseURL.startsWith("http://localhost")) {
    console.log(
      "Testing against remote environment, skipping local service cleanup"
    );
    console.log("✅ Test environment cleanup completed");
    return;
  }

  // Clean up the ports used by the local test services
  const backendPort = 3333;
  const frontendPort = 3000;

  // Kill any processes on the backend port
  console.log("Cleaning up backend port...");
  await findAndKillProcessesOnPort(backendPort);

  // Kill any processes on the frontend port
  console.log("Cleaning up frontend port...");
  await findAndKillProcessesOnPort(frontendPort);

  // Also try to stop the processes that were started by the test runner (only for local testing)
  if (baseURL && baseURL.startsWith("http://localhost")) {
    if (frontendProcess) {
      console.log("Stopping frontend server started by test runner...");
      try {
        frontendProcess.kill("SIGTERM");
        await timeout(2000);
        frontendProcess.kill("SIGTERM");
        await timeout(2000);

        // Force kill if still running
        if (!frontendProcess.killed) {
          frontendProcess.kill("SIGKILL");
        }

        console.log("✅ Frontend server stopped");
      } catch (error) {
        console.error("Error stopping frontend server:", error);
      }
    }

    if (backendProcess) {
      console.log("Stopping backend sandbox started by test runner...");
      try {
        backendProcess.kill("SIGTERM");
        await timeout(2000);
        backendProcess.kill("SIGTERM");
        await timeout(2000);

        // Force kill if still running
        if (!backendProcess.killed) {
          backendProcess.kill("SIGKILL");
        }

        console.log("✅ Backend sandbox stopped");
      } catch (error) {
        console.error("Error stopping backend sandbox:", error);
      }
    }
  }

  console.log("✅ Test environment cleanup completed");
}

export default globalTeardown;
