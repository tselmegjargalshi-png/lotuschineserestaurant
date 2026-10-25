// Checks that no visible menu text contains a hyphen or dash character.
// Run: npm run check
import { restaurant, categories, items, tagLabels } from "../data/menu.js";

const DASH = /[-‐‑‒–—―−]/;
const problems = [];
const check = (where, value) => {
  if (typeof value === "string" && DASH.test(value)) problems.push(`${where}: "${value}"`);
};

for (const key of ["name", "tagline", "intro", "address", "hours", "phone"]) check(`restaurant.${key}`, restaurant[key]);
categories.forEach((c) => check(`category ${c.id}`, c.name));
Object.entries(tagLabels).forEach(([k, v]) => check(`tag ${k}`, v));
items.forEach((i) => {
  for (const key of ["name", "nameZh", "portion", "description"]) check(`${i.id}.${key}`, i[key]);
});

const ids = new Set();
items.forEach((i) => {
  if (ids.has(i.id)) problems.push(`Давхардсан id: ${i.id}`);
  ids.add(i.id);
  if (!categories.some((c) => c.id === i.category)) problems.push(`${i.id}: ангилал олдсонгүй (${i.category})`);
  if (!Number.isFinite(i.price) || i.price <= 0) problems.push(`${i.id}: үнэ буруу`);
});

if (problems.length) {
  console.error("Алдаа:\n" + problems.join("\n"));
  process.exit(1);
}
console.log(`OK: ${items.length} хоол, ${categories.length} ангилал, зураас ашиглаагүй.`);
