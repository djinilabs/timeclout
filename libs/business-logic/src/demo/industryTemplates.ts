export interface IndustryTemplate {
  name: string;
  companyNameSuggestions: string[];
  unitTypeSuggestions: string[];
  teamNameSuggestions: string[];
  userRoleSuggestions: string[];
  qualificationSuggestions: string[];
  workSchedule: {
    monday: { isWorkDay: boolean; start: string; end: string };
    tuesday: { isWorkDay: boolean; start: string; end: string };
    wednesday: { isWorkDay: boolean; start: string; end: string };
    thursday: { isWorkDay: boolean; start: string; end: string };
    friday: { isWorkDay: boolean; start: string; end: string };
    saturday: { isWorkDay: boolean; start?: string; end?: string };
    sunday: { isWorkDay: boolean; start?: string; end?: string };
  };
  shiftPatterns: Array<{
    name: string;
    startHour: number;
    endHour: number;
    color: string;
    requiredSkills: string[];
  }>;
}

export const industryTemplates: Record<string, IndustryTemplate> = {
  healthcare: {
    name: "Healthcare",
    companyNameSuggestions: [
      "City General Hospital",
      "Metropolitan Medical Center",
      "Regional Health System",
      "Community Care Hospital",
      "University Medical Center",
    ],
    unitTypeSuggestions: ["Department", "Ward", "Unit", "Clinic", "Service"],
    teamNameSuggestions: [
      "Emergency Department",
      "Intensive Care Unit",
      "Surgery Team",
      "Pediatric Ward",
      "Cardiology Unit",
    ],
    userRoleSuggestions: [
      "Registered Nurse",
      "Physician",
      "Nurse Practitioner",
      "Medical Assistant",
      "Respiratory Therapist",
      "Pharmacist",
      "Lab Technician",
    ],
    qualificationSuggestions: [
      "RN License",
      "BLS Certification",
      "ACLS Certification",
      "PALS Certification",
      "Critical Care",
      "Emergency Medicine",
      "Pediatrics",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "06:00", end: "18:00" },
      tuesday: { isWorkDay: true, start: "06:00", end: "18:00" },
      wednesday: { isWorkDay: true, start: "06:00", end: "18:00" },
      thursday: { isWorkDay: true, start: "06:00", end: "18:00" },
      friday: { isWorkDay: true, start: "06:00", end: "18:00" },
      saturday: { isWorkDay: true, start: "06:00", end: "18:00" },
      sunday: { isWorkDay: true, start: "06:00", end: "18:00" },
    },
    shiftPatterns: [
      {
        name: "Day Shift",
        startHour: 6,
        endHour: 18,
        color: "blue",
        requiredSkills: ["RN License", "BLS Certification"],
      },
      {
        name: "Night Shift",
        startHour: 18,
        endHour: 6,
        color: "navy",
        requiredSkills: ["RN License", "BLS Certification"],
      },
      {
        name: "Evening Shift",
        startHour: 14,
        endHour: 2,
        color: "purple",
        requiredSkills: ["RN License", "BLS Certification"],
      },
    ],
  },
  retail: {
    name: "Retail",
    companyNameSuggestions: [
      "Metro Mart",
      "City Center Stores",
      "Community Retail",
      "Urban Shopping",
      "Neighborhood Markets",
    ],
    unitTypeSuggestions: ["Store", "Location", "Branch", "Outlet", "Shop"],
    teamNameSuggestions: [
      "Customer Service",
      "Sales Floor",
      "Stock Room",
      "Cashiers",
      "Management",
    ],
    userRoleSuggestions: [
      "Sales Associate",
      "Cashier",
      "Stock Clerk",
      "Department Manager",
      "Store Manager",
      "Customer Service Rep",
      "Loss Prevention",
    ],
    qualificationSuggestions: [
      "Customer Service",
      "Sales Training",
      "Inventory Management",
      "Cash Handling",
      "Product Knowledge",
      "Safety Training",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "08:00", end: "22:00" },
      tuesday: { isWorkDay: true, start: "08:00", end: "22:00" },
      wednesday: { isWorkDay: true, start: "08:00", end: "22:00" },
      thursday: { isWorkDay: true, start: "08:00", end: "22:00" },
      friday: { isWorkDay: true, start: "08:00", end: "22:00" },
      saturday: { isWorkDay: true, start: "08:00", end: "22:00" },
      sunday: { isWorkDay: true, start: "10:00", end: "20:00" },
    },
    shiftPatterns: [
      {
        name: "Morning Shift",
        startHour: 8,
        endHour: 16,
        color: "green",
        requiredSkills: ["Customer Service"],
      },
      {
        name: "Afternoon Shift",
        startHour: 14,
        endHour: 22,
        color: "orange",
        requiredSkills: ["Customer Service"],
      },
      {
        name: "Weekend Shift",
        startHour: 10,
        endHour: 20,
        color: "red",
        requiredSkills: ["Customer Service"],
      },
    ],
  },
  manufacturing: {
    name: "Manufacturing",
    companyNameSuggestions: [
      "Industrial Solutions Inc",
      "Precision Manufacturing",
      "Global Production Co",
      "Advanced Industries",
      "Quality Manufacturing",
    ],
    unitTypeSuggestions: [
      "Production Line",
      "Department",
      "Plant",
      "Facility",
      "Division",
    ],
    teamNameSuggestions: [
      "Production Team A",
      "Quality Control",
      "Maintenance Crew",
      "Assembly Line 1",
      "Packaging Team",
    ],
    userRoleSuggestions: [
      "Production Worker",
      "Machine Operator",
      "Quality Inspector",
      "Maintenance Technician",
      "Team Leader",
      "Safety Officer",
      "Production Supervisor",
    ],
    qualificationSuggestions: [
      "Machine Operation",
      "Quality Control",
      "Safety Training",
      "Forklift License",
      "Technical Skills",
      "Team Leadership",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "06:00", end: "18:00" },
      tuesday: { isWorkDay: true, start: "06:00", end: "18:00" },
      wednesday: { isWorkDay: true, start: "06:00", end: "18:00" },
      thursday: { isWorkDay: true, start: "06:00", end: "18:00" },
      friday: { isWorkDay: true, start: "06:00", end: "18:00" },
      saturday: { isWorkDay: false },
      sunday: { isWorkDay: false },
    },
    shiftPatterns: [
      {
        name: "First Shift",
        startHour: 6,
        endHour: 14,
        color: "blue",
        requiredSkills: ["Machine Operation"],
      },
      {
        name: "Second Shift",
        startHour: 14,
        endHour: 22,
        color: "green",
        requiredSkills: ["Machine Operation"],
      },
      {
        name: "Third Shift",
        startHour: 22,
        endHour: 6,
        color: "navy",
        requiredSkills: ["Machine Operation"],
      },
    ],
  },
  hospitality: {
    name: "Hospitality",
    companyNameSuggestions: [
      "Grand Plaza Hotel",
      "Metropolitan Suites",
      "Luxury Hospitality Group",
      "City Center Hotels",
      "Premier Accommodations",
    ],
    unitTypeSuggestions: [
      "Department",
      "Service",
      "Division",
      "Section",
      "Area",
    ],
    teamNameSuggestions: [
      "Front Desk",
      "Housekeeping",
      "Food & Beverage",
      "Concierge",
      "Maintenance",
    ],
    userRoleSuggestions: [
      "Front Desk Agent",
      "Concierge",
      "Housekeeper",
      "Bellhop",
      "Food Server",
      "Bartender",
      "Maintenance Staff",
    ],
    qualificationSuggestions: [
      "Customer Service",
      "Hospitality Training",
      "Food Safety",
      "First Aid",
      "Language Skills",
      "Safety Training",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "06:00", end: "23:00" },
      tuesday: { isWorkDay: true, start: "06:00", end: "23:00" },
      wednesday: { isWorkDay: true, start: "06:00", end: "23:00" },
      thursday: { isWorkDay: true, start: "06:00", end: "23:00" },
      friday: { isWorkDay: true, start: "06:00", end: "23:00" },
      saturday: { isWorkDay: true, start: "06:00", end: "23:00" },
      sunday: { isWorkDay: true, start: "06:00", end: "23:00" },
    },
    shiftPatterns: [
      {
        name: "Morning Shift",
        startHour: 6,
        endHour: 14,
        color: "blue",
        requiredSkills: ["Customer Service"],
      },
      {
        name: "Afternoon Shift",
        startHour: 14,
        endHour: 22,
        color: "green",
        requiredSkills: ["Customer Service"],
      },
      {
        name: "Night Shift",
        startHour: 22,
        endHour: 6,
        color: "navy",
        requiredSkills: ["Customer Service"],
      },
    ],
  },
  restaurant: {
    name: "Restaurant",
    companyNameSuggestions: [
      "Bella Vista Restaurant",
      "Urban Kitchen",
      "Taste of the City",
      "Gourmet Delights",
      "Fine Dining Co",
    ],
    unitTypeSuggestions: ["Kitchen", "Service", "Section", "Station", "Area"],
    teamNameSuggestions: [
      "Kitchen Staff",
      "Service Team",
      "Bar Staff",
      "Host Team",
      "Management",
    ],
    userRoleSuggestions: [
      "Chef",
      "Line Cook",
      "Server",
      "Bartender",
      "Host",
      "Kitchen Porter",
      "Manager",
    ],
    qualificationSuggestions: [
      "Food Safety",
      "Culinary Skills",
      "Customer Service",
      "Wine Knowledge",
      "Kitchen Safety",
      "Service Training",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "10:00", end: "23:00" },
      tuesday: { isWorkDay: true, start: "10:00", end: "23:00" },
      wednesday: { isWorkDay: true, start: "10:00", end: "23:00" },
      thursday: { isWorkDay: true, start: "10:00", end: "23:00" },
      friday: { isWorkDay: true, start: "10:00", end: "00:00" },
      saturday: { isWorkDay: true, start: "10:00", end: "00:00" },
      sunday: { isWorkDay: true, start: "10:00", end: "22:00" },
    },
    shiftPatterns: [
      {
        name: "Prep Shift",
        startHour: 10,
        endHour: 16,
        color: "green",
        requiredSkills: ["Food Safety"],
      },
      {
        name: "Service Shift",
        startHour: 16,
        endHour: 23,
        color: "orange",
        requiredSkills: ["Customer Service"],
      },
      {
        name: "Weekend Service",
        startHour: 16,
        endHour: 0,
        color: "red",
        requiredSkills: ["Customer Service"],
      },
    ],
  },
  education: {
    name: "Education",
    companyNameSuggestions: [
      "Metropolitan School District",
      "City Academy",
      "Community Learning Center",
      "Regional Education Board",
      "University Preparatory School",
    ],
    unitTypeSuggestions: [
      "School",
      "Campus",
      "Department",
      "Division",
      "Program",
    ],
    teamNameSuggestions: [
      "Elementary Teachers",
      "High School Faculty",
      "Administrative Staff",
      "Support Services",
      "Special Education",
    ],
    userRoleSuggestions: [
      "Teacher",
      "Principal",
      "Vice Principal",
      "Counselor",
      "Librarian",
      "Administrative Assistant",
      "Custodian",
    ],
    qualificationSuggestions: [
      "Teaching License",
      "Master's Degree",
      "Special Education Certification",
      "Administrative Training",
      "Child Development",
      "Curriculum Design",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "07:30", end: "15:30" },
      tuesday: { isWorkDay: true, start: "07:30", end: "15:30" },
      wednesday: { isWorkDay: true, start: "07:30", end: "15:30" },
      thursday: { isWorkDay: true, start: "07:30", end: "15:30" },
      friday: { isWorkDay: true, start: "07:30", end: "15:30" },
      saturday: { isWorkDay: false },
      sunday: { isWorkDay: false },
    },
    shiftPatterns: [
      {
        name: "Regular School Day",
        startHour: 7,
        endHour: 15,
        color: "blue",
        requiredSkills: ["Teaching License"],
      },
      {
        name: "Extended Day",
        startHour: 15,
        endHour: 18,
        color: "green",
        requiredSkills: ["Teaching License", "Child Development"],
      },
      {
        name: "Administrative Hours",
        startHour: 8,
        endHour: 16,
        color: "purple",
        requiredSkills: ["Administrative Training"],
      },
    ],
  },
  technology: {
    name: "Technology",
    companyNameSuggestions: [
      "Tech Solutions Inc",
      "Digital Innovation Labs",
      "Cloud Computing Corp",
      "Software Development Co",
      "Data Systems Group",
    ],
    unitTypeSuggestions: ["Department", "Team", "Division", "Lab", "Studio"],
    teamNameSuggestions: [
      "Development Team",
      "DevOps Team",
      "QA Team",
      "Product Team",
      "Support Team",
    ],
    userRoleSuggestions: [
      "Software Engineer",
      "DevOps Engineer",
      "QA Engineer",
      "Product Manager",
      "Technical Lead",
      "Support Engineer",
      "Data Scientist",
    ],
    qualificationSuggestions: [
      "Programming Languages",
      "Cloud Computing",
      "Database Management",
      "Agile Methodology",
      "System Architecture",
      "Security Certification",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "09:00", end: "17:00" },
      tuesday: { isWorkDay: true, start: "09:00", end: "17:00" },
      wednesday: { isWorkDay: true, start: "09:00", end: "17:00" },
      thursday: { isWorkDay: true, start: "09:00", end: "17:00" },
      friday: { isWorkDay: true, start: "09:00", end: "17:00" },
      saturday: { isWorkDay: false },
      sunday: { isWorkDay: false },
    },
    shiftPatterns: [
      {
        name: "Core Hours",
        startHour: 9,
        endHour: 17,
        color: "blue",
        requiredSkills: ["Programming Languages"],
      },
      {
        name: "Flexible Hours",
        startHour: 10,
        endHour: 18,
        color: "green",
        requiredSkills: ["Programming Languages"],
      },
      {
        name: "On-Call Support",
        startHour: 17,
        endHour: 9,
        color: "red",
        requiredSkills: ["System Architecture", "Security Certification"],
      },
    ],
  },
  logistics: {
    name: "Logistics",
    companyNameSuggestions: [
      "Global Logistics Solutions",
      "Metro Shipping Co",
      "Regional Distribution",
      "Express Delivery Services",
      "Supply Chain Management",
    ],
    unitTypeSuggestions: [
      "Warehouse",
      "Distribution Center",
      "Hub",
      "Facility",
      "Terminal",
    ],
    teamNameSuggestions: [
      "Warehouse Operations",
      "Delivery Team",
      "Inventory Management",
      "Quality Control",
      "Fleet Management",
    ],
    userRoleSuggestions: [
      "Warehouse Worker",
      "Delivery Driver",
      "Forklift Operator",
      "Inventory Specialist",
      "Quality Inspector",
      "Fleet Coordinator",
      "Logistics Manager",
    ],
    qualificationSuggestions: [
      "Forklift License",
      "Commercial Driver's License",
      "Inventory Management",
      "Safety Training",
      "Quality Control",
      "Fleet Management",
    ],
    workSchedule: {
      monday: { isWorkDay: true, start: "06:00", end: "18:00" },
      tuesday: { isWorkDay: true, start: "06:00", end: "18:00" },
      wednesday: { isWorkDay: true, start: "06:00", end: "18:00" },
      thursday: { isWorkDay: true, start: "06:00", end: "18:00" },
      friday: { isWorkDay: true, start: "06:00", end: "18:00" },
      saturday: { isWorkDay: true, start: "08:00", end: "16:00" },
      sunday: { isWorkDay: false },
    },
    shiftPatterns: [
      {
        name: "Day Shift",
        startHour: 6,
        endHour: 14,
        color: "blue",
        requiredSkills: ["Forklift License"],
      },
      {
        name: "Afternoon Shift",
        startHour: 14,
        endHour: 22,
        color: "green",
        requiredSkills: ["Forklift License"],
      },
      {
        name: "Delivery Shift",
        startHour: 8,
        endHour: 16,
        color: "orange",
        requiredSkills: ["Commercial Driver's License"],
      },
    ],
  },
};

export const getIndustryTemplate = (industry: string): IndustryTemplate => {
  const template = industryTemplates[industry.toLowerCase()];
  if (!template) {
    throw new Error(`Industry template not found for: ${industry}`);
  }
  return template;
};
