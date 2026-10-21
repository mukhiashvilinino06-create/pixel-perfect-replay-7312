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

import { routeUrl } from "./destinations";

describe("destination photos and map links", () => {
  it("every destination has a Google Maps search link", () => {
    for (const d of DESTINATIONS) expect(d.query.length).toBeGreaterThan(0);
  });
  it("named landmarks each have their own photo", () => {
    const ids = ["martvili", "dadiani", "kolkheti", "sighnaghi", "alazani", "kutaisi", "gelati", "prometheus", "batumi", "gonio", "gergeti", "kazbek", "jvari", "svetitskhoveli", "oldtbilisi", "narikala", "abanotubani", "khoni"];
    const imgs = ids.map((id) => DESTINATIONS.find((d) => d.id === id)?.image);
    expect(imgs.every(Boolean)).toBe(true);
    expect(new Set(imgs).size).toBe(ids.length);
  });
});

describe("routeUrl", () => {
  it("keeps stops in order as waypoints", () => {
    const u = routeUrl("Tbilisi, Georgia", ["A", "B", "C"])!;
    expect(u).toContain("origin=Tbilisi%2C%20Georgia");
    expect(u).toContain("destination=C");
    expect(u).toContain("waypoints=A%7CB");
  });
  it("returns null for more than 10 points", () => {
    expect(routeUrl("X", Array.from({ length: 10 }, (_, i) => `S${i}`))).toBeNull();
  });
});
