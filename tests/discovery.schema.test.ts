import { describe, expect, it } from "vitest";
import { validateDiscoveryQuery } from "../src/discovery/validateDiscoveryQuery";

describe("discovery query validation", () => {
  it("accepts a valid discovery request", () => {
    const result = validateDiscoveryQuery({
      destination: "Muscat",
      category: "activity",
      limit: "10",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        destination: "Muscat",
        category: "activity",
        limit: 10,
      });
    }
  });

  it("uses the default limit when limit is omitted", () => {
    const result = validateDiscoveryQuery({
      destination: "Muscat",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.limit).toBe(20);
    }
  });

  it("rejects an empty destination", () => {
    const result = validateDiscoveryQuery({
      destination: "   ",
      limit: "10",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.code).toBe("INVALID_INPUT");
      expect(result.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "destination",
          }),
        ]),
      );
    }
  });

  it("rejects a limit above 50", () => {
    const result = validateDiscoveryQuery({
      destination: "Muscat",
      limit: "100",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: "limit",
          }),
        ]),
      );
    }
  });

  it("rejects an unsupported category", () => {
    const result = validateDiscoveryQuery({
      destination: "Muscat",
      category: "hotel",
    });

    expect(result.success).toBe(false);
  });
});
