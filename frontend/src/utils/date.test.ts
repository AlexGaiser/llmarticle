import { describe, it, expect } from "vitest";
import { formatDate, formatDateTime } from "./date";

describe("formatDate", () => {
  it("formats ISO date string to locale date", () => {
    const result = formatDate("2026-01-01T12:00:00.000Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("formatDateTime", () => {
  it("formats ISO date string to locale date time", () => {
    const result = formatDateTime("2026-01-01T12:00:00.000Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});
