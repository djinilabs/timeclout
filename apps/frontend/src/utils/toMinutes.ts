export const toMinutes = (arguments_: [number, number] | undefined) => {
  if (!arguments_) {
    return 0;
  }
  const [hours, minutes] = arguments_;
  return hours * 60 + minutes;
};
