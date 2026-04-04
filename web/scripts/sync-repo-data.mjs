#!/usr/bin/env node
/**
 * Copia `../data` (monorepo) → `web/data/` para deploy com raiz `web/` na Vercel.
 * Idempotente: não apaga `web/data/*.sqlite`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, "..");
const repoData = path.join(webRoot, "..", "data");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

if (!fs.existsSync(repoData)) {
  console.warn("sync-repo-data: ../data não encontrado — assume dados já em web/data (CI só web?).");
  process.exit(0);
}

copyDir(path.join(repoData, "processed"), path.join(webRoot, "data", "processed"));
copyDir(path.join(repoData, "assets"), path.join(webRoot, "data", "assets"));

const jsonFiles = [
  "plano_estudo.json",
  "diagnostic_config.json",
  "daily_mix_config.json",
  "curadoria_videos.json",
  "guia_dia_links.json",
];
const destData = path.join(webRoot, "data");
fs.mkdirSync(destData, { recursive: true });
for (const f of jsonFiles) {
  const s = path.join(repoData, f);
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, path.join(destData, f));
  }
}

console.log("sync-repo-data: OK → web/data (processed, assets, JSONs)");
