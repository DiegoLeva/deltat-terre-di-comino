const FACTS = [
  { s: "Copernicus C3S", t: "Il 2024 è stato l'anno più caldo mai registrato: +1,60°C sul livello preindustriale." },
  { s: "MedECC 2020", t: "Il Mediterraneo si scalda ~20% più velocemente della media globale." },
  { s: "ISPRA", t: "In molte aree d'Italia fino a 50 notti tropicali in più rispetto alla norma." },
  { s: "Copernicus C3S", t: "Le notti tropicali nel Centro Italia sono raddoppiate rispetto agli anni '80." },
  { s: "MedECC", t: "Disponibilità idrica nel Mediterraneo: fino a −30% entro fine secolo." },
];

export default function FactsTicker() {
  const stream = [...FACTS, ...FACTS];
  return (
    <div className="border-y border-[#e7ede9] bg-brand text-paper">
      <div className="flex overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap py-2.5">
          {stream.map((f, i) => (
            <span key={i} className="text-sm">
              <b className="mr-2 text-accent">{f.s}</b>{f.t}<span className="ml-3 text-accent">◇</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
