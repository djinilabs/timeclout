import { z } from "zod";

const leaveTypesSchema = z.array(
  z.object({
    name: z.string(),
    showInCalendarAs: z.enum(["busy", "available", "ooo"]),
    visibleTo: z.enum(["managers", "employees"]),
    deductsFromAnnualAllowance: z.boolean(),
    needsManagerApproval: z.boolean(),
    icon: z.enum([
      "umbrella",
      "spa",
      "hospital",
      "stroller",
      "meeting",
      "compassionate",
      "wellbeing",
      "book",
    ]),
    color: z.enum(["green", "red", "blue", "yellow", "purple"]),
  })
);

export const leaveTypeParser = {
  parse: (item: unknown) => {
    try {
      return leaveTypesSchema.parse(item);
    } catch (err) {
      throw new Error(`Error parsing leave type: ${err.message}`);
    }
  },
};

export type LeaveTypes = z.infer<typeof leaveTypesSchema>;
