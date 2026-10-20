import { DESTINATIONS, regionById, type Destination, type RegionId, type Style } from "./destinations";

export type StartId = "tbilisi" | "kutaisi" | "batumi" | "custom";
export type Transport = "public" | "car" | "private";
export type Budget = "low" | "medium" | "high";

export interface PlanInput {
  days: number;
  start: StartId;
  customStart?: string;
  region: RegionId;
  budget: Budget;
  group: number;
  styles: Style[];
  transport: Transport;
  notes?: string;
}

export type Item =
  | { type: "travel"; to: RegionId; hours: number | null }
  | { type: "return"; from: RegionId; hours: number | null }
  | { type: "transfer"; from: RegionId; to: RegionId; hours: number }
  | { type: "stop"; destId: string; reasons: Style[] }
  | { type: "rest" };

export interface Day {
  index: number;
  region: RegionId;
  items: Item[];
}

export type NoteKey =
  | "mountain"
  | "longDrive"
  | "customStart"
  | "bigGroup"
  | "publicTransport"
  | "privateTransfer"
  | "seasonal";

export interface Plan {
  days: Day[];
  regions: RegionId[];
  notes: NoteKey[];
  budgetRange: [number, number] | null; // approx GEL per person total
}

// Approximate one-way road hours from start points to regions.
const TRAVEL: Record<Exclude<StartId, "custom">, Record<RegionId, number>> = {
  tbilisi: { svaneti: 9, samegrelo: 5, imereti: 3.5, kazbegi: 3, mtskheta: 0.5, kakheti: 2, adjara: 5.5 },
  kutaisi: { svaneti: 5, samegrelo: 2, imereti: 0, kazbegi: 6, mtskheta: 3, kakheti: 5, adjara: 2.5 },
  batumi: { svaneti: 5.5, samegrelo: 2.5, imereti: 2.5, kazbegi: 8, mtskheta: 5, kakheti: 7, adjara: 0 },
};

const NEIGHBORS: Record<RegionId, { id: RegionId; hours: number }[]> = {
  svaneti: [{ id: "samegrelo", hours: 3.5 }],
  samegrelo: [{ id: "imereti", hours: 2 }, { id: "svaneti", hours: 3.5 }, { id: "adjara", hours: 2.5 }],
  imereti: [{ id: "samegrelo", hours: 2 }, { id: "adjara", hours: 2.5 }],
  kazbegi: [{ id: "mtskheta", hours: 2.5 }],
  mtskheta: [{ id: "kazbegi", hours: 2.5 }, { id: "kakheti", hours: 2 }],
  kakheti: [{ id: "mtskheta", hours: 2 }],
  adjara: [{ id: "imereti", hours: 2.5 }, { id: "samegrelo", hours: 2.5 }],
};

// Approximate daily spend per person in GEL (accommodation, food, local transport).
export const BUDGET_PER_DAY: Record<Budget, [number, number]> = {
  low: [80, 150],
  medium: [150, 300],
  high: [300, 600],
};

const score = (d: Destination, styles: Style[]) => d.styles.filter((s) => styles.includes(s)).length;

function orderPool(region: RegionId, styles: Style[]) {
  const list = DESTINATIONS.filter((d) => d.region === region);
  return [...list].sort((a, b) => {
    if (a.hub !== b.hub) return a.hub ? -1 : 1;
    return score(b, styles) - score(a, styles);
  });
}

export function travelHours(start: StartId, region: RegionId): number | null {
  if (start === "custom") return null;
  return TRAVEL[start][region];
}

export function generatePlan(input: PlanInput): Plan {
  const days = Math.max(1, Math.min(7, Math.round(input.days)));
  const dayBudget = input.transport === "public" ? 5 : 7; // usable sightseeing hours
  const tHours = travelHours(input.start, input.region);
  const longTravel = tHours === null ? true : tHours >= 4;

  // Region sequence: add neighbors only for longer trips when the main pool runs out.
  const regions: RegionId[] = [input.region];
  const pools = {} as Record<RegionId, Destination[]>; Object.assign(pools, { [input.region]: orderPool(input.region, input.styles) });
  const capacity = () => regions.reduce((n, r) => n + pools[r].length, 0);
  const neededStops = days * 2;
  for (const n of NEIGHBORS[input.region]) {
    if (days < 4 || capacity() >= neededStops) break;
    regions.push(n.id);
    pools[n.id] = orderPool(n.id, input.styles);
  }

  const out: Day[] = [];
  let regionIdx = 0;
  let current: RegionId = input.region;

  for (let i = 0; i < days; i++) {
    const items: Item[] = [];
    let hoursLeft = dayBudget;
    const isFirst = i === 0;
    const isLast = i === days - 1 && days > 1;

    if (isFirst && tHours !== 0) {
      items.push({ type: "travel", to: current, hours: tHours });
      hoursLeft -= tHours ?? 4;
    }

    // Move to next region when current pool is empty.
    if (!isFirst && pools[current].length === 0 && regionIdx < regions.length - 1) {
      const next = regions[regionIdx + 1]!;
      const h = NEIGHBORS[current].find((n) => n.id === next)?.hours ?? 3;
      items.push({ type: "transfer", from: current, to: next, hours: h });
      hoursLeft -= h;
      regionIdx++;
      current = next;
    }

    const willReturn = isLast && longTravel && input.start !== "custom";
    if (willReturn) hoursLeft = Math.min(hoursLeft, 3);

    let added = 0;
    const pool = pools[current];
    while (pool.length) {
      const idx = pool.findIndex((d) => d.hours <= Math.max(hoursLeft, added === 0 ? 3 : 0));
      if (idx === -1) break;
      if (added === 0 && hoursLeft < 1.5 && !(isFirst && pool[idx]!.hub)) break;
      const d = pool.splice(idx, 1)[0]!;
      items.push({ type: "stop", destId: d.id, reasons: d.styles.filter((s) => input.styles.includes(s)) });
      hoursLeft -= d.hours;
      added++;
      if (hoursLeft < 1.5 || added >= 3) break;
    }
    if (added === 0) items.push({ type: "rest" });

    if (isLast && tHours !== 0) {
      const back = input.start === "custom" ? null : TRAVEL[input.start][current];
      items.push({ type: "return", from: current, hours: back });
    }
    out.push({ index: i + 1, region: current, items });
  }

  const notes: NoteKey[] = [];
  const used = new Set(out.flatMap((d) => d.items.filter((x) => x.type === "stop").map((x) => (x as { destId: string }).destId)));
  if (regions.some((r) => regionById(r).mountain)) notes.push("mountain");
  if (DESTINATIONS.some((d) => used.has(d.id) && d.seasonal)) notes.push("seasonal");
  if (tHours !== null && tHours >= 4) notes.push("longDrive");
  if (input.start === "custom") notes.push("customStart");
  if (input.group >= 5) notes.push("bigGroup");
  if (input.transport === "public") notes.push("publicTransport");
  if (input.transport === "private") notes.push("privateTransfer");

  const [lo, hi] = BUDGET_PER_DAY[input.budget];
  return { days: out, regions, notes, budgetRange: [lo * days, hi * days] };
}

export type ValidationErrors = Partial<Record<"days" | "customStart" | "group" | "styles", string>>;

export function validate(input: PlanInput): ValidationErrors {
  const e: ValidationErrors = {};
  if (!Number.isInteger(input.days) || input.days < 1 || input.days > 7) e.days = "errDays";
  if (input.start === "custom" && !input.customStart?.trim()) e.customStart = "errCustom";
  if (!Number.isInteger(input.group) || input.group < 1 || input.group > 30) e.group = "errGroup";
  if (input.styles.length === 0) e.styles = "errStyles";
  return e;
}
