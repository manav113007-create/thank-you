# One More Year 🎂

A small, interactive birthday thank-you site — a homepage, a scroll-driven thank-you card, and a virtual party page with a gift QR reveal at the end. Built with plain HTML/CSS/Tailwind (CDN) and vanilla JS — no build step, no framework.

## Run it locally

No build tools needed. Any static server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`. (Opening `index.html` directly by double-clicking mostly works too, but a local server avoids `audio`/asset quirks in some browsers.)

## What to personalize before sharing

**1. Your name / headline** — in `index.html`, search for `MANAV` and swap in your own name and the "leveling up" line.

**2. Photos** — drop your own images into `assets/images/` and update the six `<img src="assets/images/placeholder-N.svg">` tags in `party.html` to point at your files (e.g. `photo1.jpg`). Keep images compressed (WebP if you can — TinyPNG or Squoosh work well) so the party page loads fast over mobile data.

**3. Thank-you message** — the paragraphs inside `.card-panel` in `thankyou.html` are plain `<p class="card-line">` tags. Edit the wording, add or remove lines freely; the scroll-reveal picks up any `.card-line` automatically.

**4. Music (optional)** — add an MP3 to `assets/music/theme.mp3` (same filename, or update the three `<audio data-bgm src="...">` tags). Music never autoplays; it only starts when someone taps the sound button, and the button still works fine if no file is present.

**5. Gift QR code** — replace `assets/qr/qr-placeholder.svg` with your real QR code image (PNG/SVG, same filename, or update the `src` in `party.html`). Generate the actual QR from whatever payment link you want (UPI, PayPal.me, Venmo, etc.) using any QR generator — nothing here talks to a payment provider directly, so there's no key or credential to manage.

**6. Colors** — the palette lives at the top of `css/style.css` under `:root` (`--gold`, `--pink`, `--cyan`, `--bg`) and is mirrored in each page's inline `tailwind.config`.

## Deploying so WhatsApp can open it

Any static host works. Two easy free options:

- **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the whole `birthday-website` folder in. You get a live HTTPS link instantly.
- **GitHub Pages** — push this folder to a repo, then enable Pages on the `main` branch in repo Settings → Pages.

Once you have the live link, send it in WhatsApp — the Open Graph tags in each page's `<head>` control the link preview text.

## File structure

```
birthday-website/
├── index.html       homepage — hero + two CTAs
├── thankyou.html     scroll-driven thank-you card
├── party.html        photo scrapbook, food taps, gift/QR reveal
├── css/style.css     design tokens, animations, responsive rules
├── js/
│   ├── main.js        sound toggle, cursor glow, button feedback
│   ├── animations.js  entrance sequence, scroll reveal, confetti
│   └── party.js       food counters, photo lightbox, QR reveal, BirthdayBot
└── assets/
    ├── images/        photo placeholders — swap these
    ├── music/          drop theme.mp3 here (optional)
    └── qr/             swap qr-placeholder.svg for your real QR
```

## Notes on a few design decisions

- **BirthdayBot** is a small rule-based joke generator (tap the cake a few times), not a real AI API — that keeps the site dependency-free, key-free, and it still works if you're offline or a network request fails. If you want a real LLM-powered version later, you'd need a serverless function to hold the API key; never put one directly in the JS.
- **Confetti** is plain DOM elements with a CSS fall animation, not canvas — cheap enough to trigger on taps without hurting scroll performance on mid-range phones.
- Everything respects `prefers-reduced-motion` — animations shorten to near-zero automatically for people who have that OS setting on.
