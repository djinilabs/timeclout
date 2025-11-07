import { ShiftPosition } from "libs/graphql/src/types.generated";

export const shiftPositionKey = (shiftPosition: ShiftPosition) =>
  `${shiftPosition.pk}//${shiftPosition.sk}`;
