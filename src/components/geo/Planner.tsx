import { useState } from "react";
import { useI18n, type TKey } from "@/lib/i18n";
import { REGIONS, destById, mapsUrl, regionById, routeUrl, type RegionId, type Style } from "@/lib/destinations";
import {
  BUDGET_PER_DAY, generatePlan, validate,
  type Budget, type Plan, type PlanInput, type StartId, type Transport, type ValidationErrors,
} from "@/lib/planner";

export const DEFAULT_INPUT: PlanInput = {
  days: 3, start: "tbilisi", customStart: "", region: "svaneti", budget: "medium",
  group: 2, styles: ["nature"], transport: "car", notes: "",
};

const STARTS: StartId[] = ["tbilisi", "kutaisi", "batumi", "custom"];
const BUDGETS: Budget[] = ["low", "medium", "high"];
const STYLES: Style[] = ["nature", "wine", "history", "adventure"];
const TRANSPORTS: Transport[] = ["public", "car", "private"];

export function Planner({ input, setInput }: { input: PlanInput; setInput: (f: (p: PlanInput) => PlanInput) => void }) {
  const { t, lang } = useI18n();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<{ plan: Plan; input: PlanInput } | null>(null);

  const upd = <K extends keyof PlanInput>(k: K, v: PlanInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(input);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      setPlan({ plan: generatePlan(input), input: { ...input } });
      setLoading(false);
      document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 700);
  };

  const reset = () => { setInput(() => DEFAULT_INPUT); setErrors({}); setPlan(null); };
  const err = (k: keyof ValidationErrors) =>
    errors[k] ? <p className="mt-1.5 text-sm text-destructive">{t(errors[k] as TKey)}</p> : null;

  return (
    <section id="planner" className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="text-3xl font-bold text-primary md:text-4xl">{t("plannerTitle")}</h2>
        <p className="mt-2 text-muted-foreground">{t("plannerSub")}</p>

        <form onSubmit={submit} noValidate className="mt-8 grid gap-6 rounded-3xl bg-card p-6 shadow-card md:grid-cols-2 md:p-8">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold">{t("days")}: <span className="text-accent">{t("dayN", { n: input.days })}</span></label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button type="button" key={n} aria-pressed={input.days === n} onClick={() => upd("days", n)} className="chip min-w-11">{n}</button>
              ))}
            </div>
            {err("days")}
          </div>

          <div>
            <label htmlFor="start" className="mb-2 block text-sm font-semibold">{t("start")}</label>
            <select id="start" className="field" value={input.start} onChange={(e) => upd("start", e.target.value as StartId)}>
              {STARTS.map((s) => <option key={s} value={s}>{t(`s_${s}` as TKey)}</option>)}
            </select>
            {input.start === "custom" && (
              <input aria-label={t("start")} className="field mt-2" placeholder={t("customPlaceholder")} value={input.customStart}
                onChange={(e) => upd("customStart", e.target.value)} />
            )}
            {err("customStart")}
          </div>

          <div>
            <label htmlFor="region" className="mb-2 block text-sm font-semibold">{t("region")}</label>
            <select id="region" className="field" value={input.region} onChange={(e) => upd("region", e.target.value as RegionId)}>
              {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name[lang]}</option>)}
            </select>
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold">{t("budget")}</span>
            <div className="grid grid-cols-3 gap-2">
              {BUDGETS.map((b) => (
                <button type="button" key={b} aria-pressed={input.budget === b} onClick={() => upd("budget", b)} className="chip flex flex-col items-center rounded-xl! py-2">
                  <span className="font-semibold">{t(`b_${b}` as TKey)}</span>
                  <span className="text-xs opacity-75">{t("b_hint", { lo: BUDGET_PER_DAY[b][0], hi: BUDGET_PER_DAY[b][1] })}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="group" className="mb-2 block text-sm font-semibold">{t("group")}</label>
            <input id="group" type="number" min={1} max={30} className="field" value={input.group}
              onChange={(e) => upd("group", Number(e.target.value))} />
            {err("group")}
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold">{t("styles")}</span>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => {
                const on = input.styles.includes(s);
                return (
                  <button type="button" key={s} aria-pressed={on} className="chip"
                    onClick={() => upd("styles", on ? input.styles.filter((x) => x !== s) : [...input.styles, s])}>
                    {t(`st_${s}` as TKey)}
                  </button>
                );
              })}
            </div>
            {err("styles")}
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold">{t("transport")}</span>
            <div className="flex flex-wrap gap-2">
              {TRANSPORTS.map((tr) => (
                <button type="button" key={tr} aria-pressed={input.transport === tr} onClick={() => upd("transport", tr)} className="chip">{t(`t_${tr}` as TKey)}</button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="mb-2 block text-sm font-semibold">{t("notes")}</label>
            <textarea id="notes" rows={2} className="field" placeholder={t("notesPh")} value={input.notes}
              onChange={(e) => upd("notes", e.target.value)} />
          </div>

          {Object.keys(errors).length > 0 && <p className="text-sm font-medium text-destructive md:col-span-2" role="alert">{t("errSummary")}</p>}

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button type="submit" disabled={loading}
              className="rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
              {loading ? t("loading") : plan ? t("regenerate") : t("generate")}
            </button>
            <button type="button" onClick={reset} className="rounded-full border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary/5">
              {t("reset")}
            </button>
          </div>
        </form>

        <div id="result" className="scroll-mt-24">
          {loading && (
            <div className="mt-10 flex items-center gap-3 text-muted-foreground" aria-live="polite">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />{t("loading")}
            </div>
          )}
          {!loading && plan && <Result plan={plan.plan} input={plan.input} />}
        </div>
      </div>
    </section>
  );
}

function Result({ plan, input }: { plan: Plan; input: PlanInput }) {
  const { t, lang } = useI18n();
  const startName = input.start === "custom" ? input.customStart || t("s_custom") : t(`s_${input.start}` as TKey);
  const rName = (id: RegionId) => regionById(id).name[lang];
  const dirUrl = (to: string) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startName + ", Georgia")}&destination=${encodeURIComponent(to + ", Georgia")}`;
  const stopQueries = plan.days.flatMap((d) => d.items.flatMap((it) => (it.type === "stop" ? [destById(it.destId).query] : [])));
  const origin = input.start === "custom" ? (input.customStart.trim() ? `${input.customStart.trim()}, Georgia` : null) : `${t(`s_${input.start}` as TKey)}, Georgia`;
  const fullRoute = routeUrl(origin, stopQueries);
  const hrs = (h: number | null) => (h === null ? t("hoursUnknown") : t("hoursApprox", { h }));

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-2xl font-bold text-primary md:text-3xl">{t("resultTitle")} · {t("dayN", { n: plan.days.length })}</h3>
      <p className="mt-3 inline-block rounded-full bg-accent/15 px-4 py-1.5 text-sm font-medium text-accent">{t("demoLabel")}</p>

      <p className="mt-4 text-sm">
        {fullRoute
          ? <a href={fullRoute} target="_blank" rel="noopener noreferrer" aria-label={t("fullRouteAria")} className="inline-block rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground transition hover:opacity-90">{t("fullRoute")} ↗</a>
          : <span className="text-muted-foreground">{t("routeTooLong")}</span>}
      </p>

      <ol className="mt-8 space-y-5">
        {plan.days.map((d) => (
          <li key={d.index} className="rounded-2xl border bg-card p-5 md:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="text-xl font-bold">{t("dayLabel", { n: d.index })}</h4>
              <span className="text-sm text-muted-foreground">{rName(d.region)}</span>
            </div>
            <ul className="mt-4 space-y-4">
              {d.items.map((it, i) => {
                if (it.type === "stop") {
                  const dest = destById(it.destId);
                  const r = it.reasons.length ? it.reasons.map((s) => t(`st_${s}` as TKey)).join(", ") : t("whyDefault");
                  return (
                    <li key={i} className="flex gap-4 border-l-2 border-accent pl-4">
                      <img src={dest.image ?? regionById(dest.region).image} alt={t("photoAlt", { name: dest.name[lang], region: rName(dest.region) })}
                        loading="lazy" decoding="async" width={96} height={72} className="hidden h-[72px] w-24 shrink-0 rounded-lg object-cover sm:block"
                        onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold">{dest.name[lang]}</span>
                        <span className="text-xs text-muted-foreground">{t("approxVisit", { h: dest.hours })}</span>
                        {dest.seasonal && <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{t("seasonalBadge")}</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{dest.desc[lang]}</p>
                      <p className="mt-1 text-sm">{dest.activity[lang]}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t("why", { r })}</p>
                      <a className="mt-1 inline-block text-sm font-medium text-primary underline underline-offset-4" href={mapsUrl(dest.query)} target="_blank" rel="noopener noreferrer" aria-label={t("viewMapAria", { name: dest.name[lang] })}>{t("viewMap")} ↗</a>
                      </div>
                    </li>
                  );
                }
                if (it.type === "rest") return <li key={i} className="pl-4 text-sm italic text-muted-foreground">{t("rest")}</li>;
                const label =
                  it.type === "travel" ? t("travelTo", { from: startName, to: rName(it.to) })
                  : it.type === "return" ? t("returnFrom", { from: rName(it.from), to: startName })
                  : t("transfer", { from: rName(it.from), to: rName(it.to) });
                const target = it.type === "travel" ? regionById(it.to).name.en : it.type === "transfer" ? regionById(it.to).name.en : null;
                return (
                  <li key={i} className="rounded-xl bg-muted px-4 py-3 text-sm">
                    <span className="font-medium">{label}</span> <span className="text-muted-foreground">({hrs(it.hours)})</span>
                    {target && input.start !== "custom" && (
                      <a className="ml-2 font-medium text-primary underline underline-offset-4" href={dirUrl(target)} target="_blank" rel="noreferrer">{t("directions")} ↗</a>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {plan.budgetRange && (
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <h4 className="text-lg font-bold">{t("budgetTitle")}</h4>
            <p className="mt-2">{t("budgetText", { lo: plan.budgetRange[0], hi: plan.budgetRange[1] })}</p>
            <p className="mt-2 text-sm opacity-80">{t("budgetDisclaimer")}</p>
          </div>
        )}
        <div className="rounded-2xl border bg-card p-6">
          <h4 className="text-lg font-bold">{t("notesTitle")}</h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
            {plan.notes.map((n) => <li key={n}>{t(`n_${n}` as TKey)}</li>)}
            <li>{t("weatherNote")}</li>
            {input.notes?.trim() && <li>{t("yourNotes", { n: input.notes.trim() })}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
