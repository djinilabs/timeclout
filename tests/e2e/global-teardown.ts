import { timeout } from "@/utils";
import { backendProcess, frontendProcess } from "./global-setup";
import { exec } from "child_process";
import { promisify } from "util";

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

  // Kill the frontend process
  if (frontendProcess) {
    console.log("Stopping frontend server...");
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

  // Kill the backend sandbox process
  if (backendProcess) {
    console.log("Stopping backend sandbox...");
    try {
      backendProcess.kill("SIGTERM");
      await timeout(2000);
      backendProcess.kill("SIGTERM");
      await timeout(2000);

      // Force kill if still running
      if (!backendProcess.killed) {
        backendProcess.kill("SIGKILL");
      }

      // kill all processes waiting on 3333
      await findAndKillProcessesOnPort(3333);

      console.log("✅ Backend sandbox stopped");
    } catch (error) {
      console.error("Error stopping backend sandbox:", error);
    }
  }

  // Add any other cleanup logic here
  // For example, cleaning up test data, stopping services, etc.
}

export default globalTeardown;
