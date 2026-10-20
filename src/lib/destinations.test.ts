import { describe, it, expect } from "vitest";
import { DESTINATIONS } from "./destinations";

const SVANETI_IDS = ["ushguli", "mestia", "hatsvali", "chalaadi", "koruldi"];

describe("Svaneti cards", () => {
  const svaneti = DESTINATIONS.filter((d) => d.region === "svaneti");

  it("shows exactly the five Svaneti places", () => {
    expect(svaneti.map((d) => d.id).sort()).toEqual([...SVANETI_IDS].sort());
  });

  it("gives each Svaneti card its own photo", () => {
    const images = svaneti.map((d) => d.image);
    expect(images.every((i) => !!i)).toBe(true);
    expect(new Set(images).size).toBe(5);
  });
});
