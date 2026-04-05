/**
 * URLs de figuras: em `next build` os PNG são copiados para `public/data/assets` e servidos como ficheiros estáticos.
 * Em `next dev` usa-se `/api/asset` para ler diretamente de `data/assets` sem cópia.
 * Usa-se NODE_ENV (sempre definido no bundle de produção) em vez de VERCEL_ENV, que por vezes não chega ao cliente no build.
 */
export function getAssetSrc(ref: string): string {
  const normalized = ref.replace(/^\/+/, "");
  if (normalized.startsWith("data/assets/") && process.env.NODE_ENV === "production") {
    return `/${normalized}`;
  }
  return `/api/asset?path=${encodeURIComponent(ref)}`;
}
