import { Slot } from "../types";

export const countTotalMinutesInSlot = (slot: Slot) => {
  return slot.workHours.reduce(
    (acc, workHour) => acc + workHour.end - workHour.start,
    0
  );
};
