export const calculateMinimumRestSlotsAfterShift = (
  slotInconvenience: number,
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestSlots: number;
  }[]
) => {
  return (
    minimumRestSlotsAfterShift.find(
      (rest) => rest.inconvenienceLessOrEqualThan >= slotInconvenience
    )?.minimumRestSlots ?? 0
  );
};
