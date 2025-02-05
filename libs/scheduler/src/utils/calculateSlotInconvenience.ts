import { SlotMember } from "../types";

export const calculateSlotInconvenience = (slotMember: SlotMember) => {
  return slotMember.workHours.reduce((acc, workHour) => {
    return (
      acc + (workHour.end - workHour.start) * workHour.inconvenienceMultiplier
    );
  }, 0);
};
