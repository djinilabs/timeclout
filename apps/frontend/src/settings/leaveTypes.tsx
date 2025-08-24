import { type ReactNode } from "react";
import {
  FaUmbrellaBeach,
  FaSpa,
  FaHospital,
  FaBabyCarriage,
  FaUsers,
  FaHeart,
  FaBook,
  FaPlane,
  FaCoffee,
  FaHandshake,
  FaBaby,
  FaMedkit,
  FaGraduationCap,
  FaBriefcase,
  FaHome,
} from "react-icons/fa";
import { MdSelfImprovement } from "react-icons/md";

import { type LeaveTypes,  } from "@/settings";

export const leaveTypeIcons: Record<LeaveTypes[number]["icon"], ReactNode> = {
  umbrella: <FaUmbrellaBeach className="w-5 h-5" />,
  spa: <FaSpa className="w-5 h-5" />,
  hospital: <FaHospital className="w-5 h-5" />,
  stroller: <FaBabyCarriage className="w-5 h-5" />,
  meeting: <FaUsers className="w-5 h-5" />,
  compassionate: <FaHeart className="w-5 h-5" />,
  wellbeing: <MdSelfImprovement className="w-5 h-5" />,
  book: <FaBook className="w-5 h-5" />,
  plane: <FaPlane className="w-5 h-5" />,
  home: <FaHome className="w-5 h-5" />,
  briefcase: <FaBriefcase className="w-5 h-5" />,
  graduation: <FaGraduationCap className="w-5 h-5" />,
  medkit: <FaMedkit className="w-5 h-5" />,
  baby: <FaBaby className="w-5 h-5" />,
  handshake: <FaHandshake className="w-5 h-5" />,
  coffee: <FaCoffee className="w-5 h-5" />,
};



export {colors as leaveTypeColors} from "@/settings";