export const permissionTypeToString = (permissionType: number) => {
  switch (permissionType) {
    case 1:
      return "Member";
    case 2:
      return "Admin";
    case 3:
      return "Owner";
  }
};
