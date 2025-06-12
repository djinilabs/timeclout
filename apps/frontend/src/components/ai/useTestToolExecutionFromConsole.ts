import { ToolSet } from "ai";
import { useEffect } from "react";
export const useTestToolExecutionFromConsole = (tools: ToolSet) => {
  useEffect(() => {
    // for testing purposes let the user run any too from the command line
    const previousRunTool = (
      globalThis as unknown as {
        run_tool: (
          toolName: string,
          args?: Record<string, unknown>
        ) => Promise<void>;
      }
    ).run_tool;
    (
      globalThis as unknown as {
        run_tool: (
          toolName: string,
          args?: Record<string, unknown>
        ) => Promise<void>;
      }
    ).run_tool = async (toolName: string, args?: Record<string, unknown>) => {
      console.log("running tool", toolName, args);
      const tool = tools[toolName];
      if (!tool) {
        console.error("Tool not found", toolName);
        return;
      }
      if (!tool.execute) {
        console.error("Tool does not have an execute function", toolName);
        return;
      }
      const result = await tool.execute(args as unknown, {
        toolCallId: crypto.randomUUID(),
        messages: [],
        abortSignal: new AbortController().signal,
      });
      console.log("tool result", result);
    };

    return () => {
      (
        globalThis as unknown as {
          run_tool: (
            toolName: string,
            args?: Record<string, unknown>
          ) => Promise<void>;
        }
      ).run_tool = previousRunTool;
    };
  }, []);
};
