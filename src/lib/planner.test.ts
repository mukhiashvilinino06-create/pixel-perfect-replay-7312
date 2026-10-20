import { describe, it, expect } from "vitest";
import { generatePlan, validate, type PlanInput } from "./planner";
import { destById } from "./destinations";

const base: PlanInput = {
  days: 3, start: "tbilisi", region: "svaneti", budget: "medium", group: 2,
  styles: ["nature"], transport: "car",
};

describe("planner", () => {
  for (const days of [1, 3, 7]) {
    it(`returns exactly ${days} days`, () => {
      expect(generatePlan({ ...base, days }).days).toHaveLength(days);
    });
  }

  it("never repeats a destination", () => {
    const plan = generatePlan({ ...base, days: 7, region: "samegrelo" });
    const ids = plan.days.flatMap((d) => d.items.filter((i) => i.type === "stop").map((i) => (i as { destId: string }).destId));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes Svaneti and Samegrelo stops when selected", () => {
    for (const region of ["svaneti", "samegrelo"] as const) {
      const plan = generatePlan({ ...base, region });
      const stops = plan.days.flatMap((d) => d.items).filter((i) => i.type === "stop");
      expect(stops.some((s) => destById((s as { destId: string }).destId).region === region)).toBe(true);
    }
  });

  it("allows 1 to 7 days only", () => {
    expect(validate({ ...base, days: 8 }).days).toBeDefined();
    expect(validate({ ...base, days: 0 }).days).toBeDefined();
    expect(validate({ ...base, days: 7 }).days).toBeUndefined();
  });

  it("requires at least one travel style", () => {
    expect(validate({ ...base, styles: [] }).styles).toBeDefined();
  });
});
