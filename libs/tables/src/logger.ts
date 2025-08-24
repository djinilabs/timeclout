import chalk from "chalk";

export const logger = (tableName: string) => {
  if (
    process.env.NODE_ENV != undefined &&
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
    debug: (...arguments_: unknown[]) => {
      console.debug(
        chalk.gray(`[${new Date().toISOString()}] [${tableName}] [DEBUG]`),
        ...arguments_
      );
    },
    info: (...arguments_: unknown[]) => {
      console.info(
        chalk.green(`[${new Date().toISOString()}] [${tableName}] [INFO]`),
        ...arguments_
      );
    },
    warn: (...arguments_: unknown[]) => {
      console.warn(
        chalk.yellow(`[${new Date().toISOString()}] [${tableName}] [WARN]`),
        ...arguments_
      );
    },
    error: (...arguments_: unknown[]) => {
      console.error(
        chalk.red(`[${new Date().toISOString()}] [${tableName}] [ERROR]`),
        ...arguments_
      );
    },
  };
};
