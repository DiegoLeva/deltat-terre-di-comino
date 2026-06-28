import Logo from "./Logo";

export default function Header() {
  const links = [
    { href: "#calcolatore", label: "Calcolatore ΔT" },
    { href: "#nascita", label: "Alla tua nascita" },
    { href: "#paesc", label: "Dal 2011" },
    { href: "#mappa", label: "Mappa" },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7ede9] bg-paper/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-slate hover:text-brand">
              {l.label}
            </a>
          ))}
          <a href="#calcolatore" className="btn-primary px-4 py-2 text-sm">Inizia</a>
        </nav>
      </div>
    </header>
  );
}
