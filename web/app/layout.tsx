import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clima Terre di Comino — Quanto è cresciuta la temperatura?",
  description:
    "Osservatorio climatico del distretto Terre di Comino (32 comuni, GAL Versante Laziale del PNA). " +
    "Scopri di quanto è aumentata la temperatura dal tuo anno di nascita o dalla baseline PAESC 2011, " +
    "e cosa significa nella vita di tutti i giorni. Dati Copernicus C3S / ERA5.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
