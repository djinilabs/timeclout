import { variance } from "./variance";

export const stdDev = (mean: number, values: number[]): number => {
  return Math.sqrt(variance(mean, values));
};
