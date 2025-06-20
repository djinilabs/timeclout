import { database } from "@/tables";
import { getResourceRef, ResourceRef } from "@/utils";
import { notFound } from "@hapi/boom";

export const assignShiftPositions = async (
  teamPk: ResourceRef<"teams">,
  assignments: Array<{
    shiftPositionId: string;
    workerPk: string;
  }>,
  actorPk: ResourceRef<"users">
) => {
  const { shift_positions } = await database();
  const assignedPositions = await Promise.all(
    assignments.map(async (assignment) => {
      const { shiftPositionId, workerPk } = assignment;
      const position = await shift_positions.get(
        getResourceRef(teamPk, "teams"),
        shiftPositionId,
        "staging"
      );
      if (!position) {
        throw notFound(`Shift position ${shiftPositionId} not found`);
      }
      position.assignedTo = getResourceRef(workerPk, "users");
      position.updatedBy = actorPk;
      await shift_positions.update(position, "staging");
      return position;
    })
  );
  return assignedPositions;
};
