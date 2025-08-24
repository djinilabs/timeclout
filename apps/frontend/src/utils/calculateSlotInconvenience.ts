import { Slot } from "@/scheduler";

export const calculateSlotInconvenience = (slot: Slot) => {
  return slot.workHours.reduce(
    (accumulator, workHour) =>
      accumulator + workHour.inconvenienceMultiplier * (workHour.end - workHour.start),
    0
  );
};
