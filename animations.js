/* ============================================================
   animations.js — entrance sequences, scroll reveals, confetti
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Entrance sequence (runs once on load) ----------------
   Elements are revealed in DOM order using each one's [data-delay]
   (in ms). Kept short on purpose — see brief's 0 / 0.2 / 0.5 / 0.8 / 1.1s
   timing for the homepage. */
function runEntranceSequence() {
  const items = document.querySelectorAll("[data-entrance]");
  items.forEach((el) => {
    const delay = reducedMotion ? 0 : Number(el.dataset.delay || 0);
    setTimeout(() => el.classList.add("is-visible"), delay);
  });
}

//star animation on body 
function initStarAnimation() {
  const starContainer = document.createElement("div");
  starContainer.className = "star-container";
  document.body.appendChild(starContainer);

  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    starContainer.appendChild(star);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initStarAnimation();
});

/* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
function initScrollReveal(selector = ".reveal", options = {}) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  if (reducedMotion) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -10% 0px", ...options }
  );

  els.forEach((el) => io.observe(el));
}

/* ---------------- Confetti (lightweight DOM burst, not canvas) ----------------
   Small, finite burst. Never runs continuously — only called on
   specific interaction moments (entering party, tapping cake, etc). */
function confettiBurst(count = 26) {
  if (reducedMotion) return;

  const colors = ["#e3c16f", "#f2a6c4", "#5eead4", "#ffffff"];
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const size = 6 + Math.random() * 6;
    const left = Math.random() * 100;
    const duration = 2.2 + Math.random() * 1.4;
    const delay = Math.random() * 0.3;
    const spin = 300 + Math.random() * 400;

    piece.className = "confetti-piece";
    piece.style.cssText = `
      left:${left}vw;
      width:${size}px;
      height:${size * 0.4}px;
      background:${colors[i % colors.length]};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
    `;
    piece.style.setProperty("--spin", `${spin}deg`);
    frag.appendChild(piece);

    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
  }

  document.body.appendChild(frag);
}

/* ---------------- Thank-you card scroll experience ----------------
   Lines fade/rise in as they cross into view, giving the sense of a
   card being opened and read rather than a page being scrolled. */
function initCardScroll() {
  initScrollReveal(".card-line", { threshold: 0.5 });
}

document.addEventListener("DOMContentLoaded", () => {
  initStarAnimation();
  runEntranceSequence();
  initScrollReveal();
  initCardScroll();
});

// Expose what other modules (party.js) need.
window.BirthdayAnim = { confettiBurst };
