import { z } from "zod";
import {
  FaUmbrellaBeach,
  FaSpa,
  FaHospital,
  FaBabyCarriage,
  FaUsers,
  FaHeart,
} from "react-icons/fa";
import { MdSelfImprovement } from "react-icons/md";
import { type ReactNode } from "react";

export const leaveTypeIcons: Record<LeaveTypes[number]["icon"], ReactNode> = {
  umbrella: <FaUmbrellaBeach />,
  spa: <FaSpa />,
  hospital: <FaHospital />,
  stroller: <FaBabyCarriage />,
  meeting: <FaUsers />,
  compassionate: <FaHeart />,
  wellbeing: <MdSelfImprovement />,
};

export const leaveTypeColors: Record<LeaveTypes[number]["color"], string> = {
  blue: "#60a5fa", // A pleasant sky blue
  green: "#4ade80", // A fresh mint green
  red: "#f87171", // A soft coral red
  yellow: "#fbbf24", // A warm yellow
};

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
    ]),
    color: z.enum(["green", "red", "blue", "yellow"]),
  })
);

export type LeaveTypes = z.infer<typeof leaveTypesSchema>;
