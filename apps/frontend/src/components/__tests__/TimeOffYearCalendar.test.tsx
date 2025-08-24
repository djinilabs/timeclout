import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { TimeOffYearCalendar } from "../company/TimeOffYearCalendar";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverMock;

describe("TimeOffYearCalendar", () => {
  const defaultProps = {
    year: 2024,
    goToYear: vi.fn(),
    bookTimeOff: vi.fn(),
    calendarDateMap: {
      "2024-03-15": {
        type: "vacation",
        color: "#4CAF50",
      },
    },
    holidays: {
      "2024-01-01": "New Year's Day",
      "2024-12-25": "Christmas Day",
    },
  };

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <I18nProvider i18n={i18n}>{ui}</I18nProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Initialize i18n with all required translations
    i18n.load({
      en: {
        messages: {
          "Previous year": { message: "Previous year" },
          "Next year": { message: "Next year" },
          Today: { message: "Today" },
          "Request Time Off": { message: "Request Time Off" },
          "Request time off": { message: "Request time off" },
          "Go to today": { message: "Go to today" },
          "Open menu": { message: "Open menu" },
          M: { message: "M" },
          T: { message: "T" },
          W: { message: "W" },
          F: { message: "F" },
          S: { message: "S" },
        },
      },
    });
    i18n.activate("en");
  });

  it("renders year in header", () => {
    renderWithProviders(<TimeOffYearCalendar {...defaultProps} />);
    const yearElement = screen.getByText("2024");
    expect(yearElement).toBeInTheDocument();
  });

  it("renders all months", () => {
    renderWithProviders(<TimeOffYearCalendar {...defaultProps} />);
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (const month of months) {
      expect(screen.getByRole("heading", { name: month })).toBeInTheDocument();
    }
  });

  it("renders weekday headers for each month", () => {
    renderWithProviders(<TimeOffYearCalendar {...defaultProps} />);

    const months = screen.getAllByRole("heading", { level: 2 });

    for (const monthHeading of months) {
      const monthSection = monthHeading.parentElement;
      if (!monthSection) continue;

      // Find the weekday container div
      const weekdayContainer = monthSection.querySelector(".grid-cols-7");
      expect(weekdayContainer).toBeInTheDocument();

      // Check for weekday letters
      for (const day of ["M", "T", "W", "T", "F", "S", "S"]) {
        const dayElements = monthSection.querySelectorAll("div");
        const hasDay = [...dayElements].some(
          (element) => element.textContent === day
        );
        expect(hasDay).toBe(true);
      }
    }
  });

  it("renders calendar grid for each month", async () => {
    renderWithProviders(<TimeOffYearCalendar {...defaultProps} />);

    const marchHeading = screen.getByRole("heading", { name: "March" });
    const marchSection = marchHeading.parentElement;
    expect(marchSection).toBeInTheDocument();

    // Check for grid class on the calendar container
    const gridContainer = marchSection?.querySelector(".grid-cols-7");
    await expect(gridContainer).toHaveClass("grid-cols-7");
  });

  it("handles navigation buttons", () => {
    renderWithProviders(<TimeOffYearCalendar {...defaultProps} />);

    // Previous year
    const previousButton = screen.getByRole("button", { name: /previous year/i });
    previousButton.click();
    expect(defaultProps.goToYear).toHaveBeenCalledWith(2023);

    // Next year
    const nextButton = screen.getByRole("button", { name: /next year/i });
    nextButton.click();
    expect(defaultProps.goToYear).toHaveBeenCalledWith(2025);

    // Today
    const todayButton = screen.getByRole("button", { name: /today/i });
    todayButton.click();
    expect(defaultProps.goToYear).toHaveBeenCalledWith(
      new Date().getFullYear()
    );
  });

  it("handles book time off action", () => {
    renderWithProviders(<TimeOffYearCalendar {...defaultProps} />);

    const bookTimeOffButton = screen.getByRole("button", {
      name: /request time off/i,
    });
    bookTimeOffButton.click();
    expect(defaultProps.bookTimeOff).toHaveBeenCalled();
  });
});
