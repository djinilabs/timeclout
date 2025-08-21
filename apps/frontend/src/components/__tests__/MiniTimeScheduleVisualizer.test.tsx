/* eslint-disable playwright/no-standalone-expect */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  MiniTimeScheduleVisualizer,
  type TimeSchedule,
} from "../particles/MiniTimeScheduleVisualizer";

describe("MiniTimeScheduleVisualizer", () => {
  const mockSchedules: TimeSchedule[] = [
    {
      startHourMinutes: [9, 0],
      endHourMinutes: [17, 0],
      inconveniencePerHour: 0.5,
    },
    {
      startHourMinutes: [17, 0],
      endHourMinutes: [22, 0],
      inconveniencePerHour: 1.2,
    },
  ];

  it("renders nothing when schedules are empty", () => {
    const { container } = render(<MiniTimeScheduleVisualizer schedules={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders start time", () => {
    render(<MiniTimeScheduleVisualizer schedules={mockSchedules} />);
    expect(screen.getByText("09:00")).toBeInTheDocument();
  });

  it("renders end time", () => {
    render(<MiniTimeScheduleVisualizer schedules={mockSchedules} />);
    expect(screen.getByText("22:00")).toBeInTheDocument();
  });

  it("renders total inconvenience score", async () => {
    render(<MiniTimeScheduleVisualizer schedules={mockSchedules} />);
    // Calculate expected inconvenience:
    // First schedule: 0.5 * (17 - 9) = 4
    // Second schedule: 1.2 * (22 - 17) = 6
    // Total = 10
    const inconvenienceElement = screen.getByText("10.0");
    expect(inconvenienceElement).toBeInTheDocument();
    await expect(inconvenienceElement).toHaveClass(
      "bg-orange-300",
      "text-white"
    );
  });

  it("renders schedule bars with correct styling", () => {
    const { container } = render(
      <MiniTimeScheduleVisualizer schedules={mockSchedules} />
    );
    const scheduleBars = container.querySelectorAll(
      ".absolute.h-full.rounded-sm"
    );

    expect(scheduleBars).toHaveLength(2);

    // First schedule (9:00-17:00) with inconvenience 0.5
    const firstBar = scheduleBars[0];
    expect(firstBar).toHaveStyle({
      backgroundColor: `rgb(50, 205, 0)`, // 0.5 * 100 = 50 for red, 255 - 50 = 205 for green
    });

    // Second schedule (17:00-22:00) with inconvenience 1.2
    const secondBar = scheduleBars[1];
    expect(secondBar).toHaveStyle({
      backgroundColor: `rgb(120, 135, 0)`, // 1.2 * 100 = 120 for red, 255 - 120 = 135 for green
    });
  });

  it("handles schedules crossing midnight", () => {
    const midnightSchedules: TimeSchedule[] = [
      {
        startHourMinutes: [22, 0],
        endHourMinutes: [0, 0], // Midnight
        inconveniencePerHour: 1,
      },
    ];

    render(<MiniTimeScheduleVisualizer schedules={midnightSchedules} />);
    expect(screen.getByText("24:00")).toBeInTheDocument(); // Should show 24:00 instead of 00:00
  });

  it("calculates correct width percentage", () => {
    const { container } = render(
      <MiniTimeScheduleVisualizer schedules={mockSchedules} />
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveStyle({ width: "92%" });
  });
});
