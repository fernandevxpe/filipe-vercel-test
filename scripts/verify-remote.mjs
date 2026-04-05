#!/usr/bin/env node
/**
 * Smoke test do site já deployado (Vercel ou outro).
 *
 * Uso local:
 *   SITE_URL=https://teu-projeto.vercel.app node scripts/verify-remote.mjs
 *
 * URL do botão «Visit» (…-hash-…-projects.vercel.app) muda por deploy; o domínio
 * de produção (ex.: projeto-tau.vercel.app) deve ser estável quando estiver bem ligado.
 *
 * CI: secret PRODUCTION_SITE_URL. Se a Vercel devolver 401, desativa Deployment Protection
 * ou usa bypass token para automação (documentação Vercel).
 */
const baseRaw = process.env.SITE_URL || process.argv[2];
if (!baseRaw?.trim()) {
  console.error(
    "Defina SITE_URL ou passe a URL como argumento.\n" +
      "  Ex.: SITE_URL=https://filipe-estudo-xxx.vercel.app node scripts/verify-remote.mjs"
  );
  process.exit(2);
}
const base = baseRaw.replace(/\/$/, "");

async function get(path) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: "follow" });
  const text = await res.text();
  return { url, res, text };
}

async function main() {
  const home = await get("/");
  console.log(`home: ${home.res.status} ${home.url}`);
  if (!home.res.ok) {
    if (home.res.status === 401) {
      console.error(
        "401 — Deployment Protection ativo: só responde com sessão Vercel.\n" +
          "Site público: Vercel → Project → Settings → Deployment Protection → desativar (Production e/ou Preview).\n" +
          "O smoke test em CI falha com 401 até lá."
      );
    } else if (home.res.status === 404) {
      console.error(
        "404 NOT_FOUND — domínio sem deployment associado. Usa o URL exacto do botão «Visit» no deploy Ready."
      );
    } else {
      console.error(`Home devolveu HTTP ${home.res.status} — verifica URL e configuração na Vercel.`);
    }
    process.exit(1);
  }
  if (!home.text.includes("Filipe") && !home.text.includes("Painel")) {
    console.error("HTML da home não parece ser a app Filipe (conteúdo inesperado).");
    process.exit(1);
  }

  const testPage = await get("/test");
  console.log(`test: ${testPage.res.status} ${testPage.url}`);
  if (!testPage.res.ok) process.exit(1);
  if (!testPage.text.includes("Hello world")) {
    console.error("/test devia conter «Hello world».");
    process.exit(1);
  }

  const dc = await get("/api/deploy-check");
  console.log(`deploy-check: ${dc.res.status} ${dc.url}`);
  if (!dc.res.ok) process.exit(1);
  let j;
  try {
    j = JSON.parse(dc.text);
  } catch {
    console.error("/api/deploy-check não devolveu JSON.");
    process.exit(1);
  }
  if (typeof j.deployMark !== "string") {
    console.error("JSON sem deployMark:", j);
    process.exit(1);
  }
  const sha = j.vercelGitCommitSha || "(vazio — normal fora da Vercel)";
  console.log(`OK — deployMark=${j.deployMark} commit=${sha}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
