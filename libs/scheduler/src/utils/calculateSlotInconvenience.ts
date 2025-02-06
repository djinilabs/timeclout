import { Slot } from "../types";

export const calculateSlotInconvenience = (slot: Slot) => {
  return slot.workHours.reduce((acc, workHour) => {
    return (
      acc + (workHour.end - workHour.start) * workHour.inconvenienceMultiplier
    );
  }, 0);
};
