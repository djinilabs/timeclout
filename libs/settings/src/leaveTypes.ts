import { z } from "zod";
import { colorNames } from "./colors";

const leaveTypesSchema = z.array(
  z.object({
    name: z.string(),
    showInCalendarAs: z.enum(["busy", "available", "ooo"]),
    visibleTo: z.enum(["managers", "employees"]),
    deductsFromAnnualAllowance: z.boolean(),
    needsManagerApproval: z.boolean(),
    isPersonal: z.boolean().optional(),
    icon: z.enum([
      "umbrella",
      "spa",
      "hospital",
      "stroller",
      "meeting",
      "compassionate",
      "wellbeing",
      "book",
      "plane",
      "home",
      "briefcase",
      "graduation",
      "medkit",
      "baby",
      "handshake",
      "coffee",
    ]),
    color: z.enum(colorNames),
  })
);

export const leaveTypeParser = {
  parse: (item: unknown): LeaveTypes => {
    try {
      return leaveTypesSchema.parse(item);
    } catch (err) {
      throw new Error(`Error parsing leave type: ${err.message}`);
    }
  },
};

export type LeaveTypes = z.infer<typeof leaveTypesSchema>;

export type LeaveType = LeaveTypes[number];
