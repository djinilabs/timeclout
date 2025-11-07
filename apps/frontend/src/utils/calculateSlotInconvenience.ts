import { Slot } from "@/scheduler";

export const calculateSlotInconvenience = (slot: Slot) => {
  return slot.workHours.reduce(
    (acc, workHour) =>
      acc + workHour.inconvenienceMultiplier * (workHour.end - workHour.start),
    0
  );
};
