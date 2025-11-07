export const toMinutes = (args: [number, number] | undefined) => {
  if (!args) {
    return 0;
  }
  const [hours, minutes] = args;
  return hours * 60 + minutes;
};
