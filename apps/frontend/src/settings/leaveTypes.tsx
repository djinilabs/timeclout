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

export const leaveTypeColors: Record<LeaveTypes[number]["color"], string> = {
  blue: "#60a5fa", // A pleasant sky blue
  green: "#4ade80", // A fresh mint green
  red: "#f87171", // A soft coral red
  yellow: "#fbbf24", // A warm yellow
  purple: "#a78bfa", // A soft purple
};
