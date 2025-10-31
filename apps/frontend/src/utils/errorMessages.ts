import { i18n } from "@lingui/core";

interface UserFriendlyError {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

/**
 * Converts technical GraphQL/network errors into user-friendly error messages
 */
export function formatUserFriendlyError(
  error: Error | { message: string; graphQLErrors?: Array<{ message: string }> }
): UserFriendlyError {
  const errorMessage = error.message || "An unknown error occurred";
  const graphQLErrors =
    "graphQLErrors" in error ? error.graphQLErrors : undefined;

  // Handle GraphQL errors
  if (graphQLErrors && graphQLErrors.length > 0) {
    const gqlError = graphQLErrors[0].message.toLowerCase();

    // Permission errors
    if (
      gqlError.includes("permission") ||
      gqlError.includes("unauthorized") ||
      gqlError.includes("forbidden")
    ) {
      return {
        title: i18n.t("Access denied"),
        message: i18n.t(
          "You don't have permission to perform this action. Please contact your administrator."
        ),
      };
    }

    // Not found errors
    if (
      gqlError.includes("not found") ||
      gqlError.includes("does not exist")
    ) {
      return {
        title: i18n.t("Not found"),
        message: i18n.t(
          "The requested resource could not be found. It may have been deleted or you may not have access to it."
        ),
      };
    }

    // Validation errors
    if (
      gqlError.includes("validation") ||
      gqlError.includes("invalid") ||
      gqlError.includes("required")
    ) {
      return {
        title: i18n.t("Invalid input"),
        message: i18n.t(
          "Please check your input and try again. {details}",
          { details: graphQLErrors[0].message }
        ),
      };
    }

    // Duplicate/conflict errors
    if (
      gqlError.includes("duplicate") ||
      gqlError.includes("already exists") ||
      gqlError.includes("conflict")
    ) {
      return {
        title: i18n.t("Already exists"),
        message: i18n.t(
          "This item already exists. Please use a different value."
        ),
      };
    }

    // Use the GraphQL error message
    return {
      title: i18n.t("Error"),
      message: graphQLErrors[0].message,
    };
  }

  // Network errors
  if (
    errorMessage.includes("Network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("Failed to fetch")
  ) {
    return {
      title: i18n.t("Connection error"),
      message: i18n.t(
        "Unable to connect to the server. Please check your internet connection and try again."
      ),
      action: {
        label: i18n.t("Retry"),
      },
    };
  }

  // Timeout errors
  if (errorMessage.includes("timeout")) {
    return {
      title: i18n.t("Request timeout"),
      message: i18n.t(
        "The request took too long to complete. Please try again."
      ),
      action: {
        label: i18n.t("Retry"),
      },
    };
  }

  // Generic error - try to make it more user-friendly
  // Remove technical prefixes if present
  let cleanedMessage = errorMessage;
  if (cleanedMessage.startsWith("Error: ")) {
    cleanedMessage = cleanedMessage.substring(7);
  }
  if (cleanedMessage.startsWith("GraphQL error: ")) {
    cleanedMessage = cleanedMessage.substring(15);
  }

  return {
    title: i18n.t("Something went wrong"),
    message: cleanedMessage,
  };
}

/**
 * Formats an error for toast notification
 */
export function formatErrorForToast(
  error: Error | { message: string; graphQLErrors?: Array<{ message: string }> }
): string {
  const friendly = formatUserFriendlyError(error);
  return `${friendly.title}: ${friendly.message}`;
}

