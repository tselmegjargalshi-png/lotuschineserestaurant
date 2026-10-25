import { restaurant, categories, items, tagLabels } from "../data/menu.js";
import qrcode from "./vendor/qrcode.mjs";

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const byId = new Map(items.map((i) => [i.id, i]));
const catById = new Map(categories.map((c) => [c.id, c]));
const STORE_KEY = "lotus-order-v1";

const formatPrice = (n) => `${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${restaurant.currency}`;
const escapeHtml = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
// Visible text never shows hyphens or dashes (brand rule); used for photo credits.
const noDash = (s = "") => String(s).replace(/[\u002D\u2010-\u2015\u2212]+/g, " ").replace(/\s{2,}/g, " ");
const icon = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

// Lowercase and fold Mongolian specific letters so "уйгур" also finds "үйгүр" and
// visitors typing without a Mongolian keyboard still get results. Length preserving.
const fold = (s = "") =>
  s.toLowerCase().replace(/ү/g, "у").replace(/ө/g, "о").replace(/ё/g, "е").normalize("NFD").replace(/[̀-ͯ]/g, "");

const PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#102f25"/><g transform="translate(168 118)" fill="none" stroke="#c9a24a" stroke-width="2.4" stroke-linejoin="round" opacity=".8"><path d="M32 10c6 7 9 14 9 21s-4 13-9 15c-5-2-9-8-9-15s3-14 9-21Z"/><path d="M23 33c-5-4-11-5-17-4 1 8 6 15 14 17 4 1 8 0 12 0"/><path d="M41 33c5-4 11-5 17-4-1 8-6 15-14 17-4 1-8 0-12 0"/><path d="M12 50h40"/></g></svg>`
  );

let manifest = {};

function remoteUrl(image, width) {
  if (!image) return null;
  if (image.startsWith("commons:")) {
    const file = image.slice(8).trim().replace(/ /g, "_");
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
  }
  return /^https?:\/\//.test(image) ? image : null;
}

/** Image sources for a dish, in fallback order: processed local file, remote original, placeholder. */
function imageSources(item, size = "full") {
  const local = manifest[item.id]?.[size];
  return [local, remoteUrl(item.image, size === "thumb" ? 480 : 960), PLACEHOLDER].filter(Boolean);
}

function imgTag(item, size, cls, eager = false) {
  const [src, ...rest] = imageSources(item, size);
  return `<img class="${cls}" src="${src}" data-fallback="${escapeHtml(rest.join("|"))}" alt="${escapeHtml(item.name)}" width="${size === "thumb" ? 480 : 960}" height="${size === "thumb" ? 360 : 720}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
}

function setImg(img, item, size) {
  const [src, ...rest] = imageSources(item, size);
  img.dataset.fallback = rest.join("|");
  img.src = src;
  img.alt = item.name;
}

// Global image fallback: try the next source when one fails.
document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.dataset.fallback) return;
    const [next, ...rest] = img.dataset.fallback.split("|");
    img.dataset.fallback = rest.join("|");
    if (next) img.src = next;
  },
  true
);

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $("[data-toast]");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Restaurant info ---------- */
function renderInfo() {
  $$("[data-r]").forEach((el) => (el.textContent = restaurant[el.dataset.r] ?? ""));
  $$("[data-r-phone]").forEach((el) => {
    el.textContent = restaurant.phone;
    el.href = `tel:${restaurant.phoneHref}`;
  });
  $("[data-year]").textContent = new Date().getFullYear();
  const heroItem = items.find((i) => i.featured) || items[0];
  const hero = $("[data-hero-img]");
  hero.addEventListener("load", () => hero.classList.add("is-loaded"), { once: true });
  setImg(hero, heroItem, "full");
  hero.alt = "";
}

/* ---------- Tags ---------- */
const TAG_ICON = { spicy: ["chili", "ico-spicy"], vegetarian: ["leaf", "ico-veg"], chef: ["star", "ico-chef"] };
const tagIcons = (item) =>
  (item.tags || [])
    .filter((t) => TAG_ICON[t])
    .map((t) => `<span title="${tagLabels[t]}">${icon(TAG_ICON[t][0], TAG_ICON[t][1])}<span class="sr-only">${tagLabels[t]}</span></span>`)
    .join("");

/* ---------- Featured ---------- */
function renderFeatured() {
  const rail = $("[data-featured]");
  rail.innerHTML = items
    .filter((i) => i.featured)
    .map(
      (i, idx) => `
      <button class="fcard" type="button" role="listitem" data-open-dish="${i.id}">
        ${imgTag(i, "full", "fcard__img", idx < 2)}
        <span class="fcard__badge">${icon("star")}Онцлох</span>
        <span class="fcard__body">
          <span class="fcard__name">${escapeHtml(i.name)}</span>
          <span class="fcard__row">
            <span class="fcard__cat">${escapeHtml(catById.get(i.category)?.name)}</span>
            <span class="price">${formatPrice(i.price)}</span>
          </span>
        </span>
      </button>`
    )
    .join("");
}

/* ---------- Menu: search + category filter ---------- */
const state = { category: "all", query: "" };
const searchIndex = new Map(
  items.map((i) => [
    i.id,
    fold(
      [i.name, i.nameZh, i.nameEn, i.description, i.portion, catById.get(i.category)?.name, ...(i.tags || []).map((t) => tagLabels[t])].join(" ")
    )
  ])
);

function filterItems() {
  const tokens = fold(state.query).trim().split(/\s+/).filter(Boolean);
  return items.filter((i) => {
    if (state.category !== "all" && i.category !== state.category) return false;
    const hay = searchIndex.get(i.id);
    return tokens.every((t) => hay.includes(t));
  });
}

function highlight(text, query) {
  const tokens = fold(query).trim().split(/\s+/).filter((t) => t.length > 0);
  if (!tokens.length) return escapeHtml(text);
  const folded = fold(text);
  const marks = new Array(text.length).fill(false);
  for (const t of tokens) {
    let from = 0;
    let at;
    while ((at = folded.indexOf(t, from)) !== -1) {
      for (let k = at; k < at + t.length; k++) marks[k] = true;
      from = at + t.length;
    }
  }
  let out = "";
  let open = false;
  [...text].forEach((ch, k) => {
    if (marks[k] && !open) (out += "<mark>"), (open = true);
    if (!marks[k] && open) (out += "</mark>"), (open = false);
    out += escapeHtml(ch);
  });
  return out + (open ? "</mark>" : "");
}

const cardHtml = (i) => `
  <article class="card">
    ${imgTag(i, "thumb", "card__img")}
    <div class="card__body">
      <h4 class="card__name"><button class="card__open" type="button" data-open-dish="${i.id}">${highlight(i.name, state.query)}</button></h4>
      <p class="card__desc">${escapeHtml(i.description)}</p>
      <div class="card__foot">
        <span class="price">${formatPrice(i.price)}</span>
        <span class="card__icons">${tagIcons(i)}</span>
        <button class="card__add" type="button" data-quick-add="${i.id}" aria-label="${escapeHtml(i.name)} захиалгад нэмэх">${icon("plus")}</button>
      </div>
    </div>
  </article>`;

function renderChips() {
  const counts = categories.map((c) => items.filter((i) => i.category === c.id).length);
  $("[data-chips]").innerHTML = [
    `<button class="chip" type="button" role="tab" data-cat="all" aria-selected="true">Бүгд <small>${items.length}</small></button>`,
    ...categories.map(
      (c, k) => `<button class="chip" type="button" role="tab" data-cat="${c.id}" aria-selected="false">${escapeHtml(c.name)} <small>${counts[k]}</small></button>`
    )
  ].join("");
}

function renderMenu() {
  const list = filterItems();
  const menu = $("[data-menu]");
  const grouped = categories
    .map((c) => ({ c, dishes: list.filter((i) => i.category === c.id) }))
    .filter((g) => g.dishes.length);

  menu.innerHTML = grouped
    .map(
      ({ c, dishes }) => `
      <section class="menu__group" aria-label="${escapeHtml(c.name)}">
        <h3 class="menu__group-title">${escapeHtml(c.name)} <small>${dishes.length} хоол</small></h3>
        <div class="menu__grid">${dishes.map(cardHtml).join("")}</div>
      </section>`
    )
    .join("");

  $("[data-empty]").hidden = list.length > 0;
  const catName = state.category === "all" ? "Бүх ангилал" : catById.get(state.category).name;
  $("[data-status]").textContent = state.query
    ? `"${state.query.trim()}" хайлтаар ${list.length} хоол олдлоо · ${catName}`
    : `${catName} · ${list.length} хоол`;

  $$(".chip").forEach((chip) => chip.setAttribute("aria-selected", String(chip.dataset.cat === state.category)));
}

function setCategory(cat, { scroll = true } = {}) {
  state.category = cat;
  renderMenu();
  const chip = $(`.chip[data-cat="${cat}"]`);
  chip?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  if (scroll) scrollToMenuTop();
}

function scrollToMenuTop() {
  const tools = $("#menu-tools");
  const top = $("#menu").getBoundingClientRect().top + window.scrollY + $("#menu .section__head").offsetHeight;
  if (tools.getBoundingClientRect().top <= ($("#topbar").offsetHeight + 1)) window.scrollTo({ top, behavior: "smooth" });
}

function bindMenu() {
  const input = $("#search");
  const clear = $("[data-search-clear]");
  let t;
  input.addEventListener("input", () => {
    clear.hidden = !input.value;
    clearTimeout(t);
    t = setTimeout(() => {
      state.query = input.value;
      renderMenu();
    }, 120);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
  });
  clear.addEventListener("click", () => {
    input.value = "";
    clear.hidden = true;
    state.query = "";
    renderMenu();
    input.focus();
  });
  $("[data-chips]").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) setCategory(chip.dataset.cat);
  });
  $("[data-reset]").addEventListener("click", () => {
    input.value = "";
    clear.hidden = true;
    state.query = "";
    setCategory("all");
  });
  $("[data-nav-search]").addEventListener("click", () => {
    $("#menu").scrollIntoView({ behavior: "smooth" });
    input.focus({ preventScroll: true });
  });
}

/* ---------- Order (cart) ---------- */
const order = new Map();
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  Object.entries(saved.items || {}).forEach(([id, q]) => byId.has(id) && q > 0 && order.set(id, Math.min(99, q)));
} catch {}

function saveOrder() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ items: Object.fromEntries(order) }));
  } catch {}
}

const orderCount = () => [...order.values()].reduce((a, b) => a + b, 0);
const orderSum = () => [...order].reduce((sum, [id, q]) => sum + byId.get(id).price * q, 0);

function addToOrder(id, qty = 1) {
  order.set(id, Math.min(99, (order.get(id) || 0) + qty));
  saveOrder();
  updateOrderUi(true);
  toast(`${byId.get(id).name} захиалгад нэмэгдлээ`);
}

function setQty(id, qty) {
  if (qty <= 0) order.delete(id);
  else order.set(id, Math.min(99, qty));
  saveOrder();
  updateOrderUi();
  renderOrder();
}

function updateOrderUi(bump = false) {
  const count = orderCount();
  $$("[data-order-count]").forEach((el) => {
    el.textContent = count;
    if (el.classList.contains("badge")) {
      el.hidden = count === 0;
      if (bump) {
        el.classList.remove("bump");
        void el.offsetWidth;
        el.classList.add("bump");
      }
    }
  });
  $("[data-order-total]").textContent = formatPrice(orderSum());
  const bar = $("[data-orderbar]");
  const show = count > 0 && !$("#order-dialog").open;
  bar.hidden = !show;
  document.body.classList.toggle("has-order", count > 0);
}

function orderText() {
  const table = $("[data-table]").value.trim();
  const note = $("[data-note]").value.trim();
  const lines = [...order].map(([id, q], k) => {
    const i = byId.get(id);
    return `${k + 1}. ${i.name} × ${q} = ${formatPrice(i.price * q)}`;
  });
  return [
    `${restaurant.name} захиалга`,
    table ? `Ширээ: ${table}` : null,
    "",
    ...lines,
    "",
    `Нийт: ${formatPrice(orderSum())}`,
    note ? `Хүсэлт: ${note}` : null
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function renderOrder() {
  const has = order.size > 0;
  $("[data-order-empty]").hidden = has;
  $("[data-order-content]").hidden = !has;
  if (!has) return;
  $("[data-order-list]").innerHTML = [...order]
    .map(([id, q]) => {
      const i = byId.get(id);
      return `
      <li class="oitem">
        ${imgTag(i, "thumb", "")}
        <div>
          <div class="oitem__name">${escapeHtml(i.name)}</div>
          <div class="oitem__price">${formatPrice(i.price)} × ${q} = ${formatPrice(i.price * q)}</div>
        </div>
        <div class="stepper">
          <button type="button" data-oq="${id}" data-d="-1" aria-label="${escapeHtml(i.name)} хасах">${icon(q === 1 ? "trash" : "minus")}</button>
          <output>${q}</output>
          <button type="button" data-oq="${id}" data-d="1" aria-label="${escapeHtml(i.name)} нэмэх">${icon("plus")}</button>
        </div>
      </li>`;
    })
    .join("");
  $("[data-order-sum]").textContent = formatPrice(orderSum());
  refreshSendLinks();
}

function refreshSendLinks() {
  const text = orderText();
  $("[data-send-sms]").href = `sms:${restaurant.phoneHref}?&body=${encodeURIComponent(text)}`;
  $("[data-send-call]").href = `tel:${restaurant.phoneHref}`;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

function bindOrder() {
  $("[data-order-list]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-oq]");
    if (b) setQty(b.dataset.oq, (order.get(b.dataset.oq) || 0) + Number(b.dataset.d));
  });
  $("[data-table]").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
    refreshSendLinks();
  });
  $("[data-note]").addEventListener("input", refreshSendLinks);
  $("[data-send-copy]").addEventListener("click", async () => {
    toast((await copyText(orderText())) ? "Захиалгын жагсаалт хуулагдлаа" : "Хуулж чадсангүй");
  });
  const share = $("[data-send-share]");
  if (navigator.share) {
    share.hidden = false;
    share.addEventListener("click", () => navigator.share({ title: `${restaurant.name} захиалга`, text: orderText() }).catch(() => {}));
  }
  $("[data-order-clear]").addEventListener("click", () => {
    if (!confirm("Захиалгын жагсаалтыг бүхэлд нь цэвэрлэх үү?")) return;
    order.clear();
    saveOrder();
    updateOrderUi();
    renderOrder();
  });
}

/* ---------- Dialogs with history support (back button closes) ---------- */
function openDialog(dlg, hash) {
  if (dlg.open) return;
  document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  dlg.showModal();
  dlg.scrollTop = 0;
  history.pushState({ dialog: dlg.id }, "", hash);
  updateOrderUi();
}

function closeDialog(dlg) {
  if (!dlg.open) return;
  if (history.state?.dialog === dlg.id) history.back();
  else dlg.close();
}

window.addEventListener("popstate", () => {
  document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  updateOrderUi();
});

function bindDialogs() {
  $$("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg) closeDialog(dlg);
      if (e.target.closest("[data-close]")) {
        const link = e.target.closest("a[href^='#']");
        closeDialog(dlg);
        if (link) {
          e.preventDefault();
          setTimeout(() => $(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" }), 60);
        }
      }
    });
    dlg.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeDialog(dlg);
    });
    dlg.addEventListener("close", () => {
      if (history.state?.dialog === dlg.id) history.replaceState(null, "", location.pathname + location.search);
      updateOrderUi();
    });
  });
}

/* ---------- Dish detail ---------- */
let currentDish = null;
let dishQty = 1;

function updateDishTotal() {
  $("[data-qty]").textContent = dishQty;
  $("[data-add-total]").textContent = formatPrice(currentDish.price * dishQty);
}

function openDish(id) {
  const i = byId.get(id);
  if (!i) return;
  currentDish = i;
  dishQty = 1;
  const dlg = $("#dish-dialog");
  setImg($("[data-dish-img]", dlg), i, "full");
  $("[data-dish-cat]").textContent = catById.get(i.category)?.name || "";
  $("[data-dish-name]").textContent = i.name;
  $("[data-dish-zh]").textContent = i.nameZh || "";
  $("[data-dish-desc]").textContent = i.description;
  $("[data-dish-portion]").textContent = i.portion || "1 порц";
  $("[data-dish-price]").textContent = formatPrice(i.price);
  $("[data-dish-tags]").innerHTML = (i.tags || [])
    .filter((t) => TAG_ICON[t])
    .map((t) => `<span class="tag">${icon(TAG_ICON[t][0], TAG_ICON[t][1])}${tagLabels[t]}</span>`)
    .join("");
  $("[data-dish-credit]").textContent = i.credit ? `Зураг: ${noDash(i.credit)}` : "";
  updateDishTotal();
  openDialog(dlg, `#dish=${i.id}`);
}

function bindDish() {
  document.addEventListener("click", (e) => {
    const quick = e.target.closest("[data-quick-add]");
    if (quick) {
      e.stopPropagation();
      addToOrder(quick.dataset.quickAdd);
      return;
    }
    const opener = e.target.closest("[data-open-dish]");
    if (opener) openDish(opener.dataset.openDish);
    if (e.target.closest("[data-open-order]")) {
      renderOrder();
      openDialog($("#order-dialog"), "#order");
    }
    if (e.target.closest("[data-open-credits]")) openDialog($("#credits-dialog"), "#credits");
  });
  $("[data-qty-minus]").addEventListener("click", () => {
    dishQty = Math.max(1, dishQty - 1);
    updateDishTotal();
  });
  $("[data-qty-plus]").addEventListener("click", () => {
    dishQty = Math.min(20, dishQty + 1);
    updateDishTotal();
  });
  $("[data-add]").addEventListener("click", () => {
    addToOrder(currentDish.id, dishQty);
    closeDialog($("#dish-dialog"));
  });
}

/* ---------- Credits ---------- */
function renderCredits() {
  $("[data-credits]").innerHTML = items
    .filter((i) => i.credit || i.image)
    .map((i) => {
      const src = i.image?.startsWith("commons:")
        ? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(i.image.slice(8).trim().replace(/ /g, "_"))}`
        : null;
      return `<li><b>${escapeHtml(i.name)}</b><br>${escapeHtml(noDash(i.credit) || "Ресторанаас өгсөн зураг")}${src ? ` · <a href="${src}" target="_blank" rel="noopener">Эх файл</a>` : ""}</li>`;
    })
    .join("");
}

/* ---------- QR ---------- */
const LOTUS_PATHS = [
  "M32 10c6 7 9 14 9 21s-4 13-9 15c-5-2-9-8-9-15s3-14 9-21Z",
  "M23 33c-5-4-11-5-17-4 1 8 6 15 14 17 4 1 8 0 12 0",
  "M41 33c5-4 11-5 17-4-1 8-6 15-14 17-4 1-8 0-12 0",
  "M12 50h40"
];

function menuUrl() {
  return `${location.origin}${location.pathname}`;
}

function drawQr(canvas, size) {
  const qr = qrcode(0, "H");
  qr.addData(menuUrl());
  qr.make();
  const n = qr.getModuleCount();
  const margin = 3;
  const cell = size / (n + margin * 2);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f7f1e3";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#0b231c";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.isDark(r, c)) ctx.fillRect(Math.floor((c + margin) * cell), Math.floor((r + margin) * cell), Math.ceil(cell), Math.ceil(cell));

  // Center badge (error correction level H tolerates it)
  const badge = size * 0.2;
  const x = (size - badge) / 2;
  ctx.fillStyle = "#f7f1e3";
  ctx.beginPath();
  ctx.roundRect(x - cell * 0.6, x - cell * 0.6, badge + cell * 1.2, badge + cell * 1.2, badge * 0.28);
  ctx.fill();
  ctx.fillStyle = "#a8202a";
  ctx.beginPath();
  ctx.roundRect(x, x, badge, badge, badge * 0.24);
  ctx.fill();
  ctx.save();
  ctx.translate(x + badge * 0.14, x + badge * 0.1);
  ctx.scale((badge * 0.72) / 64, (badge * 0.72) / 64);
  ctx.strokeStyle = "#e8d39a";
  ctx.lineWidth = 3.4;
  ctx.lineJoin = "round";
  LOTUS_PATHS.forEach((p) => ctx.stroke(new Path2D(p)));
  ctx.restore();
}

function renderQr() {
  const canvas = $("[data-qr]");
  try {
    drawQr(canvas, 640);
  } catch (err) {
    console.error(err);
  }
  $("[data-qr-url]").textContent = menuUrl().replace(/^https?:\/\//, "").replace(/\/$/, "");
  $("[data-qr-download]").addEventListener("click", () => {
    const big = document.createElement("canvas");
    drawQr(big, 1200);
    const a = document.createElement("a");
    a.download = "lotus-menu-qr.png";
    a.href = big.toDataURL("image/png");
    a.click();
    toast("QR код татагдлаа");
  });
  $("[data-copy-link]").addEventListener("click", async () => {
    toast((await copyText(menuUrl())) ? "Холбоос хуулагдлаа" : "Хуулж чадсангүй");
  });
}

/* ---------- Bottom nav active state ---------- */
function bindNav() {
  const links = { home: $('[data-nav="home"]'), menu: $('[data-nav="menu"]') };
  const sections = [
    ["home", $("#home")],
    ["home", $("#featured")],
    ["menu", $("#menu")],
    ["menu", $("#qr")],
    ["menu", $("#info")]
  ];
  const visible = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => visible.set(en.target, en.isIntersecting));
      const active = sections.find(([, el]) => visible.get(el))?.[0] || "home";
      Object.entries(links).forEach(([k, el]) => el.setAttribute("aria-current", String(k === active)));
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(([, el]) => io.observe(el));
}

/* ---------- Deep links ---------- */
function handleInitialHash() {
  const m = location.hash.match(/^#dish=([\w-]+)/);
  if (m && byId.has(m[1])) {
    history.replaceState(null, "", location.pathname);
    openDish(m[1]);
  } else if (location.hash === "#order") {
    history.replaceState(null, "", location.pathname);
    renderOrder();
    openDialog($("#order-dialog"), "#order");
  }
}

/* ---------- Init ---------- */
async function init() {
  try {
    const res = await fetch("images/manifest.json", { cache: "no-cache" });
    if (res.ok) manifest = await res.json();
  } catch {}
  renderInfo();
  renderFeatured();
  renderChips();
  renderMenu();
  renderCredits();
  renderQr();
  bindMenu();
  bindDialogs();
  bindDish();
  bindOrder();
  bindNav();
  updateOrderUi();
  handleInitialHash();
}

init();
