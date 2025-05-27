import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Button } from "../particles/Button";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Button", () => {
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders a default button with children", () => {
    renderWithRouter(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    renderWithRouter(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('navigates when "to" prop is provided', () => {
    renderWithRouter(<Button to="/some-path">Navigate</Button>);

    fireEvent.click(screen.getByText("Navigate"));
    expect(mockNavigate).toHaveBeenCalledWith("/some-path");
  });

  it("renders a cancel button variant", () => {
    renderWithRouter(<Button cancel>Cancel</Button>);
    const button = screen.getByText("Cancel");

    expect(button).toHaveClass("text-sm/6", "font-semibold", "text-gray-900");
  });

  it("can be disabled", () => {
    renderWithRouter(<Button disabled>Disabled</Button>);

    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:opacity-50",
      "disabled:cursor-not-allowed"
    );
  });

  it("renders with correct type attribute", () => {
    renderWithRouter(<Button type="submit">Submit</Button>);

    const button = screen.getByText("Submit");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("applies correct styles for regular button", () => {
    renderWithRouter(<Button>Regular</Button>);

    const button = screen.getByText("Regular");
    expect(button).toHaveClass(
      "bg-teal-600",
      "text-white",
      "rounded-md",
      "hover:bg-teal-500"
    );
  });
});
