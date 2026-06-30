"use client";
import { useState } from "react";
import type { Comune } from "@/lib/types";

const W = 1080, H = 1350;

async function draw(c: Comune): Promise<HTMLCanvasElement> {
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const x = cv.getContext("2d")!;
  try { await (document as any).fonts?.ready; } catch {}

  // sfondo crema
  x.fillStyle = "#F5EFDC"; x.fillRect(0, 0, W, H);
  // header verde
  x.fillStyle = "#2E7D43"; x.fillRect(0, 0, W, 250);

  // logo
  await new Promise<void>((res) => {
    const img = new Image();
    img.onload = () => { const h = 150, w = img.width * (h / img.height); x.drawImage(img, 60, 50, w, h); res(); };
    img.onerror = () => res();
    img.src = "/brand/logo.png";
  });
  x.fillStyle = "#ffffff";
  x.font = "600 34px Poppins, sans-serif";
  x.fillText("Clima Terre di Comino", 280, 130);
  x.font = "400 24px Inter, sans-serif";
  x.fillText("Osservatorio temperature · PAESC", 280, 170);

  // titolo comune
  x.fillStyle = "#1C2B20";
  x.font = "800 92px Poppins, sans-serif";
  x.fillText(c.nome, 60, 400);
  x.fillStyle = "#5E6E62";
  x.font = "500 36px Poppins, sans-serif";
  x.fillText("Quanto fa più caldo, anno dopo anno", 60, 460);

  // notti afose progression
  const steps = [
    { l: "2011", v: c.tn_2011, col: "#EAC23B" },
    { l: "oggi", v: c.tn_today, col: "#EE9B3A" },
    { l: "2050", v: c.proj_2050.tropical_nights, col: "#C81D25" },
  ];
  const maxV = Math.max(...steps.map((s) => s.v), 10);
  x.fillStyle = "#1C2B20";
  x.font = "700 40px Poppins, sans-serif";
  x.fillText("Notti afose all'anno", 60, 600);
  x.font = "400 28px Inter, sans-serif";
  x.fillStyle = "#5E6E62";
  x.fillText("(notti oltre 20°C, in cui si dorme male)", 60, 642);

  const baseY = 720, barW = 260, gap = 60, barMaxH = 360;
  steps.forEach((s, i) => {
    const bx = 90 + i * (barW + gap);
    const h = Math.max(8, (s.v / maxV) * barMaxH);
    x.fillStyle = s.col;
    x.fillRect(bx, baseY + (barMaxH - h), barW, h);
    x.fillStyle = "#1C2B20";
    x.font = "800 64px Poppins, sans-serif";
    x.textAlign = "center";
    x.fillText(String(s.v), bx + barW / 2, baseY + (barMaxH - h) - 24);
    x.fillStyle = "#5E6E62";
    x.font = "600 34px Poppins, sans-serif";
    x.fillText(s.l, bx + barW / 2, baseY + barMaxH + 56);
    x.textAlign = "left";
  });

  // riga +gradi 2050
  x.fillStyle = "#C81D25";
  x.font = "800 50px Poppins, sans-serif";
  x.fillText(`+${c.proj_2050.delta_today.toFixed(1)}°C entro il 2050`, 60, 1235);
  x.fillStyle = "#5E6E62";
  x.font = "400 28px Inter, sans-serif";
  x.fillText("se il riscaldamento continua così", 60, 1278);

  // footer url
  x.fillStyle = "#2E7D43";
  x.font = "700 30px Poppins, sans-serif";
  x.textAlign = "right";
  x.fillText("clima-galverla.vercel.app", W - 60, 1300);
  x.textAlign = "left";
  return cv;
}

export default function ShareCard({ comune }: { comune: Comune }) {
  const [busy, setBusy] = useState(false);

  const make = (): Promise<Blob> =>
    draw(comune).then((cv) => new Promise<Blob>((res) => cv.toBlob((b) => res(b!), "image/png")));

  const download = async () => {
    setBusy(true);
    try {
      const blob = await make();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `clima-${comune.slug}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  };

  const share = async () => {
    setBusy(true);
    try {
      const blob = await make();
      const file = new File([blob], `clima-${comune.slug}.png`, { type: "image/png" });
      const nav = navigator as any;
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: `Clima a ${comune.nome}`,
          text: `Guarda quanto fa più caldo a ${comune.nome}: clima-galverla.vercel.app` });
      } else { await download(); }
    } catch { /* annullato */ } finally { setBusy(false); }
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Condividi il clima di {comune.nome}</h3>
          <p className="mt-1 text-sm text-slate">
            Crea un'immagine pronta per i social e fai girare il dato del tuo paese.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={share} disabled={busy} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
            {busy ? "Genero…" : "📲 Condividi"}
          </button>
          <button onClick={download} disabled={busy}
            className="rounded-full border border-[#cdd6c8] px-5 py-3 text-sm font-semibold text-brand hover:bg-mint/50 disabled:opacity-60">
            ⬇ Scarica
          </button>
        </div>
      </div>
    </div>
  );
}
