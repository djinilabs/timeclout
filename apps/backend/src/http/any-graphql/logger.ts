import chalk from "chalk";

export const logger = () => {
  return {
    debug: (...arguments_: unknown[]) => {
      console.debug(chalk.gray(`[graphql] [DEBUG]`), ...arguments_);
    },
    info: (...arguments_: unknown[]) => {
      console.info(chalk.green(`[graphql] [INFO]`), ...arguments_);
    },
    warn: (...arguments_: unknown[]) => {
      console.warn(chalk.yellow(`[graphql] [WARN]`), ...arguments_);
    },
    error: (...arguments_: unknown[]) => {
      console.error(chalk.red(`[graphql] [ERROR]`), ...arguments_);
    },
  };
};
