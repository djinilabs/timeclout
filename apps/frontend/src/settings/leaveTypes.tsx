import {
  FaUmbrellaBeach,
  FaSpa,
  FaHospital,
  FaBabyCarriage,
  FaUsers,
  FaHeart,
  FaBook,
} from "react-icons/fa";
import { MdSelfImprovement } from "react-icons/md";
import { type ReactNode } from "react";
import { type LeaveTypes } from "@/settings";
import { colors } from "./colors";

export const leaveTypeIcons: Record<LeaveTypes[number]["icon"], ReactNode> = {
  umbrella: <FaUmbrellaBeach />,
  spa: <FaSpa />,
  hospital: <FaHospital />,
  stroller: <FaBabyCarriage />,
  meeting: <FaUsers />,
  compassionate: <FaHeart />,
  wellbeing: <MdSelfImprovement />,
  book: <FaBook />,
};

export const leaveTypeColors: Record<string, string> = colors;
