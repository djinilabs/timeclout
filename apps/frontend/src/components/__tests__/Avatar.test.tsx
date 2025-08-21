import { i18n } from "@lingui/core";
import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import "@testing-library/jest-dom/vitest";
import { Avatar } from "../particles/Avatar";

describe("Avatar", () => {
  beforeAll(() => {
    i18n.load({
      en: {
        messages: {
          "’s avatar": { message: "’s avatar" },
        },
      },
    });
    i18n.activate("en");
  });

  it("renders with minimal props", () => {
    render(<Avatar />);
    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
    await expect(avatar).toHaveAttribute("alt", "’s avatar");
  });

  it("renders with name and email", () => {
    const props = {
      name: "John Doe",
      email: "john@example.com",
      emailMd5: "abc123",
    };
    render(<Avatar {...props} />);

    const avatar = screen.getByRole("img");

    await expect(avatar).toHaveAttribute(
      "src",
      "https://www.gravatar.com/avatar/abc123?s=250&d=blank"
    );
    await expect(avatar).toHaveAttribute("alt", "john@example.com’s avatar");
  });

  it("generates correct initials", () => {
    const testCases = [
      { name: "John Doe", expected: "JD" },
      { name: "John Middle Doe", expected: "JMD" },
      { name: "Jo", expected: "Jo" },
      { email: "john.doe@example.com", expected: "JD" },
    ];

    testCases.forEach(({ name, email, expected }) => {
      const { container } = render(<Avatar name={name} email={email} />);
      const initialsElement = container.querySelector('[aria-hidden="true"]');
      expect(initialsElement?.textContent).toBe(expected);
    });
  });

  it("applies custom size", () => {
    const size = 100;
    render(<Avatar size={size} />);

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveStyle({
      width: "100px",
      height: "100px",
    });
  });

  it("uses email username when name is not provided", () => {
    render(<Avatar email="john.doe@example.com" />);
    const container = screen.getByRole("img").parentElement;
    expect(container?.querySelector('[aria-hidden="true"]')?.textContent).toBe(
      "JD"
    );
  });

  it("handles null values gracefully", () => {
    render(<Avatar email={null} emailMd5={null} />);
    const avatar = screen.getByRole("img");
    expect(avatar).toBeInTheDocument();
  });
});
