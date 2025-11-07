export const dayAndMinutesToDate = (day: string, time: number) => {
  const date = new Date(day);
  date.setMinutes(time);
  return date.toISOString().slice(0, 16);
};
