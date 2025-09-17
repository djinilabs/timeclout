import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

import { ScheduleDayTemplate } from "@/settings";
import { database } from "@/tables";

export interface CreateDemoTemplatesResult {
  success: boolean;
  dayTemplates?: Record<string, ScheduleDayTemplate>;
  weekTemplates?: Record<string, string[]>;
  message?: string;
}

export const createDemoTemplates = async (
  options: PopulateDemoAccountOptions,
  teamPk: string
): Promise<CreateDemoTemplatesResult> => {
  try {
    const { industry } = options;
    const industryTemplate = getIndustryTemplate(industry);
    const { entity_settings } = await database();

    console.log(
      `Demo: Creating day and week templates for ${industryTemplate.name} industry`
    );

    // Create day templates based on industry patterns
    const dayTemplates = createIndustryDayTemplates(industryTemplate);

    // Create week templates that combine day templates
    const weekTemplates = createIndustryWeekTemplates(industryTemplate);

    // Save day templates to team settings
    await entity_settings.create({
      pk: teamPk,
      sk: "scheduleDayTemplates",
      createdBy: options.actingUserPk,
      settings: dayTemplates,
    });

    // Save week templates to team settings
    await entity_settings.create({
      pk: teamPk,
      sk: "scheduleWeekTemplates",
      createdBy: options.actingUserPk,
      settings: weekTemplates,
    });

    console.log(
      `✅ Created ${Object.keys(dayTemplates).length} day templates and ${
        Object.keys(weekTemplates).length
      } week templates`
    );

    return {
      success: true,
      dayTemplates,
      weekTemplates,
    };
  } catch (error) {
    console.error("Error creating demo templates:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

function createIndustryDayTemplates(industryTemplate: {
  name: string;
}): Record<string, ScheduleDayTemplate> {
  const templates: Record<string, ScheduleDayTemplate> = {};

  switch (industryTemplate.name.toLowerCase()) {
    case "healthcare":
      // Standard weekday template
      templates["Standard Weekday"] = [
        {
          name: "Day Shift",
          color: "blue",
          requiredSkills: ["RN License", "BLS Certification"],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [18, 0], // 6:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Night Shift",
          color: "navy",
          requiredSkills: ["RN License", "BLS Certification", "Critical Care"],
          schedules: [
            {
              startHourMinutes: [18, 0], // 6:00 PM
              endHourMinutes: [6, 0], // 6:00 AM next day
              inconveniencePerHour: 1.5,
            },
          ],
        },
      ];

      // Weekend template
      templates["Weekend Coverage"] = [
        {
          name: "Weekend Day",
          color: "lightblue",
          requiredSkills: ["RN License", "BLS Certification"],
          schedules: [
            {
              startHourMinutes: [8, 0], // 8:00 AM
              endHourMinutes: [20, 0], // 8:00 PM
              inconveniencePerHour: 1.5,
            },
          ],
        },
        {
          name: "Weekend Night",
          color: "darkblue",
          requiredSkills: ["RN License", "BLS Certification", "Critical Care"],
          schedules: [
            {
              startHourMinutes: [20, 0], // 8:00 PM
              endHourMinutes: [8, 0], // 8:00 AM next day
              inconveniencePerHour: 2.0,
            },
          ],
        },
      ];

      // Emergency coverage template
      templates["Emergency Coverage"] = [
        {
          name: "Emergency Day",
          color: "red",
          requiredSkills: [
            "RN License",
            "BLS Certification",
            "Emergency Medicine",
          ],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [18, 0], // 6:00 PM
              inconveniencePerHour: 1.2,
            },
          ],
        },
        {
          name: "Emergency Night",
          color: "darkred",
          requiredSkills: [
            "RN License",
            "BLS Certification",
            "Emergency Medicine",
            "Critical Care",
          ],
          schedules: [
            {
              startHourMinutes: [18, 0], // 6:00 PM
              endHourMinutes: [6, 0], // 6:00 AM next day
              inconveniencePerHour: 1.8,
            },
          ],
        },
      ];
      break;

    case "retail":
      // Standard weekday template
      templates["Standard Weekday"] = [
        {
          name: "Opening Shift",
          color: "green",
          requiredSkills: ["Customer Service", "Inventory Management"],
          schedules: [
            {
              startHourMinutes: [7, 0], // 7:00 AM
              endHourMinutes: [15, 0], // 3:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Mid Shift",
          color: "blue",
          requiredSkills: ["Customer Service"],
          schedules: [
            {
              startHourMinutes: [11, 0], // 11:00 AM
              endHourMinutes: [19, 0], // 7:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Closing Shift",
          color: "purple",
          requiredSkills: ["Customer Service", "Cash Handling"],
          schedules: [
            {
              startHourMinutes: [15, 0], // 3:00 PM
              endHourMinutes: [23, 0], // 11:00 PM
              inconveniencePerHour: 1.2,
            },
          ],
        },
      ];

      // Weekend template
      templates["Weekend Coverage"] = [
        {
          name: "Weekend Shift",
          color: "orange",
          requiredSkills: ["Customer Service"],
          schedules: [
            {
              startHourMinutes: [10, 0], // 10:00 AM
              endHourMinutes: [18, 0], // 6:00 PM
              inconveniencePerHour: 1.3,
            },
          ],
        },
      ];

      // Peak hours template
      templates["Peak Hours"] = [
        {
          name: "Morning Rush",
          color: "yellow",
          requiredSkills: ["Customer Service", "Cash Handling"],
          schedules: [
            {
              startHourMinutes: [8, 0], // 8:00 AM
              endHourMinutes: [12, 0], // 12:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
        {
          name: "Evening Rush",
          color: "red",
          requiredSkills: ["Customer Service", "Cash Handling"],
          schedules: [
            {
              startHourMinutes: [16, 0], // 4:00 PM
              endHourMinutes: [20, 0], // 8:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
      ];
      break;

    case "manufacturing":
      // First shift template
      templates["First Shift"] = [
        {
          name: "Production Worker",
          color: "blue",
          requiredSkills: ["Machine Operation"],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [14, 0], // 2:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Quality Inspector",
          color: "green",
          requiredSkills: ["Quality Control"],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [14, 0], // 2:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Second shift template
      templates["Second Shift"] = [
        {
          name: "Production Worker",
          color: "blue",
          requiredSkills: ["Machine Operation"],
          schedules: [
            {
              startHourMinutes: [14, 0], // 2:00 PM
              endHourMinutes: [22, 0], // 10:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
        {
          name: "Maintenance Technician",
          color: "orange",
          requiredSkills: ["Maintenance", "Technical Skills"],
          schedules: [
            {
              startHourMinutes: [14, 0], // 2:00 PM
              endHourMinutes: [22, 0], // 10:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
      ];

      // Third shift template
      templates["Third Shift"] = [
        {
          name: "Production Worker",
          color: "navy",
          requiredSkills: ["Machine Operation"],
          schedules: [
            {
              startHourMinutes: [22, 0], // 10:00 PM
              endHourMinutes: [6, 0], // 6:00 AM next day
              inconveniencePerHour: 1.5,
            },
          ],
        },
        {
          name: "Safety Officer",
          color: "red",
          requiredSkills: ["Safety Training", "Team Leadership"],
          schedules: [
            {
              startHourMinutes: [22, 0], // 10:00 PM
              endHourMinutes: [6, 0], // 6:00 AM next day
              inconveniencePerHour: 1.5,
            },
          ],
        },
      ];
      break;

    case "hospitality":
      // Morning shift template
      templates["Morning Shift"] = [
        {
          name: "Front Desk",
          color: "blue",
          requiredSkills: ["Customer Service", "Hospitality Training"],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [14, 0], // 2:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Housekeeping",
          color: "green",
          requiredSkills: ["Customer Service"],
          schedules: [
            {
              startHourMinutes: [7, 0], // 7:00 AM
              endHourMinutes: [15, 0], // 3:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Afternoon shift template
      templates["Afternoon Shift"] = [
        {
          name: "Front Desk",
          color: "blue",
          requiredSkills: ["Customer Service", "Hospitality Training"],
          schedules: [
            {
              startHourMinutes: [14, 0], // 2:00 PM
              endHourMinutes: [22, 0], // 10:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Concierge",
          color: "purple",
          requiredSkills: ["Customer Service", "Language Skills"],
          schedules: [
            {
              startHourMinutes: [14, 0], // 2:00 PM
              endHourMinutes: [22, 0], // 10:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Night shift template
      templates["Night Shift"] = [
        {
          name: "Night Auditor",
          color: "navy",
          requiredSkills: ["Customer Service", "Safety Training"],
          schedules: [
            {
              startHourMinutes: [22, 0], // 10:00 PM
              endHourMinutes: [6, 0], // 6:00 AM next day
              inconveniencePerHour: 1.5,
            },
          ],
        },
      ];
      break;

    case "restaurant":
      // Prep shift template
      templates["Prep Shift"] = [
        {
          name: "Chef",
          color: "red",
          requiredSkills: ["Culinary Skills", "Food Safety"],
          schedules: [
            {
              startHourMinutes: [10, 0], // 10:00 AM
              endHourMinutes: [16, 0], // 4:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Line Cook",
          color: "orange",
          requiredSkills: ["Culinary Skills", "Food Safety"],
          schedules: [
            {
              startHourMinutes: [10, 0], // 10:00 AM
              endHourMinutes: [16, 0], // 4:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Service shift template
      templates["Service Shift"] = [
        {
          name: "Server",
          color: "blue",
          requiredSkills: ["Customer Service", "Service Training"],
          schedules: [
            {
              startHourMinutes: [16, 0], // 4:00 PM
              endHourMinutes: [23, 0], // 11:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Bartender",
          color: "purple",
          requiredSkills: ["Customer Service", "Wine Knowledge"],
          schedules: [
            {
              startHourMinutes: [16, 0], // 4:00 PM
              endHourMinutes: [23, 0], // 11:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Weekend service template
      templates["Weekend Service"] = [
        {
          name: "Server",
          color: "blue",
          requiredSkills: ["Customer Service", "Service Training"],
          schedules: [
            {
              startHourMinutes: [16, 0], // 4:00 PM
              endHourMinutes: [0, 0], // 12:00 AM
              inconveniencePerHour: 1.2,
            },
          ],
        },
        {
          name: "Bartender",
          color: "purple",
          requiredSkills: ["Customer Service", "Wine Knowledge"],
          schedules: [
            {
              startHourMinutes: [16, 0], // 4:00 PM
              endHourMinutes: [0, 0], // 12:00 AM
              inconveniencePerHour: 1.2,
            },
          ],
        },
      ];
      break;

    case "education":
      // Regular school day template
      templates["Regular School Day"] = [
        {
          name: "Teacher",
          color: "blue",
          requiredSkills: ["Teaching License"],
          schedules: [
            {
              startHourMinutes: [7, 0], // 7:00 AM
              endHourMinutes: [15, 0], // 3:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Administrative Staff",
          color: "purple",
          requiredSkills: ["Administrative Training"],
          schedules: [
            {
              startHourMinutes: [8, 0], // 8:00 AM
              endHourMinutes: [16, 0], // 4:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Extended day template
      templates["Extended Day"] = [
        {
          name: "Teacher",
          color: "blue",
          requiredSkills: ["Teaching License", "Child Development"],
          schedules: [
            {
              startHourMinutes: [7, 0], // 7:00 AM
              endHourMinutes: [18, 0], // 6:00 PM
              inconveniencePerHour: 1.2,
            },
          ],
        },
        {
          name: "Support Staff",
          color: "green",
          requiredSkills: ["Child Development"],
          schedules: [
            {
              startHourMinutes: [15, 0], // 3:00 PM
              endHourMinutes: [18, 0], // 6:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
      ];
      break;

    case "technology":
      // Core hours template
      templates["Core Hours"] = [
        {
          name: "Software Engineer",
          color: "blue",
          requiredSkills: ["Programming Languages"],
          schedules: [
            {
              startHourMinutes: [9, 0], // 9:00 AM
              endHourMinutes: [17, 0], // 5:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "DevOps Engineer",
          color: "green",
          requiredSkills: ["Cloud Computing", "System Architecture"],
          schedules: [
            {
              startHourMinutes: [9, 0], // 9:00 AM
              endHourMinutes: [17, 0], // 5:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Flexible hours template
      templates["Flexible Hours"] = [
        {
          name: "Software Engineer",
          color: "blue",
          requiredSkills: ["Programming Languages"],
          schedules: [
            {
              startHourMinutes: [10, 0], // 10:00 AM
              endHourMinutes: [18, 0], // 6:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // On-call template
      templates["On-Call Support"] = [
        {
          name: "Support Engineer",
          color: "red",
          requiredSkills: ["System Architecture", "Security Certification"],
          schedules: [
            {
              startHourMinutes: [17, 0], // 5:00 PM
              endHourMinutes: [9, 0], // 9:00 AM next day
              inconveniencePerHour: 1.5,
            },
          ],
        },
      ];
      break;

    case "logistics":
      // Day shift template
      templates["Day Shift"] = [
        {
          name: "Warehouse Worker",
          color: "blue",
          requiredSkills: ["Forklift License"],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [14, 0], // 2:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
        {
          name: "Quality Inspector",
          color: "green",
          requiredSkills: ["Quality Control"],
          schedules: [
            {
              startHourMinutes: [6, 0], // 6:00 AM
              endHourMinutes: [14, 0], // 2:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];

      // Afternoon shift template
      templates["Afternoon Shift"] = [
        {
          name: "Warehouse Worker",
          color: "blue",
          requiredSkills: ["Forklift License"],
          schedules: [
            {
              startHourMinutes: [14, 0], // 2:00 PM
              endHourMinutes: [22, 0], // 10:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
        {
          name: "Inventory Specialist",
          color: "orange",
          requiredSkills: ["Inventory Management"],
          schedules: [
            {
              startHourMinutes: [14, 0], // 2:00 PM
              endHourMinutes: [22, 0], // 10:00 PM
              inconveniencePerHour: 1.1,
            },
          ],
        },
      ];

      // Delivery shift template
      templates["Delivery Shift"] = [
        {
          name: "Delivery Driver",
          color: "purple",
          requiredSkills: ["Commercial Driver's License"],
          schedules: [
            {
              startHourMinutes: [8, 0], // 8:00 AM
              endHourMinutes: [16, 0], // 4:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];
      break;

    default:
      // Generic templates
      templates["Standard Day"] = [
        {
          name: "Team Member",
          color: "blue",
          requiredSkills: ["General Skills"],
          schedules: [
            {
              startHourMinutes: [9, 0], // 9:00 AM
              endHourMinutes: [17, 0], // 5:00 PM
              inconveniencePerHour: 1.0,
            },
          ],
        },
      ];
  }

  return templates;
}

function createIndustryWeekTemplates(industryTemplate: {
  name: string;
}): Record<string, string[]> {
  const templates: Record<string, string[]> = {};

  switch (industryTemplate.name.toLowerCase()) {
    case "healthcare":
      templates["Standard Week"] = [
        "Standard Weekday",
        "Standard Weekday",
        "Standard Weekday",
        "Standard Weekday",
        "Standard Weekday",
        "Weekend Coverage",
        "Weekend Coverage",
      ];
      templates["Emergency Week"] = [
        "Emergency Coverage",
        "Emergency Coverage",
        "Emergency Coverage",
        "Emergency Coverage",
        "Emergency Coverage",
        "Emergency Coverage",
        "Emergency Coverage",
      ];
      break;

    case "retail":
      templates["Standard Week"] = [
        "Standard Weekday",
        "Standard Weekday",
        "Standard Weekday",
        "Standard Weekday",
        "Standard Weekday",
        "Weekend Coverage",
        "Weekend Coverage",
      ];
      templates["Peak Week"] = [
        "Peak Hours",
        "Peak Hours",
        "Peak Hours",
        "Peak Hours",
        "Peak Hours",
        "Weekend Coverage",
        "Weekend Coverage",
      ];
      break;

    case "manufacturing":
      templates["Production Week"] = [
        "First Shift",
        "First Shift",
        "First Shift",
        "First Shift",
        "First Shift",
        "First Shift", // Saturday
        "First Shift", // Sunday
      ];
      templates["Rotating Shifts"] = [
        "First Shift",
        "Second Shift",
        "Third Shift",
        "First Shift",
        "Second Shift",
        "Third Shift",
        "First Shift",
      ];
      break;

    case "hospitality":
      templates["Standard Week"] = [
        "Morning Shift",
        "Morning Shift",
        "Morning Shift",
        "Morning Shift",
        "Morning Shift",
        "Afternoon Shift",
        "Afternoon Shift",
      ];
      templates["24/7 Coverage"] = [
        "Morning Shift",
        "Afternoon Shift",
        "Night Shift",
        "Morning Shift",
        "Afternoon Shift",
        "Night Shift",
        "Morning Shift",
      ];
      break;

    case "restaurant":
      templates["Standard Week"] = [
        "Prep Shift",
        "Prep Shift",
        "Prep Shift",
        "Prep Shift",
        "Prep Shift",
        "Weekend Service",
        "Weekend Service",
      ];
      templates["Service Week"] = [
        "Service Shift",
        "Service Shift",
        "Service Shift",
        "Service Shift",
        "Service Shift",
        "Weekend Service",
        "Weekend Service",
      ];
      break;

    case "education":
      templates["Standard Week"] = [
        "Regular School Day",
        "Regular School Day",
        "Regular School Day",
        "Regular School Day",
        "Regular School Day",
        "Regular School Day", // Saturday
        "Regular School Day", // Sunday
      ];
      templates["Extended Week"] = [
        "Extended Day",
        "Extended Day",
        "Extended Day",
        "Extended Day",
        "Extended Day",
        "Regular School Day",
        "Regular School Day",
      ];
      break;

    case "technology":
      templates["Standard Week"] = [
        "Core Hours",
        "Core Hours",
        "Core Hours",
        "Core Hours",
        "Core Hours",
        "Flexible Hours",
        "Flexible Hours",
      ];
      templates["On-Call Week"] = [
        "Core Hours",
        "On-Call Support",
        "Core Hours",
        "On-Call Support",
        "Core Hours",
        "Flexible Hours",
        "Flexible Hours",
      ];
      break;

    case "logistics":
      templates["Standard Week"] = [
        "Day Shift",
        "Day Shift",
        "Day Shift",
        "Day Shift",
        "Day Shift",
        "Afternoon Shift",
        "Afternoon Shift",
      ];
      templates["Delivery Week"] = [
        "Delivery Shift",
        "Delivery Shift",
        "Delivery Shift",
        "Delivery Shift",
        "Delivery Shift",
        "Delivery Shift",
        "Delivery Shift",
      ];
      break;

    default:
      templates["Standard Week"] = [
        "Standard Day",
        "Standard Day",
        "Standard Day",
        "Standard Day",
        "Standard Day",
        "Standard Day",
        "Standard Day",
      ];
  }

  return templates;
}
