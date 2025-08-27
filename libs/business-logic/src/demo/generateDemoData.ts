import Fakerator from "fakerator";

const fakerator = Fakerator();

export interface DemoDataOptions {
  industry: string;
  unitType: string;
  teamSize: number;
  companyName?: string;
  unitName?: string;
  teamName?: string;
}

export interface GeneratedDemoData {
  companyName: string;
  unitName: string;
  teamName: string;
  users: Array<{
    name: string;
    email: string;
    role: string;
    qualifications: string[];
  }>;
}

export const generateCompanyName = (
  industry: string,
  suggestions: string[]
): string => {
  if (suggestions.length > 0) {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Fallback to fakerator if no suggestions
  switch (industry.toLowerCase()) {
    case "healthcare":
      return `${fakerator.address.city()} ${fakerator.random.arrayElement([
        "Hospital",
        "Medical Center",
        "Clinic",
      ])}`;
    case "retail":
      return `${fakerator.address.city()} ${fakerator.random.arrayElement([
        "Store",
        "Market",
        "Shop",
      ])}`;
    case "manufacturing":
      return `${fakerator.company.name()} ${fakerator.random.arrayElement([
        "Manufacturing",
        "Industries",
        "Solutions",
      ])}`;
    case "hospitality":
      return `${fakerator.random.arrayElement([
        "Grand",
        "Metropolitan",
        "Luxury",
      ])} ${fakerator.address.city()} ${fakerator.random.arrayElement([
        "Hotel",
        "Suites",
        "Resort",
      ])}`;
    case "restaurant":
      return `${fakerator.random.arrayElement([
        "Bella",
        "Urban",
        "Taste of",
      ])} ${fakerator.address.city()} ${fakerator.random.arrayElement([
        "Restaurant",
        "Kitchen",
        "Bistro",
      ])}`;
    default:
      return fakerator.company.name();
  }
};

export const generateUnitName = (
  industry: string,
  unitType: string,
  suggestions: string[]
): string => {
  if (suggestions.length > 0) {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Fallback to fakerator if no suggestions
  switch (industry.toLowerCase()) {
    case "healthcare":
      return `${fakerator.random.arrayElement([
        "Emergency",
        "Cardiology",
        "Pediatrics",
        "Surgery",
      ])} ${unitType}`;
    case "retail":
      return `${fakerator.address.city()} ${unitType}`;
    case "manufacturing":
      return `${fakerator.random.arrayElement([
        "Production",
        "Quality",
        "Maintenance",
      ])} ${unitType}`;
    case "hospitality":
      return `${fakerator.random.arrayElement([
        "Front Desk",
        "Housekeeping",
        "Food & Beverage",
      ])} ${unitType}`;
    case "restaurant":
      return `${fakerator.random.arrayElement([
        "Kitchen",
        "Service",
        "Bar",
      ])} ${unitType}`;
    default:
      return `${fakerator.random.word()} ${unitType}`;
  }
};

export const generateTeamName = (
  industry: string,
  suggestions: string[]
): string => {
  if (suggestions.length > 0) {
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Fallback to fakerator if no suggestions
  switch (industry.toLowerCase()) {
    case "healthcare":
      return `${fakerator.random.arrayElement([
        "Medical",
        "Nursing",
        "Support",
      ])} Team`;
    case "retail":
      return `${fakerator.random.arrayElement([
        "Sales",
        "Customer Service",
        "Operations",
      ])} Team`;
    case "manufacturing":
      return `${fakerator.random.arrayElement([
        "Production",
        "Quality",
        "Maintenance",
      ])} Team`;
    case "hospitality":
      return `${fakerator.random.arrayElement([
        "Guest Services",
        "Operations",
        "Support",
      ])} Team`;
    case "restaurant":
      return `${fakerator.random.arrayElement([
        "Kitchen",
        "Service",
        "Management",
      ])} Team`;
    default:
      return `${fakerator.random.word()} Team`;
  }
};

export const generateUserData = (
  industry: string,
  teamSize: number,
  roleSuggestions: string[],
  qualificationSuggestions: string[]
): Array<{
  name: string;
  email: string;
  role: string;
  qualifications: string[];
}> => {
  const users = [];

  for (let i = 0; i < teamSize; i++) {
    const firstName = fakerator.names.firstName();
    const lastName = fakerator.names.lastName();
    const name = `${firstName} ${lastName}`;

    // Generate realistic email
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${fakerator.internet.domainName()}`;

    // Select role from suggestions or generate one
    const role =
      roleSuggestions.length > 0
        ? roleSuggestions[Math.floor(Math.random() * roleSuggestions.length)]
        : fakerator.random.arrayElement([
            "Team Member",
            "Specialist",
            "Coordinator",
          ]);

    // Assign 1-3 random qualifications
    const numQualifications = Math.min(
      Math.floor(Math.random() * 3) + 1,
      qualificationSuggestions.length
    );
    const qualifications = fakerator.random.arrayElements(
      qualificationSuggestions,
      numQualifications
    );

    users.push({
      name,
      email,
      role,
      qualifications,
    });
  }

  return users;
};

export const generateDemoData = (
  options: DemoDataOptions
): GeneratedDemoData => {
  const { industry, unitType, teamSize, companyName, unitName, teamName } =
    options;

  // Generate names if not provided
  const finalCompanyName = companyName || generateCompanyName(industry, []);
  const finalUnitName = unitName || generateUnitName(industry, unitType, []);
  const finalTeamName = teamName || generateTeamName(industry, []);

  // Generate user data
  const users = generateUserData(industry, teamSize, [], []);

  return {
    companyName: finalCompanyName,
    unitName: finalUnitName,
    teamName: finalTeamName,
    users,
  };
};
