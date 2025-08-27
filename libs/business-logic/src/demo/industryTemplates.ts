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
};

export const getIndustryTemplate = (industry: string): IndustryTemplate => {
  const template = industryTemplates[industry.toLowerCase()];
  if (!template) {
    throw new Error(`Industry template not found for: ${industry}`);
  }
  return template;
};
