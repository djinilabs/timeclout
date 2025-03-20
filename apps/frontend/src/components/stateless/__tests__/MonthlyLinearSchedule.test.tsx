import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MonthlyLinearSchedule } from "../MonthlyLinearSchedule";
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

describe("MonthlyLinearSchedule", () => {
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
    renderWithProviders(<MonthlyLinearSchedule {...defaultProps} />);
    const headerHeading = screen.getByRole("heading", { name: "March 2024" });
    expect(headerHeading).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    renderWithProviders(<MonthlyLinearSchedule {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /previous year/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next year/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /today/i })).toBeInTheDocument();
  });

  it("calls goTo when navigation buttons are clicked", () => {
    const goTo = vi.fn();
    renderWithProviders(
      <MonthlyLinearSchedule {...defaultProps} goTo={goTo} />
    );

    // Previous month
    fireEvent.click(screen.getByRole("button", { name: /previous year/i }));
    expect(goTo).toHaveBeenCalledWith(2024, 1);

    // Next month
    fireEvent.click(screen.getByRole("button", { name: /next year/i }));
    expect(goTo).toHaveBeenCalledWith(2024, 3);

    // Today
    fireEvent.click(screen.getByRole("button", { name: /today/i }));
    const today = new Date();
    expect(goTo).toHaveBeenCalledWith(today.getFullYear(), today.getMonth());
  });

  it.skip("renders table headers with days of month", () => {
    renderWithProviders(<MonthlyLinearSchedule {...defaultProps} />);
    // March 2024 has 31 days
    for (let day = 1; day <= 31; day++) {
      expect(screen.findAllByText(day.toString())).toBeInTheDocument();
    }
  });

  it("renders user schedule with leaves", () => {
    renderWithProviders(<MonthlyLinearSchedule {...defaultProps} />);

    // Check if user name is rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check if leave is rendered with correct color
    const leaveCell = screen.getByTitle("vacation");
    expect(leaveCell).toHaveStyle({ backgroundColor: "#4CAF50" });
  });

  it("renders weekend days with gray background", () => {
    renderWithProviders(<MonthlyLinearSchedule {...defaultProps} />);

    // In March 2024, 2-3, 9-10, 16-17, 23-24, 30-31 are weekends
    const cells = screen.getAllByRole("cell");
    const weekendIndices = [2, 3, 9, 10, 16, 17, 23, 24, 30, 31];

    weekendIndices.forEach((day) => {
      // Add 1 to skip the name column
      const cell = cells[day];
      expect(cell).toHaveClass("bg-gray-50");
    });
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

    renderWithProviders(<MonthlyLinearSchedule {...propsWithPendingLeave} />);
    const leaveCell = screen.getByTitle("vacation");
    expect(leaveCell).toHaveClass("opacity-50");
  });
});
