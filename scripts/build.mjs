// Builds the static site into dist/.
// 1. Copies the site files.
// 2. Downloads or reads every dish photo listed in data/menu.js and converts it
//    to one uniform 960x720 WebP (4:3, smart crop), plus a 480x360 thumbnail.
// 3. Writes dist/images/manifest.json so the browser knows which local files exist.
// A photo that cannot be fetched never breaks the build: the site falls back to
// the remote image for that dish.

import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { items } from "../data/menu.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const cacheDir = path.join(root, "node_modules", ".cache", "lotus-images");

const SIZE = { w: 960, h: 720 };
const THUMB = { w: 480, h: 360 };
const USER_AGENT = "LotusMenuBuild/1.0 (https://github.com/tselmegjargalshi-png/lotuschineserestaurant)";

export function remoteUrl(image, width = 1280) {
  if (!image) return null;
  if (image.startsWith("commons:")) {
    const file = image.slice("commons:".length).trim().replace(/ /g, "_");
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
  }
  if (/^https?:\/\//.test(image)) return image;
  return null;
}

async function fetchWithRetry(url, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.fatal = true;
        throw err;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastErr = err;
      if (err.fatal) break;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw lastErr;
}

async function loadSource(item) {
  const image = (item.image || "").trim();
  if (!image) return null;
  const remote = remoteUrl(image);
  if (!remote) {
    const local = path.join(root, image);
    return existsSync(local) ? readFile(local) : null;
  }
  const cacheFile = path.join(cacheDir, Buffer.from(image).toString("base64url").slice(0, 120));
  if (existsSync(cacheFile)) return readFile(cacheFile);
  const buf = await fetchWithRetry(remote);
  await mkdir(cacheDir, { recursive: true });
  await writeFile(cacheFile, buf);
  return buf;
}

async function processImage(buf, outFile, { w, h }, quality) {
  await sharp(buf)
    .rotate()
    .resize(w, h, { fit: "cover", position: sharp.strategy.attention })
    .modulate({ saturation: 1.04 })
    .webp({ quality, effort: 5 })
    .toFile(outFile);
}

async function main() {
  await rm(dist, { recursive: true, force: true });
  await mkdir(path.join(dist, "images"), { recursive: true });

  for (const entry of ["index.html", "css", "js", "data", "favicon.svg", "robots.txt"]) {
    const from = path.join(root, entry);
    if (existsSync(from)) await cp(from, path.join(dist, entry), { recursive: true });
  }
  await mkdir(path.join(dist, "js", "vendor"), { recursive: true });
  await cp(
    path.join(root, "node_modules", "qrcode-generator", "dist", "qrcode.mjs"),
    path.join(dist, "js", "vendor", "qrcode.mjs")
  );

  const manifest = {};
  let ok = 0;
  const failed = [];
  const queue = [...items];
  const workers = Array.from({ length: 2 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      try {
        const buf = await loadSource(item);
        if (!buf) {
          failed.push(`${item.id} (зураг заагаагүй)`);
          continue;
        }
        const full = `images/${item.id}.webp`;
        const thumb = `images/${item.id}-sm.webp`;
        await processImage(buf, path.join(dist, full), SIZE, 80);
        await processImage(buf, path.join(dist, thumb), THUMB, 74);
        manifest[item.id] = { full, thumb };
        ok++;
      } catch (err) {
        failed.push(`${item.id} (${err.message})`);
      }
    }
  });
  await Promise.all(workers);

  await writeFile(path.join(dist, "images", "manifest.json"), JSON.stringify(manifest, null, 2));

  let bytes = 0;
  for (const { full, thumb } of Object.values(manifest)) {
    bytes += (await stat(path.join(dist, full))).size + (await stat(path.join(dist, thumb))).size;
  }
  console.log(`Images: ${ok}/${items.length} processed to ${SIZE.w}x${SIZE.h} WebP (${(bytes / 1024).toFixed(0)} KB total)`);
  if (failed.length) console.warn(`Remote fallback used for: ${failed.join(", ")}`);
  console.log("Build complete: dist/");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
