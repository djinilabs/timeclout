export const calculateMinimumRestMinutesAfterShift = (
  slotInconvenience: number,
  minimumRestSlotsAfterShift: {
    inconvenienceLessOrEqualThan: number;
    minimumRestMinutes: number;
  }[]
) => {
  return (
    minimumRestSlotsAfterShift.find(
      (rest) => rest.inconvenienceLessOrEqualThan >= slotInconvenience
    )?.minimumRestMinutes ?? 0
  );
};
