import { describe, it, expect } from "vitest";
import { areAllBracesBalanced } from "./areAllBracesBalanced";

describe("areAllBracesBalanced", () => {
  it("should return true for empty string", () => {
    expect(areAllBracesBalanced("")).toBe(true);
  });

  it("should return true for balanced braces", () => {
    expect(areAllBracesBalanced("{}")).toBe(true);
    expect(areAllBracesBalanced("{{}}")).toBe(true);
    expect(areAllBracesBalanced("{{{}}}")).toBe(true);
  });

  it("should return false for unbalanced braces", () => {
    expect(areAllBracesBalanced("{")).toBe(false);
    expect(areAllBracesBalanced("}")).toBe(false);
    expect(areAllBracesBalanced("{{}")).toBe(false);
    expect(areAllBracesBalanced("{}}")).toBe(false);
  });

  it("should handle braces inside strings", () => {
    expect(areAllBracesBalanced('{"key": "value"}')).toBe(true);
    expect(areAllBracesBalanced('{"key": "value"')).toBe(false);
    expect(areAllBracesBalanced('{"key": "value"}}')).toBe(false);
  });

  it("should handle braces that are part of string content", () => {
    expect(areAllBracesBalanced('{"text": "Hello {world}"}')).toBe(true);
    expect(areAllBracesBalanced('{"text": "Hello {world}"')).toBe(false);
    expect(areAllBracesBalanced('{"text": "Hello {world"')).toBe(false);
    expect(areAllBracesBalanced('{"text": "Hello world}"')).toBe(false);
    expect(areAllBracesBalanced('{"text": "Hello {world} and {more}"}')).toBe(
      true
    );
    expect(areAllBracesBalanced('{"text": "Hello {world and {more"}')).toBe(
      true
    );
  });

  it("should handle incomplete JSON strings", () => {
    expect(areAllBracesBalanced('{"name": "John", "age": 30')).toBe(false);
    expect(areAllBracesBalanced('{"name": "John", "age": 30,')).toBe(false);
    expect(areAllBracesBalanced('{"name": "John", "age": 30, "city":')).toBe(
      false
    );
    expect(
      areAllBracesBalanced('{"name": "John", "age": 30, "city": "New York"')
    ).toBe(false);
  });

  it("should handle nested JSON structures", () => {
    expect(areAllBracesBalanced('{"user": {"name": "John", "age": 30}}')).toBe(
      true
    );
    expect(areAllBracesBalanced('{"user": {"name": "John", "age": 30}')).toBe(
      false
    );
    expect(areAllBracesBalanced('{"user": {"name": "John", "age": 30}}}')).toBe(
      false
    );
  });

  it("should handle complex JSON with arrays", () => {
    expect(areAllBracesBalanced('{"items": [1, 2, 3]}')).toBe(true);
    expect(areAllBracesBalanced('{"items": [1, 2, 3]')).toBe(false);
    expect(areAllBracesBalanced('{"items": [1, 2, 3]}}')).toBe(false);
  });

  it("should handle escaped quotes in strings", () => {
    expect(areAllBracesBalanced('{"text": "Hello \\"World\\""}')).toBe(true);
    expect(areAllBracesBalanced('{"text": "Hello \\"World\\""')).toBe(false);
  });
});
