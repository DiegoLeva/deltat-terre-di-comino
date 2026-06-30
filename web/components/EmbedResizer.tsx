"use client";
import { useEffect } from "react";

/**
 * In modalità embed comunica l'altezza del contenuto alla pagina che ospita
 * l'iframe, così questa può adattarne l'altezza (vedi esempio-embed.html).
 */
export default function EmbedResizer() {
  useEffect(() => {
    const send = () => {
      const h = document.documentElement.scrollHeight;
      window.parent?.postMessage({ type: "clima-embed-height", height: h }, "*");
    };
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    window.addEventListener("load", send);
    const t = setInterval(send, 1000); // fallback per contenuti caricati in ritardo (mappa, ecc.)
    return () => { ro.disconnect(); window.removeEventListener("load", send); clearInterval(t); };
  }, []);
  return null;
}
