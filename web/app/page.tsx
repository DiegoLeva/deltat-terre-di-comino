import Header from "@/components/Header";
import FactsTicker from "@/components/FactsTicker";
import Hero from "@/components/Hero";
import ClimateApp from "@/components/ClimateApp";
import PaescReport from "@/components/PaescReport";
import Footer from "@/components/Footer";
import EmbedResizer from "@/components/EmbedResizer";

/**
 * Modalità "embed": aggiungendo ?embed=1 all'URL vengono nascosti intestazione,
 * ticker, hero e footer, lasciando solo i contenuti interattivi. Pensata per
 * l'inclusione del sito dentro un altro portale tramite <iframe>.
 */
export default function Page({ searchParams }: { searchParams?: { embed?: string } }) {
  const embed = searchParams?.embed === "1" || searchParams?.embed === "true";

  if (embed) {
    return (
      <main className="py-2">
        <EmbedResizer />
        <ClimateApp />
        <PaescReport />
      </main>
    );
  }

  return (
    <>
      <Header />
      <FactsTicker />
      <Hero />
      <ClimateApp />
      <PaescReport />
      <Footer />
    </>
  );
}
