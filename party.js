/* ============================================================
   party.js — food counters, photo interactions, QR reveal,
   and a small rule-based "BirthdayBot" (no external AI API —
   keeps the page dependency-free and always functional).
   ============================================================ */

const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

/* ---------------- Food counters ---------------- */
const COUNTS = { pizza: 3, cake: 2, drinks: 4 };
let cakeTaps = 0;

const BOT_LINES = [
  "That's one for the log. 🍰",
  "Second slice already? Respect.",
  "Okay now you're just testing me.",
  "Bro.",
  "That's your fifth slice. There is math involved.",
  "At this point it's a lifestyle.",
  "Please leave some cake for the rest of us. 💀",
];

function initFoodCounters() {
  const buttons = document.querySelectorAll("[data-food]");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.food;
      const countEl = document.querySelector(`[data-count="${key}"]`);

      if (key in COUNTS) {
        COUNTS[key] += 1;
        if (countEl) countEl.textContent = String(COUNTS[key]).padStart(2, "0");
      }

      showPop(btn, key);

      if (key === "cake") {
        cakeTaps += 1;
        maybeShowBot();
      }

      if (key === "cake" || key === "pizza") {
        window.BirthdayAnim?.confettiBurst(14);
      }
    });
  });
}

function showPop(btn, key) {
  const label = { pizza: "+1 Pizza", cake: "Cake acquired 🎂", drinks: "+1 Drink" }[key] || "+1";
  const pop = document.createElement("span");
  pop.className = "food-pop pop";
  pop.textContent = label;
  btn.style.position = "relative";
  btn.appendChild(pop);
  setTimeout(() => pop.remove(), 950);
}

function maybeShowBot() {
  const botEl = document.querySelector("[data-birthdaybot]");
  if (!botEl) return;
  const line = BOT_LINES[Math.min(cakeTaps - 1, BOT_LINES.length - 1)];
  if (cakeTaps < 3) return; // only chime in once things get a little excessive
  botEl.textContent = `🤖 BirthdayBot: ${line}`;
  botEl.classList.remove("opacity-0");
  botEl.classList.add("opacity-100");
}

/* ---------------- Photo interactions ---------------- */
function initPhotoCards() {
  const cards = document.querySelectorAll(".photo-card");
  cards.forEach((card, i) => {
    card.style.setProperty("--tilt", `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg`);

    card.addEventListener("click", () => {
      if (isTouch) {
        card.classList.toggle("is-expanded");
      } else {
        openLightbox(card.querySelector("img")?.src, card.querySelector("img")?.alt);
      }
    });
  });
}

function openLightbox(src, alt) {
  if (!src) return;
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80";
  overlay.innerHTML = `<img src="${src}" alt="${alt || ""}" class="max-h-[85vh] max-w-full rounded-2xl shadow-2xl" />`;
  overlay.addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
}

/* ---------------- QR reveal ---------------- */
function initQrReveal() {
  const btn = document.querySelector("[data-reveal-gift]");
  const wrap = document.querySelector(".qr-wrap");
  if (!btn || !wrap) return;

  btn.addEventListener("click", () => {
    wrap.classList.add("is-revealed");
    btn.setAttribute("disabled", "true");
    btn.classList.add("opacity-0", "pointer-events-none");
    window.BirthdayAnim?.confettiBurst(20);
  }, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initFoodCounters();
  initPhotoCards();
  initQrReveal();
});
