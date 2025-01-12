import { z } from "zod";

export const leaveTypesSchema = z.array(
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

export type LeaveTypes = z.infer<typeof leaveTypesSchema>;
