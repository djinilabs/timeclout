import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamLeaveSchedule } from "../../molecules/TeamLeaveSchedule";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { BrowserRouter } from "react-router-dom";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock useParams from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({
      company: "test-company",
      unit: "test-unit",
      team: "test-team",
    }),
  };
});

describe("TeamLeaveSchedule", () => {
  const defaultProps = {
    year: 2024,
    month: 2, // March (0-based)
    goTo: vi.fn(),
    schedule: [
      {
        user: {
          pk: "user1",
          name: "John Doe",
          email: "john@example.com",
          emailMd5: "abc123",
        },
        leaves: {
          "2024-03-15": {
            type: "vacation",
            color: "#4CAF50",
            leaveRequest: {
              startDate: "2024-03-15",
              endDate: "2024-03-15",
              type: "vacation",
              approved: true,
              createdAt: "2024-02-01",
              createdBy: { pk: "user1", name: "John Doe" },
              beneficiary: { pk: "user1", name: "John Doe" },
              pk: "leave1",
              sk: "leave1",
            },
          },
        },
      },
    ],
  };

  const renderWithProviders = (ui: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <I18nProvider i18n={i18n}>{ui}</I18nProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Initialize i18n
    i18n.load({
      en: {
        messages: {
          "Previous year": { message: "Previous year" },
          "Next year": { message: "Next year" },
          Today: { message: "Today" },
          Name: { message: "Name" },
          "Open menu": { message: "Open menu" },
        },
      },
    });
    i18n.activate("en");
  });

  it("renders month and year in header", () => {
    renderWithProviders(<TeamLeaveSchedule {...defaultProps} />);
    const headerHeading = screen.getByRole("heading", { name: "March 2024" });
    expect(headerHeading).toBeInTheDocument();
  });

  it("renders table headers with days of month", async () => {
    renderWithProviders(<TeamLeaveSchedule {...defaultProps} />);
    // March 2024 has 31 days
    for (let day = 1; day <= 31; day++) {
      expect(
        (await screen.findAllByText(day.toString())).length
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders user schedule with leaves", () => {
    renderWithProviders(<TeamLeaveSchedule {...defaultProps} />);

    // Check if user name is rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check if leave is rendered with correct color
    const leaveCell = screen.getByTitle("vacation");
    expect(leaveCell).toHaveStyle({ backgroundColor: "#4CAF50" });
  });

  it("renders pending leaves with reduced opacity", () => {
    const propsWithPendingLeave = {
      ...defaultProps,
      schedule: [
        {
          ...defaultProps.schedule[0],
          leaves: {
            "2024-03-15": {
              ...defaultProps.schedule[0].leaves["2024-03-15"],
              leaveRequest: {
                ...defaultProps.schedule[0].leaves["2024-03-15"].leaveRequest!,
                approved: false,
              },
            },
          },
        },
      ],
    };

    renderWithProviders(<TeamLeaveSchedule {...propsWithPendingLeave} />);
    const leaveCell = screen.getByTitle("vacation");
    expect(leaveCell).toHaveClass("opacity-50");
  });
});
