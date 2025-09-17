import { getIndustryTemplate } from "../industryTemplates";
import { type PopulateDemoAccountOptions } from "../populateDemoAccount";

import { ScheduleDayTemplate } from "@/settings";
import { database } from "@/tables";

// Helper function to select qualifications from available ones
const selectQualifications = (
  availableQualifications: string[],
  preferredQualifications: string[],
  count: number = 1
): string[] => {
  // First try to use preferred qualifications that are available
  const availablePreferred = preferredQualifications.filter((qual) =>
    availableQualifications.includes(qual)
  );

  // If we have enough preferred qualifications, use them
  if (availablePreferred.length >= count) {
    return availablePreferred.slice(0, count);
  }

  // Otherwise, use available preferred + random from available
  const result = [...availablePreferred];
  const remaining = availableQualifications.filter(
    (qual) => !availablePreferred.includes(qual)
  );

  while (result.length < count && remaining.length > 0) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    result.push(remaining.splice(randomIndex, 1)[0]);
  }

  return result;
};

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

    // Get the actual team qualifications that were created
    const teamQualificationsSetting = await entity_settings.get(
      teamPk,
      "qualifications"
    );

    if (!teamQualificationsSetting) {
      console.warn(
        "No team qualifications found, using industry template qualifications"
      );
    }

    const availableQualifications =
      teamQualificationsSetting?.settings?.map(
        (q: { name: string }) => q.name
      ) || industryTemplate.qualificationSuggestions;

    console.log(
      `Demo: Using qualifications for templates: ${availableQualifications.join(
        ", "
      )}`
    );

    // Create day templates based on industry patterns
    const dayTemplates = createIndustryDayTemplates(
      industryTemplate,
      availableQualifications
    );

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

function createIndustryDayTemplates(
  industryTemplate: { name: string },
  availableQualifications: string[]
): Record<string, ScheduleDayTemplate> {
  const templates: Record<string, ScheduleDayTemplate> = {};

  switch (industryTemplate.name.toLowerCase()) {
    case "healthcare":
      // Standard weekday template
      templates["Standard Weekday"] = [
        {
          name: "Day Shift",
          color: "blue",
          requiredSkills: selectQualifications(
            availableQualifications,
            ["RN License", "BLS Certification"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["RN License", "BLS Certification", "Critical Care"],
            3
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["RN License", "BLS Certification"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["RN License", "BLS Certification", "Critical Care"],
            3
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["RN License", "BLS Certification", "Emergency Medicine"],
            3
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            [
              "RN License",
              "BLS Certification",
              "Emergency Medicine",
              "Critical Care",
            ],
            4
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Inventory Management"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Cash Handling"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Cash Handling"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Cash Handling"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Machine Operation"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Quality Control"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Machine Operation"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Maintenance", "Technical Skills"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Machine Operation"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Safety Training", "Team Leadership"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Hospitality Training"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Hospitality Training"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Language Skills"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Safety Training"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Culinary Skills", "Food Safety"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Culinary Skills", "Food Safety"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Service Training"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Wine Knowledge"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Service Training"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Customer Service", "Wine Knowledge"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Teaching License"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Administrative Training"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Teaching License", "Child Development"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Child Development"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Programming Languages"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Cloud Computing", "System Architecture"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Programming Languages"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["System Architecture", "Security Certification"],
            2
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Forklift License"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Quality Control"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Forklift License"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Inventory Management"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["Commercial Driver's License"],
            1
          ),
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
          requiredSkills: selectQualifications(
            availableQualifications,
            ["General Skills"],
            1
          ),
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
