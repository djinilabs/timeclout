import { nanoid } from "nanoid";

import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

import { database } from "@/tables";

export interface CreateDemoShiftPositionsResult {
  success: boolean;
  shiftPositions?: unknown[];
  message?: string;
}

export const createDemoShiftPositions = async (
  options: PopulateDemoAccountOptions
): Promise<CreateDemoShiftPositionsResult> => {
  try {
    const { teamPk, industry } = options;
    if (!teamPk) {
      throw new Error("teamPk is required to create shift positions");
    }

    const industryTemplate = getIndustryTemplate(industry);
    const { shift_positions } = await database();

    // Create shift positions for the next 6 weeks (42 days) to give more testing data
    const shiftPositions = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Start from tomorrow

    for (let dayOffset = 0; dayOffset < 42; dayOffset++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + dayOffset);
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateString = currentDate.toISOString().split("T")[0];

      // Create different shift patterns for weekdays vs weekends
      if (isWeekend) {
        // Weekend shifts - reduced coverage, different hours
        if (industry === "healthcare") {
          // Healthcare needs 24/7 coverage even on weekends
          const weekendShifts = [
            {
              name: "Weekend Day",
              color: "lightblue",
              requiredSkills: ["RN License", "BLS Certification"],
              startHour: 8,
              endHour: 20,
              inconveniencePerHour: 1.5, // Higher inconvenience for weekends
            },
            {
              name: "Weekend Night",
              color: "darkblue",
              requiredSkills: [
                "RN License",
                "BLS Certification",
                "Critical Care",
              ],
              startHour: 20,
              endHour: 8,
              inconveniencePerHour: 2.0, // Much higher inconvenience for weekend nights
            },
          ];

          for (const shift of weekendShifts) {
            const shiftPosition = {
              pk: teamPk,
              sk: `${dateString}/${nanoid()}`,
              teamPk,
              day: dateString,
              name: shift.name,
              color: shift.color,
              requiredSkills: shift.requiredSkills,
              schedules: [
                {
                  startHourMinutes: [shift.startHour, 0],
                  endHourMinutes: [shift.endHour, 0],
                  inconveniencePerHour: shift.inconveniencePerHour,
                },
              ],
            };

            await shift_positions.create(shiftPosition);
            shiftPositions.push(shiftPosition);
          }
        } else {
          // Retail/other industries - limited weekend coverage
          const weekendShift = {
            name: "Weekend Shift",
            color: "orange",
            requiredSkills: ["Customer Service"],
            startHour: 10,
            endHour: 18,
            inconveniencePerHour: 1.3,
          };

          const shiftPosition = {
            pk: teamPk,
            sk: `${dateString}/${nanoid()}`,
            teamPk,
            day: dateString,
            name: weekendShift.name,
            color: weekendShift.color,
            requiredSkills: weekendShift.requiredSkills,
            schedules: [
              {
                startHourMinutes: [weekendShift.startHour * 60],
                endHourMinutes: [weekendShift.endHour * 60],
                inconveniencePerHour: weekendShift.inconveniencePerHour,
              },
            ],
          };

          await shift_positions.create(shiftPosition);
          shiftPositions.push(shiftPosition);
        }
      } else {
        // Weekday shifts - full coverage, regular patterns
        if (industry === "healthcare") {
          // Healthcare weekday shifts
          const weekdayShifts = [
            {
              name: "Morning Shift",
              color: "green",
              requiredSkills: ["RN License", "BLS Certification"],
              startHour: 6,
              endHour: 14,
              inconveniencePerHour: 1.0,
            },
            {
              name: "Afternoon Shift",
              color: "blue",
              requiredSkills: ["RN License", "BLS Certification"],
              startHour: 14,
              endHour: 22,
              inconveniencePerHour: 1.0,
            },
            {
              name: "Night Shift",
              color: "navy",
              requiredSkills: [
                "RN License",
                "BLS Certification",
                "Critical Care",
              ],
              startHour: 22,
              endHour: 6,
              inconveniencePerHour: 1.5,
            },
          ];

          for (const shift of weekdayShifts) {
            const shiftPosition = {
              pk: teamPk,
              sk: `${dateString}/${nanoid()}`,
              teamPk,
              day: dateString,
              name: shift.name,
              color: shift.color,
              requiredSkills: shift.requiredSkills,
              schedules: [
                {
                  startHourMinutes: [shift.startHour, 0],
                  endHourMinutes: [shift.endHour, 0],
                  inconveniencePerHour: shift.inconveniencePerHour,
                },
              ],
            };

            await shift_positions.create(shiftPosition);
            shiftPositions.push(shiftPosition);
          }
        } else {
          // Retail/other industries weekday shifts
          const weekdayShifts = [
            {
              name: "Opening Shift",
              color: "green",
              requiredSkills: ["Customer Service", "Inventory Management"],
              startHour: 7,
              endHour: 15,
              inconveniencePerHour: 1.0,
            },
            {
              name: "Mid Shift",
              color: "blue",
              requiredSkills: ["Customer Service"],
              startHour: 11,
              endHour: 19,
              inconveniencePerHour: 1.0,
            },
            {
              name: "Closing Shift",
              color: "purple",
              requiredSkills: ["Customer Service", "Cash Handling"],
              startHour: 15,
              endHour: 23,
              inconveniencePerHour: 1.2,
            },
          ];

          for (const shift of weekdayShifts) {
            const shiftPosition = {
              pk: teamPk,
              sk: `${dateString}/${nanoid()}`,
              teamPk,
              day: dateString,
              name: shift.name,
              color: shift.color,
              requiredSkills: shift.requiredSkills,
              schedules: [
                {
                  startHourMinutes: [shift.startHour, 0],
                  endHourMinutes: [shift.endHour, 0],
                  inconveniencePerHour: shift.inconveniencePerHour,
                },
              ],
            };

            await shift_positions.create(shiftPosition);
            shiftPositions.push(shiftPosition);
          }
        }
      }
    }

    console.log(
      `Demo: Created ${shiftPositions.length} shift positions for ${industryTemplate.name} industry`
    );

    return {
      success: true,
      shiftPositions,
    };
  } catch (error) {
    console.error("Error creating demo shift positions:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
