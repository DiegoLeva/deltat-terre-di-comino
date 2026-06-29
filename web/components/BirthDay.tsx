"use client";
import { useEffect, useMemo, useState } from "react";
import { MESI_LONG } from "@/lib/types";

type DailyFile = { nome: string; days: Record<string, Record<string, [number, number]>> };

const cache = new Map<string, DailyFile>();
async function loadDaily(slug: string): Promise<DailyFile> {
  if (cache.has(slug)) return cache.get(slug)!;
  const r = await fetch(`/data/daily/${slug}.json`);
  const d = (await r.json()) as DailyFile;
  cache.set(slug, d);
  return d;
}

const COMPARE_YEAR = "2025";

export default function BirthDay({ slug, nome }: { slug: string; nome: string }) {
  const [day, setDay] = useState(15);
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(1980);
  const [file, setFile] = useState<DailyFile | null>(null);

  useEffect(() => { setFile(null); loadDaily(slug).then(setFile); }, [slug]);

  // tutti gli anni realmente disponibili nel file (storici + recenti)
  const years = useMemo(() => {
    if (!file) return [];
    const s = new Set<number>();
    for (const rec of Object.values(file.days)) for (const y of Object.keys(rec)) s.add(Number(y));
    return [...s].sort((a, b) => a - b);
  }, [file]);

  // se l'anno scelto non è disponibile, ripiega sul primo disponibile
  useEffect(() => {
    if (years.length && !years.includes(year)) setYear(years[0]);
  }, [years]); // eslint-disable-line react-hooks/exhaustive-deps

  const mmdd = `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const res = useMemo(() => {
    if (!file) return null;
    const rec = file.days[mmdd];
    if (!rec) return null;
    const born = rec[String(year)];
    const now = rec[COMPARE_YEAR];
    return { born, now };
  }, [file, mmdd, year]);

  const maxDay = [31, year % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];

  return (
    <div className="card p-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* controlli */}
        <div>
          <p className="mb-3 text-sm text-slate">Inserisci la tua data di nascita a <b className="text-ink">{nome}</b>:</p>
          <div className="flex gap-2">
            <select value={day} onChange={(e) => setDay(Number(e.target.value))}
              className="input w-20 px-2 py-2 text-sm">
              {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
              className="input flex-1 px-2 py-2 text-sm capitalize">
              {MESI_LONG.map((mm, i) => <option key={mm} value={i + 1} className="capitalize">{mm}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="input w-24 px-2 py-2 text-sm">
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <p className="mt-3 text-xs text-slate">
            {years.length
              ? `Anni disponibili: dal ${years[0]} al ${years[years.length - 1]}.`
              : "Carico gli anni disponibili…"}
          </p>
        </div>

        {/* risultato */}
        <div>
          {!file && <p className="text-sm text-slate">Carico i dati di {nome}…</p>}
          {file && !res?.born && (
            <p className="text-sm text-slate">Per quel giorno non ci sono dati. Prova un'altra data.</p>
          )}
          {file && res?.born && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <DayCard title={`${day} ${MESI_LONG[month - 1]} ${year}`} subtitle="il giorno in cui sei nato/a"
                  tmin={res.born[0]} tmax={res.born[1]} tone="cool" />
                <DayCard title={`${day} ${MESI_LONG[month - 1]} ${COMPARE_YEAR}`} subtitle="lo stesso giorno, oggi"
                  tmin={res.now?.[0]} tmax={res.now?.[1]} tone="warm" />
              </div>
              {res.now && (
                <p className="mt-4 text-base leading-relaxed text-ink/85">
                  Lo stesso giorno dell'anno, a {nome}, la temperatura massima è passata da{" "}
                  <b>{res.born[1]}°C</b> del {year} a <b style={{ color: "#E4572E" }}>{res.now[1]}°C</b> nel{" "}
                  {COMPARE_YEAR}:{" "}
                  <b style={{ color: "#E4572E" }}>
                    {res.now[1] - res.born[1] >= 0 ? "+" : ""}{(res.now[1] - res.born[1]).toFixed(1)}°C
                  </b>. La notte è passata da {res.born[0]}°C a {res.now[0]}°C.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DayCard({ title, subtitle, tmin, tmax, tone }: {
  title: string; subtitle: string; tmin?: number; tmax?: number; tone: "cool" | "warm";
}) {
  const col = tone === "warm" ? "#E4572E" : "#2E7D43";
  return (
    <div className="rounded-2xl border border-[#e6e9df] bg-cloud/40 p-5">
      <p className="font-display text-sm font-bold capitalize text-ink">{title}</p>
      <p className="text-xs text-slate">{subtitle}</p>
      <div className="mt-3 flex items-end gap-5">
        <div>
          <p className="text-[11px] text-slate">minima</p>
          <p className="font-display text-2xl font-extrabold text-slate">{tmin ?? "—"}°</p>
        </div>
        <div>
          <p className="text-[11px] text-slate">massima</p>
          <p className="font-display text-3xl font-extrabold" style={{ color: col }}>{tmax ?? "—"}°</p>
        </div>
      </div>
    </div>
  );
}
