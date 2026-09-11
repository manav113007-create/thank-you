/* ============================================================
   main.js — global behavior shared by all three pages
   - sound toggle (never autoplays)
   - cursor-follow glow (desktop / fine pointer only)
   - magnetic + ripple button feedback
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------------- Sound control ---------------- */
function initSound() {
  const btn = document.querySelector("[data-sound-toggle]");
  const audio = document.querySelector("[data-bgm]");
  if (!btn) return;

  // Music starts ON
  let playing = true;

  const setIcon = () => {
    btn.textContent = playing ? "🎵" : "🔇";
    btn.setAttribute(
      "aria-label",
      playing ? "Turn music off" : "Turn music on"
    );
  };

  setIcon();

  btn.addEventListener("click", async () => {
    if (!audio) {
      playing = !playing;
      setIcon();
      return;
    }

    if (playing) {
      // Stop music
      audio.pause();
      playing = false;
      setIcon();
      return;
    }

    // Start music again
    try {
      await audio.play();
      playing = true;
      setIcon();
    } catch (err) {
      console.warn("Audio unavailable:", err);
      playing = false;
      setIcon();
    }
  });
}

/* ---------------- Cursor glow (desktop only) ---------------- */
function initCursorGlow() {
  if (!hasFinePointer || prefersReducedMotion) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let raf = null;
  window.addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.setProperty("--x", `${e.clientX}px`);
      glow.style.setProperty("--y", `${e.clientY}px`);
      glow.classList.add("is-active");
      raf = null;
    });
  });

  window.addEventListener("pointerleave", () => glow.classList.remove("is-active"));
}

/* ---------------- Magnetic buttons (desktop only) ---------------- */
function initMagneticButtons() {
  if (!hasFinePointer || prefersReducedMotion) return;

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ---------------- Tap ripple (mobile + desktop click) ---------------- */
function initRipple() {
  document.querySelectorAll("[data-ripple]").forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.25);
        transform:scale(0); opacity:1;
        transition: transform 0.5s ease-out, opacity 0.6s ease-out;
      `;
      btn.style.position = getComputedStyle(btn).position === "static" ? "relative" : btn.style.position;
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = "scale(1)";
        ripple.style.opacity = "0";
      });
      setTimeout(() => ripple.remove(), 650);
    });
  });
}

function initLevelUpCard() {
  const card = document.querySelector("[data-levelup-card]");
  const text = document.querySelector("[data-levelup-text]");
  if (!card || !text) return;

  const achievements = [
    "+1 Wisdom (allegedly)",
    "New skill unlocked: Adulting (Omega)",
    "Achievement: Survived another lap around the sun ☀️",
    "Stat boost: Patience +2, Naps −1",
    "Perk unlocked: Free hugs, redeemable anytime",
    "XP gained: enough to level up, not enough to feel old",
    "New title earned: Certified One Year Wiser",
    "Skill tree updated: Overthinking → Slightly Less Overthinking",
    "Inventory: 1× birthday, well used",
    "Enough capable to handle tantrums, and problems"
  ];

  let last = -1;
  card.addEventListener("click", () => {
    let i;
    do {
      i = Math.floor(Math.random() * achievements.length);
    } while (i === last && achievements.length > 1);
    last = i;

    text.style.opacity = "0";
    setTimeout(() => {
      text.textContent = achievements[i];
      text.style.opacity = "1";
    }, 150);

    card.classList.remove("level-card--pop");
    void card.offsetWidth;
    card.classList.add("level-card--pop");

    window.BirthdayAnim?.confettiBurst(14);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSound();
  initCursorGlow();
  initMagneticButtons();
  initRipple();
  initLevelUpCard();
});