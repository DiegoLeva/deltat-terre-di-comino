import { NextRequest, NextResponse } from "next/server";
import { getComune, COMUNI_NAMES } from "@/lib/data";
import { computeDelta } from "@/lib/impacts";

/**
 * GET /api/delta?comune=Cassino&baseline=1990
 * Restituisce l'aumento di temperatura dal `baseline` a oggi per il comune,
 * con la traduzione in impatti quotidiani.
 *
 * I dati derivano da Copernicus Climate Change Service (ERA5), pre-elaborati
 * dalla pipeline Python (l'API CDS è asincrona e non interrogabile in tempo reale
 * dal browser: i dati vengono scaricati offline e serviti qui istantaneamente).
 */
export function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const nome = sp.get("comune") ?? "Cassino";
  const baseline = Number(sp.get("baseline") ?? "1990");

  if (!COMUNI_NAMES.includes(nome)) {
    return NextResponse.json(
      { error: `Comune non valido. Disponibili: ${COMUNI_NAMES.length} comuni.` },
      { status: 400 }
    );
  }

  const comune = getComune(nome);
  const res = computeDelta(comune, baseline);

  return NextResponse.json({
    source: "Copernicus Climate Change Service (ERA5) — pre-processed",
    comune: comune.nome,
    quota_m: comune.quota_m,
    baselineYear: res.baselineYear,
    todayYear: res.todayYear,
    deltaT_c: res.deltaT,
    tBaseline_c: res.tBaseline,
    tToday_c: res.tToday,
    tropicalNightsDelta: res.tropicalNightsDelta,
    impacts: res.impacts,
  });
}
