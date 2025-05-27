import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { type LeaveDay } from "../types";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { TimeOffCalendarDay } from "../company/TimeOffCalendarDay";

describe("TimeOffCalendarDay", () => {
  const mockDay = {
    date: "2024-03-15",
    isCurrentMonth: true,
    isToday: false,
  };

  const mockMonth = {
    name: "March",
    days: Array(35).fill(mockDay), // Simulating a month's worth of days
  };

  const mockUser = {
    email: "test@example.com",
    emailMd5: "abc123",
    name: "Test User",
    pk: "1",
  };

  const defaultLeaveRequest = {
    startDate: "2024-03-15",
    endDate: "2024-03-15",
    type: "vacation",
    approved: true,
    createdAt: "2024-03-15",
    createdBy: mockUser,
    beneficiary: mockUser,
    pk: "1",
    sk: "1",
  };

  const defaultLeaveDay: LeaveDay = {
    type: "none",
    icon: "🌴",
    color: "#ff0000",
    leaveRequest: defaultLeaveRequest,
  };

  const defaultProps = {
    day: mockDay,
    dayIdx: 0,
    month: mockMonth,
    isLeave: defaultLeaveDay,
    isHovering: false,
    setHoveringDay: vi.fn(),
    holiday: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a basic calendar day", () => {
    render(<TimeOffCalendarDay {...defaultProps} />);
    const dayElement = screen.getByText("🌴");
    expect(dayElement).toBeInTheDocument();
  });

  it("applies current month styling", () => {
    render(<TimeOffCalendarDay {...defaultProps} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-white", "text-gray-900");
  });

  it("applies other month styling", () => {
    render(
      <TimeOffCalendarDay
        {...defaultProps}
        day={{ ...mockDay, isCurrentMonth: false }}
      />
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-50", "text-gray-400");
  });

  it("highlights today", () => {
    render(
      <TimeOffCalendarDay
        {...defaultProps}
        day={{ ...mockDay, isToday: true }}
      />
    );
    const timeElement = screen.getByText("🌴");
    expect(timeElement).toHaveClass("bg-teal-600", "text-white");
  });

  it("displays leave icon when provided", () => {
    const leaveProps: LeaveDay = {
      type: "vacation",
      icon: "🌴",
      color: "#ff0000",
      leaveRequest: defaultLeaveRequest,
    };
    render(<TimeOffCalendarDay {...defaultProps} isLeave={leaveProps} />);
    expect(screen.getByText("🌴")).toBeInTheDocument();
  });

  it("shows holiday indicator", () => {
    render(<TimeOffCalendarDay {...defaultProps} holiday="New Year's Day" />);
    const timeElement = screen.getByRole("time");
    expect(timeElement).toHaveClass("bg-red-500", "text-white");
  });

  it("handles mouse enter for leave days", () => {
    const setHoveringDay = vi.fn();
    const leaveProps: LeaveDay = {
      type: "vacation",
      icon: "🌴",
      color: "#ff0000",
      leaveRequest: defaultLeaveRequest,
    };
    render(
      <TimeOffCalendarDay
        {...defaultProps}
        isLeave={leaveProps}
        setHoveringDay={setHoveringDay}
      />
    );

    fireEvent.mouseEnter(screen.getByRole("button"));
    expect(setHoveringDay).toHaveBeenCalledWith(mockDay.date);
  });

  it("handles mouse leave for leave days", () => {
    const setHoveringDay = vi.fn();
    const leaveProps: LeaveDay = {
      type: "vacation",
      icon: "🌴",
      color: "#ff0000",
      leaveRequest: defaultLeaveRequest,
    };
    render(
      <TimeOffCalendarDay
        {...defaultProps}
        isLeave={leaveProps}
        setHoveringDay={setHoveringDay}
      />
    );

    fireEvent.mouseLeave(screen.getByRole("button"));
    expect(setHoveringDay).toHaveBeenCalledWith(null);
  });

  it.skip("shows popover on hover for leave request", () => {
    const leaveProps: LeaveDay = {
      type: "vacation",
      icon: "🌴",
      color: "#ff0000",
      leaveRequest: defaultLeaveRequest,
    };
    const popperContainer = document.createElement("div");
    popperContainer.id = "popper-container";
    document.body.appendChild(popperContainer);
    render(
      <I18nProvider i18n={i18n}>
        <TimeOffCalendarDay
          {...defaultProps}
          isLeave={leaveProps}
          isHovering={true}
        />
      </I18nProvider>
    );

    // Verify popover is rendered
    expect(screen.getByText(defaultLeaveRequest.type)).toBeInTheDocument();
    expect(screen.getByText("Leave Request")).toBeInTheDocument();
  });

  it.skip("shows popover on hover for holiday", () => {
    render(
      <I18nProvider i18n={i18n}>
        <TimeOffCalendarDay
          {...defaultProps}
          holiday="Christmas Day"
          isHovering={true}
        />
      </I18nProvider>
    );

    // Verify holiday popover is rendered
    const holidayText = screen.getByText("Christmas Day");
    expect(holidayText).toBeInTheDocument();
    expect(holidayText.parentElement).toHaveClass(
      "text-xs",
      "bg-white",
      "rounded-lg"
    );
  });
});
