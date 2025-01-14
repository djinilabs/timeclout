export const permissionTypeToString = (permissionType?: number | null) => {
  if (!permissionType) {
    return "Unknown";
  }

  switch (permissionType) {
    case 1:
      return "Member";
    case 2:
      return "Admin";
    case 3:
      return "Owner";
  }
};
