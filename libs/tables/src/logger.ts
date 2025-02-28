import chalk from "chalk";

export const logger = (tableName: string) => {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "production"
  ) {
    return {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };
  }
  return {
    debug: (...args: unknown[]) => {
      console.debug(chalk.gray(`[${tableName}] [DEBUG]`), ...args);
    },
    info: (...args: unknown[]) => {
      console.info(chalk.green(`[${tableName}] [INFO]`), ...args);
    },
    warn: (...args: unknown[]) => {
      console.warn(chalk.yellow(`[${tableName}] [WARN]`), ...args);
    },
    error: (...args: unknown[]) => {
      console.error(chalk.red(`[${tableName}] [ERROR]`), ...args);
    },
  };
};
