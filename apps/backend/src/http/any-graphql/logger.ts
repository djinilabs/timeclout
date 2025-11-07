import chalk from "chalk";

export const logger = () => {
  return {
    debug: (...args: unknown[]) => {
      console.debug(chalk.gray(`[graphql] [DEBUG]`), ...args);
    },
    info: (...args: unknown[]) => {
      console.info(chalk.green(`[graphql] [INFO]`), ...args);
    },
    warn: (...args: unknown[]) => {
      console.warn(chalk.yellow(`[graphql] [WARN]`), ...args);
    },
    error: (...args: unknown[]) => {
      console.error(chalk.red(`[graphql] [ERROR]`), ...args);
    },
  };
};
