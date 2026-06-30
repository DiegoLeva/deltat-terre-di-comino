/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Consente l'inclusione del sito in un <iframe> da qualsiasi dominio
  // (necessario per integrarlo nel portale GAL). Per limitarlo a un solo
  // dominio, sostituire * con l'URL del portale, es:
  //   "frame-ancestors 'self' https://www.galverla.eu;"
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};
export default nextConfig;
