import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { useI18n } from "@/lib/i18n";
import { DESTINATIONS, REGIONS, mapsUrl, regionById, type RegionId } from "@/lib/destinations";
import { Planner, DEFAULT_INPUT } from "@/components/geo/Planner";
import type { PlanInput } from "@/lib/planner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GeoExplorer AI — Discover Georgia, Your Way" },
      { name: "description", content: "Plan 1–7 day trips across Georgia: Svaneti, Samegrelo, Kazbegi, Kakheti and more. Georgian and English." },
      { property: "og:title", content: "GeoExplorer AI — Discover Georgia, Your Way" },
      { property: "og:description", content: "Bilingual trip planner for Svaneti, Samegrelo and all of Georgia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, lang, setLang } = useI18n();
  const [input, setInput] = useState<PlanInput>(DEFAULT_INPUT);
  const [filter, setFilter] = useState<RegionId | "all">("all");

  const addToTrip = (region: RegionId) => {
    setInput((p) => ({ ...p, region }));
    document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
  };
  const shown = DESTINATIONS.filter((d) => filter === "all" || d.region === filter);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="font-display text-lg font-bold text-primary">GeoExplorer <span className="text-accent">AI</span></a>
          <nav className="hidden gap-6 text-sm font-medium sm:flex">
            <a href="#destinations" className="hover:text-accent">{t("navDestinations")}</a>
            <a href="#planner" className="hover:text-accent">{t("navPlanner")}</a>
          </nav>
          <div className="flex items-center rounded-full border bg-card p-1 text-sm" role="group" aria-label="Language">
            {(["ka", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 font-medium transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {l === "ka" ? "ქართული" : "English"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section id="top" className="relative flex min-h-[78vh] items-end overflow-hidden">
        <img src={hero} alt="" width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 text-hero-foreground md:pb-24">
          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">{t("heroSub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#planner" className="rounded-full bg-accent px-7 py-3 font-semibold text-accent-foreground transition hover:opacity-90">{t("heroCta")}</a>
            <a href="#destinations" className="rounded-full border border-hero-foreground/60 px-7 py-3 font-semibold transition hover:bg-hero-foreground/10">{t("heroCta2")}</a>
          </div>
        </div>
      </section>

      <section id="destinations" className="mx-auto max-w-6xl scroll-mt-16 px-5 py-20">
        <h2 className="text-3xl font-bold text-primary md:text-4xl">{t("destTitle")}</h2>
        <p className="mt-2 text-muted-foreground">{t("destSub")}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{t("all")}</button>
          {REGIONS.map((r) => (
            <button key={r.id} className="chip" aria-pressed={filter === r.id} onClick={() => setFilter(r.id)}>{r.name[lang]}</button>
          ))}
        </div>
        {filter !== "all" && <p className="mt-4 text-sm text-muted-foreground">{regionById(filter).blurb[lang]}</p>}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((d) => {
            const r = regionById(d.region);
            return (
              <article key={d.id} className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={r.image} alt={`${d.name.en}, ${r.name.en}`} loading="lazy" width={1024} height={768}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary">{r.name[lang]}</span>
                  {d.seasonal && <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{t("seasonalBadge")}</span>}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-bold">{d.name[lang]}</h3>
                  {lang === "ka" && <p className="text-xs text-muted-foreground">{d.name.en}</p>}
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.desc[lang]}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{t("approxVisit", { h: d.hours })}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => addToTrip(d.region)} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">{t("addToTrip")}</button>
                    <a href={mapsUrl(d.query)} target="_blank" rel="noreferrer" className="rounded-full border px-4 py-2 text-sm font-medium transition hover:border-primary">{t("viewMap")} ↗</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Planner input={input} setInput={setInput} />

      <footer className="bg-primary py-10 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 text-sm">
          <p className="font-semibold">{t("footer")}</p>
          <p className="mt-1 opacity-75">{t("footerNote")}</p>
        </div>
      </footer>
    </div>
  );
}
