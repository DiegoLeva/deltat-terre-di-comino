import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ΔT // Terre di Comino — Climate Telemetry",
  description:
    "Telemetria climatica del distretto Terre di Comino Smart Land. ΔT vissuto, impatti quotidiani, obiettivi PAESC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={mono.variable}>
      <body className="min-h-screen antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
