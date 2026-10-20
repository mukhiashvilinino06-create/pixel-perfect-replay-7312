import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./destinations";

const dict = {
  navDestinations: { ka: "მიმართულებები", en: "Destinations" },
  navPlanner: { ka: "დამგეგმავი", en: "Trip planner" },
  heroTitle: { ka: "აღმოაჩინე საქართველო შენებურად.", en: "Discover Georgia, Your Way." },
  heroSub: { ka: "პერსონალური მარშრუტები სვანეთიდან სამეგრელომდე, 1-დან 7 დღემდე.", en: "Personal itineraries from Svaneti to Samegrelo, from 1 to 7 days." },
  heroCta: { ka: "დაგეგმე მოგზაურობა", en: "Plan your trip" },
  heroCta2: { ka: "ნახე მიმართულებები", en: "Browse destinations" },
  destTitle: { ka: "მიმართულებები", en: "Destinations" },
  destSub: { ka: "აირჩიე რეგიონი და დაამატე ადგილები მოგზაურობაში.", en: "Pick a region and add places to your trip." },
  all: { ka: "ყველა", en: "All" },
  addToTrip: { ka: "დაამატე მოგზაურობაში", en: "Add to trip" },
  viewMap: { ka: "რუკაზე ნახვა", en: "View on map" },
  seasonalBadge: { ka: "სეზონური", en: "Seasonal" },
  approxVisit: { ka: "ვიზიტი ~{h} სთ", en: "Visit ~{h} h" },
  plannerTitle: { ka: "მოგზაურობის დამგეგმავი", en: "Trip planner" },
  plannerSub: { ka: "შეავსე პარამეტრები და მიიღე დღიური მარშრუტი.", en: "Set your preferences and get a day-by-day route." },
  days: { ka: "ხანგრძლივობა", en: "Duration" },
  dayN: { ka: "{n} დღე", en: "{n} day|{n} days" },
  start: { ka: "საწყისი წერტილი", en: "Starting point" },
  customPlaceholder: { ka: "მაგ. თელავი", en: "e.g. Telavi" },
  region: { ka: "რეგიონი", en: "Region" },
  budget: { ka: "ბიუჯეტი ერთ ადამიანზე", en: "Budget per person" },
  group: { ka: "ჯგუფის ზომა", en: "Group size" },
  styles: { ka: "მოგზაურობის სტილი", en: "Travel style" },
  transport: { ka: "ტრანსპორტი", en: "Transportation" },
  notes: { ka: "დამატებითი ინტერესები ან მოთხოვნები", en: "Extra interests or requirements" },
  notesPh: { ka: "მაგ. ბავშვებთან ერთად, ნაკლები ლაშქრობა", en: "e.g. travelling with kids, less hiking" },
  generate: { ka: "მარშრუტის შექმნა", en: "Generate itinerary" },
  regenerate: { ka: "განახლება", en: "Update itinerary" },
  reset: { ka: "გასუფთავება", en: "Reset" },
  loading: { ka: "მარშრუტს ვამზადებთ…", en: "Preparing your itinerary…" },
  errDays: { ka: "აირჩიე 1-დან 7 დღემდე.", en: "Choose between 1 and 7 days." },
  errCustom: { ka: "მიუთითე საწყისი წერტილი.", en: "Enter your starting point." },
  errGroup: { ka: "ჯგუფი უნდა იყოს 1-დან 30-მდე.", en: "Group size must be 1–30." },
  errStyles: { ka: "აირჩიე მინიმუმ ერთი სტილი.", en: "Select at least one travel style." },
  errSummary: { ka: "გთხოვ, გაასწორე მონიშნული ველები.", en: "Please fix the highlighted fields." },
  s_tbilisi: { ka: "თბილისი", en: "Tbilisi" },
  s_kutaisi: { ka: "ქუთაისი", en: "Kutaisi" },
  s_batumi: { ka: "ბათუმი", en: "Batumi" },
  s_custom: { ka: "სხვა", en: "Other" },
  b_low: { ka: "დაბალი", en: "Low" },
  b_medium: { ka: "საშუალო", en: "Medium" },
  b_high: { ka: "მაღალი", en: "High" },
  b_hint: { ka: "~{lo}–{hi} ₾ / დღე", en: "~{lo}–{hi} GEL / day" },
  st_nature: { ka: "ბუნება", en: "Nature" },
  st_wine: { ka: "ღვინო და კერძები", en: "Wine & Food" },
  st_history: { ka: "ისტორია", en: "History" },
  st_adventure: { ka: "თავგადასავალი", en: "Adventure" },
  t_public: { ka: "საზოგადოებრივი", en: "Public transport" },
  t_car: { ka: "ქირავნობის მანქანა", en: "Rental car" },
  t_private: { ka: "კერძო ტრანსფერი", en: "Private transfer" },
  resultTitle: { ka: "შენი მარშრუტი", en: "Your itinerary" },
  demoLabel: { ka: "სადემონსტრაციო რეკომენდაციები — შექმნილია ადგილობრივი წესებით, არა ცოცხალი AI მოდელით.", en: "Demo recommendations — built from curated local rules, not a live AI model." },
  dayLabel: { ka: "დღე {n}", en: "Day {n}" },
  travelTo: { ka: "გზა: {from} → {to}", en: "Travel: {from} → {to}" },
  returnFrom: { ka: "დაბრუნება: {from} → {to}", en: "Return: {from} → {to}" },
  transfer: { ka: "გადასვლა: {from} → {to}", en: "Transfer: {from} → {to}" },
  hoursApprox: { ka: "~{h} სთ გზაში", en: "~{h} h on the road" },
  hoursUnknown: { ka: "დრო დამოკიდებულია საწყის წერტილზე", en: "time depends on your start point" },
  directions: { ka: "მარშრუტი", en: "Directions" },
  rest: { ka: "თავისუფალი დრო ან დასვენება — ადგილობრივი სეირნობა, კაფეები ან სათადარიგო დღე ამინდისთვის.", en: "Free time or rest — local walks, cafés, or a spare day for weather." },
  why: { ka: "რატომ: {r}", en: "Why: {r}" },
  whyDefault: { ka: "რეგიონის მთავარი ღირსშესანიშნაობა", en: "a key highlight of the region" },
  budgetTitle: { ka: "სავარაუდო ბიუჯეტი", en: "Approximate budget" },
  budgetText: { ka: "~{lo}–{hi} ₾ ერთ ადამიანზე მთელი მოგზაურობისთვის (ღამისთევა, კვება, ადგილობრივი გადაადგილება).", en: "~{lo}–{hi} GEL per person for the whole trip (stay, food, local transport)." },
  budgetDisclaimer: { ka: "ეს მხოლოდ მიახლოებითი შეფასებაა; რეალური ფასები სეზონისა და არჩევანის მიხედვით განსხვავდება.", en: "Rough estimate only; actual prices vary by season and choices." },
  weatherNote: { ka: "ცოცხალი ამინდის მონაცემები პროტოტიპში მიუწვდომელია. გამგზავრებამდე შეამოწმე პროგნოზი.", en: "Live weather is unavailable in this prototype. Check a forecast before you go." },
  notesTitle: { ka: "პრაქტიკული რჩევები", en: "Practical notes" },
  n_mountain: { ka: "მთის ამინდი სწრაფად იცვლება; წაიღე თბილი ტანსაცმელი და იყავი მოქნილი.", en: "Mountain weather changes fast; pack warm layers and stay flexible." },
  n_seasonal: { ka: "ზოგი ადგილი სეზონურია — ზამთარში ან ცუდ ამინდში შეიძლება მიუწვდომელი იყოს.", en: "Some places are seasonal and may be unreachable in winter or bad weather." },
  n_longDrive: { ka: "პირველი და ბოლო დღე ძირითადად გზაში გავა; დაიწყე ადრე.", en: "First and last days are mostly travel; start early." },
  n_customStart: { ka: "საწყისი წერტილის გზის დრო ვერ შევაფასეთ — გადაამოწმე რუკაზე.", en: "We can't estimate travel time from your start — check it on the map." },
  n_bigGroup: { ka: "დიდი ჯგუფისთვის წინასწარ დაჯავშნე მინივენი და საცხოვრებელი.", en: "For larger groups, book a minivan and lodging ahead." },
  n_publicTransport: { ka: "მარშრუტკები ხშირად დილით გადის და განრიგი იცვლება — დააზუსტე ადგილზე.", en: "Marshrutkas usually leave in the morning and schedules change — confirm locally." },
  n_privateTransfer: { ka: "კერძო ტრანსფერი ყველაზე მოქნილია მთის გზებზე.", en: "A private transfer is the most flexible option on mountain roads." },
  yourNotes: { ka: "შენი შენიშვნები: {n}", en: "Your notes: {n}" },
  footer: { ka: "GeoExplorer AI — საქართველოს მოგზაურობის დამგეგმავი პროტოტიპი.", en: "GeoExplorer AI — a Georgia travel-planning prototype." },
  footerNote: { ka: "ინფორმაცია საორიენტაციოა. გადაამოწმე გზები, ამინდი და სამუშაო საათები.", en: "Information is indicative. Verify roads, weather and opening hours." },
  added: { ka: "დამატებულია", en: "Added" },
} as const;

export type TKey = keyof typeof dict;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey, vars?: Record<string, string | number>) => string;
}
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("geo-lang");
    if (saved === "ka" || saved === "en") setLangState(saved);
    else if (navigator.language?.toLowerCase().startsWith("ka")) setLangState("ka");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("geo-lang", l);
  };

  const t: Ctx["t"] = (k, vars = {}) => {
    let s: string = dict[k][lang];
    if (s.includes("|")) {
      const [one, many] = s.split("|");
      s = (Number(vars["n"]) === 1 ? one : many) ?? s;
    }
    return s.replace(/\{(\w+)\}/g, (_, v) => String(vars[v] ?? ""));
  };

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const c = useContext(I18nCtx);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
