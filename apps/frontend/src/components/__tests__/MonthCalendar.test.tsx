import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MonthDailyCalendar } from "../particles/MonthDailyCalendar";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

describe("MonthCalendar", () => {
  beforeEach(() => {
    // Initialize i18n for each test
    i18n.load({
      en: {
        messages: {
          "M for Monday": { message: "M" },
          "T for Tuesday": { message: "T" },
          "W for Wednesday": { message: "W" },
          "T for Thursday": { message: "T" },
          "F for Friday": { message: "F" },
          "S for Saturday": { message: "S" },
          "S for Sunday": { message: "S" },
          "Previous month": { message: "Previous month" },
          "Next month": { message: "Next month" },
          Today: { message: "Today" },
        },
      },
    });
    i18n.activate("en");
  });

  const defaultProps = {
    year: 2024,
    month: 2, // March (0-based)
    renderDay: (day: { date: string }) => (
      <div data-testid={`day-${day.date}`}>
        <span>{day.date.split("-")[2]}</span>
      </div>
    ),
  };

  const renderWithI18n = (ui: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <I18nProvider i18n={i18n}>{ui}</I18nProvider>
      </BrowserRouter>
    );
  };

  it("renders weekday headers", () => {
    renderWithI18n(<MonthDailyCalendar {...defaultProps} />);
    const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
    weekdays.forEach((day) => {
      const elements = screen.getAllByText(day);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("calls onDayFocus when a day cell receives focus", () => {
    const onDayFocus = vi.fn();
    renderWithI18n(
      <MonthDailyCalendar {...defaultProps} onDayFocus={onDayFocus} />
    );

    // Find first day cell by its content (01)
    const firstDayCell = screen.getByText("01").closest("div[tabindex]");
    if (firstDayCell) {
      fireEvent.focus(firstDayCell);
      expect(onDayFocus).toHaveBeenCalledWith(
        expect.stringMatching(/2024-03-01/)
      );
    }
  });

  it("applies correct styling for current month and other month days", async () => {
    renderWithI18n(<MonthDailyCalendar {...defaultProps} />);

    // Current month day (March 15)
    const currentMonthDay = screen
      .getByTestId("day-2024-03-15")
      .closest("div[tabindex]");
    await expect(currentMonthDay).toHaveClass("bg-white");

    // Previous month day (if visible)
    const prevMonthDay = screen
      .getByTestId("day-2024-02-29")
      .closest("div[tabindex]");
    await expect(prevMonthDay).toHaveClass("bg-gray-50");
  });

  it("renders custom day content", () => {
    const customRenderDay = (day: { date: string }) => (
      <div data-testid={`custom-${day.date}`}>Custom content</div>
    );

    renderWithI18n(
      <MonthDailyCalendar {...defaultProps} renderDay={customRenderDay} />
    );

    // Look for a specific day's custom content
    const customContent = screen.getByTestId("custom-2024-03-01");
    expect(customContent).toBeInTheDocument();
    expect(customContent).toHaveTextContent("Custom content");
  });
});
