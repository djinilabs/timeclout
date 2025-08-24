import { Slot } from "../types";

export const countTotalMinutesInSlot = (slot: Slot) => {
  return slot.workHours.reduce(
    (accumulator, workHour) => accumulator + workHour.end - workHour.start,
    0
  );
};
