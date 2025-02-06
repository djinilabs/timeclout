import { database } from "@/tables";
import { getDefined, getResourceRef, ResourceRef } from "@/utils";
import { teamMembersQualifications } from "../team/teamMembersQualifications";
import { getLeaveRequestsForDateRange } from "../leaveRequest/getLeaveRequestsForDateRange";
import { DayDate } from "@/day-date";
import { getEntitySettings } from "../entity/getEntitySettings";
import { LeaveType } from "@/settings";
import { teamMembersUsers } from "../team/teamMembersUsers";

export interface AutoFillWorkerLeave {
  start: number;
  end: number;
  type: string;
  isPersonal: boolean;
}

export interface AutoFillSlotWorker {
  pk: ResourceRef<"users">;
  name: string;
  qualifications: string[];
  approvedLeaves: AutoFillWorkerLeave[];
}

export interface AutoFillWorkHour {
  start: number;
  end: number;
  inconvenienceMultiplier: number;
}

export interface AutoFillSlot {
  workHours: AutoFillWorkHour[];
  startsOnStandardWorkDay: boolean;
}

export interface ShiftsAutoFillParams {
  workers: AutoFillSlotWorker[];
  slots: AutoFillSlot[];
}

const hourMinutesToMinutes = ([hours, minutes]: [number, number]) => {
  return hours * 60 + minutes;
};

const diffInMinutes = (start: DayDate, end: DayDate) => {
  return end.diffInMinutes(start);
};

export const shiftsAutoFillParams = async (
  team: ResourceRef<"teams">,
  _startDay: string,
  _endDay: string
): Promise<ShiftsAutoFillParams> => {
  const startDay = new DayDate(_startDay);
  const endDay = new DayDate(_endDay);
  const { shift_positions, entity } = await database();

  const members = await teamMembersUsers(team);
  const membersAndQualifications = await teamMembersQualifications(team);
  const workers: AutoFillSlotWorker[] = members.map((member) => ({
    pk: getResourceRef(member.pk, "users"),
    name: member.name,
    qualifications:
      membersAndQualifications.find((m) => m.userPk === member.pk)
        ?.qualifications ?? [],
    approvedLeaves: [],
  }));

  // get the company pk
  const teamEntity = getDefined(await entity.get(team), "Team not found");
  const companyPk = getResourceRef(
    getDefined(teamEntity?.parentPk, "Company not found"),
    "companies"
  );

  const leaveTypes = await getEntitySettings(companyPk, "leaveTypes");
  const leaveTypesByName = getDefined(
    leaveTypes?.reduce(
      (acc, leaveType) => {
        acc[leaveType.name] = leaveType;
        return acc;
      },
      {} as Record<string, LeaveType>
    ),
    "Leave types not found for company"
  );

  // get approved leaves for each worker
  const approvedLeaves = await Promise.all(
    workers.map(async (worker) =>
      (
        await getLeaveRequestsForDateRange(
          companyPk,
          worker.pk,
          startDay,
          endDay
        )
      )
        .filter((leave) => leave.approved)
        .map((leave) => ({
          start: diffInMinutes(startDay, new DayDate(leave.startDate)),
          end: diffInMinutes(startDay, new DayDate(leave.endDate)),
          type: leave.type,
          isPersonal:
            getDefined(
              leaveTypesByName[leave.type],
              `Leave type ${leave.type} not found`
            ).isPersonal ?? false,
        }))
    )
  );

  // set the approvedLeaves attribyte in the workers array by iterating over the approvedLeaves array and setting the approvedLeaves attribute in the workers array
  workers.forEach((worker, index) => {
    worker.approvedLeaves = approvedLeaves[index];
  });

  const shiftPositions = await shift_positions.query({
    KeyConditionExpression: "pk = :pk AND sk BETWEEN :startDay AND :endDay",
    ExpressionAttributeValues: {
      ":pk": team,
      ":startDay": startDay,
      ":endDay": endDay,
    },
  });

  const slots: AutoFillSlot[] = shiftPositions.map((position) => {
    const day = new DayDate(position.day);
    const diff = diffInMinutes(startDay, day);
    return {
      workHours: position.schedules.map((schedule) => ({
        start:
          diff +
          hourMinutesToMinutes(schedule.startHourMinutes as [number, number]),
        end:
          diff +
          hourMinutesToMinutes(schedule.endHourMinutes as [number, number]),
        inconvenienceMultiplier: schedule.inconveniencePerHour / 60,
      })),
      startsOnStandardWorkDay: day.getWeekDayNumber() >= 5,
    };
  });

  return {
    workers,
    slots,
  };
};
