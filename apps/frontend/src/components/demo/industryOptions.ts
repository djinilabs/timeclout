export interface IndustryOption {
  value: string;
  label: string;
  description: string;
  unitTypeSuggestions: string[];
  teamSizeRange: { min: number; max: number; default: number };
}

export const industryOptions: IndustryOption[] = [
  {
    value: "healthcare",
    label: "Healthcare",
    description: "Hospitals, clinics, medical centers with 24/7 operations",
    unitTypeSuggestions: ["Department", "Ward", "Unit", "Clinic", "Service"],
    teamSizeRange: { min: 3, max: 20, default: 8 },
  },
  {
    value: "retail",
    label: "Retail",
    description: "Stores, supermarkets, shopping centers with extended hours",
    unitTypeSuggestions: ["Store", "Location", "Branch", "Outlet", "Shop"],
    teamSizeRange: { min: 2, max: 20, default: 6 },
  },
  {
    value: "manufacturing",
    label: "Manufacturing",
    description: "Production facilities, factories, assembly lines",
    unitTypeSuggestions: [
      "Production Line",
      "Department",
      "Plant",
      "Facility",
      "Division",
    ],
    teamSizeRange: { min: 3, max: 20, default: 10 },
  },
  {
    value: "hospitality",
    label: "Hospitality",
    description: "Hotels, resorts, accommodation services with 24/7 operations",
    unitTypeSuggestions: [
      "Department",
      "Service",
      "Division",
      "Section",
      "Area",
    ],
    teamSizeRange: { min: 4, max: 20, default: 8 },
  },
  {
    value: "restaurant",
    label: "Restaurant",
    description: "Restaurants, cafes, food service with peak hour scheduling",
    unitTypeSuggestions: ["Kitchen", "Service", "Section", "Station", "Area"],
    teamSizeRange: { min: 3, max: 20, default: 7 },
  },
];

export const getIndustryOption = (
  value: string
): IndustryOption | undefined => {
  return industryOptions.find((option) => option.value === value);
};
