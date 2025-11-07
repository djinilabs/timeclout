export const isValidNumber = (value: number | undefined) =>
  value !== undefined && !Number.isNaN(value) && Number.isFinite(value);
