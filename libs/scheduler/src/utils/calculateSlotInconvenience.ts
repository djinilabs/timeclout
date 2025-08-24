import { Slot } from "../types";

export const calculateSlotInconvenience = (slot: Slot) => {
  return slot.workHours.reduce((accumulator, workHour) => {
    return (
      accumulator + (workHour.end - workHour.start) * workHour.inconvenienceMultiplier
    );
  }, 0);
};
