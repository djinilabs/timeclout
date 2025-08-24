import { i18n } from "@lingui/core";

export const permissionTypeToString = (permissionType?: number | null) => {
  if (!permissionType) {
    return i18n.t("Unknown");
  }

  switch (permissionType) {
    case 1: {
      return i18n.t("Member");
    }
    case 2: {
      return i18n.t("Admin");
    }
    case 3: {
      return i18n.t("Owner");
    }
  }
};
