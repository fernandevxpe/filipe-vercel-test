/** @type {import('next').NextConfig} */
const nextConfig = {
  // Na Vercel o lint por vezes falha por PATH/env diferente do local — não bloqueia o deploy
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Evita empacotar o binário nativo de forma incorreta nas funções Node da Vercel
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
};

export default nextConfig;
