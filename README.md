# Northbound Logistics

Static marketing site for a fictional industrial freight and logistics operator.

Pure HTML, CSS and JavaScript — no build step, no framework, no dependencies.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, service grid, stats, process, testimonials, CTA |
| `services.html` | Six service lines, transit window table, FAQ accordion |
| `about.html` | Company story, operating rules, safety and compliance |
| `contact.html` | Quote request form, contact details, hub directory |

## Structure

```
├── assets/
│   ├── favicon.svg
│   └── img/                      Photography (Pexels, free licence)
├── css/style.css                 Design system + all components
├── js/main.js                    Nav, reveal, counters, accordion, form validation
├── .nojekyll                     Serve files as-is, bypass Jekyll
├── index.html
├── services.html
├── about.html
└── contact.html
```

## Design system

Everything is tokenised in `:root` at the top of `css/style.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#082d38` | Page background |
| `--ink-2` | `#0d4759` | Elevated surface |
| `--ink-deep` | `#051f27` | Recessed / footer |
| `--accent` | `#f57539` | Primary action, highlight |
| `--fg` | `#efefef` | Body text |
| `--font-sans` | Instrument Sans | Display and body |
| `--font-mono` | Martian Mono | Technical labels, eyebrows, data |

Type uses a fluid `clamp()` scale so it holds between 320 px and 2560 px without breakpoints.

Signature details: notched clip-path corners on buttons and cards, a blueprint grid masked into the hero, an orange marquee strip, and a safety-orange notched badge on the about split.

## Behaviour

`js/main.js` is a single IIFE, no dependencies:

- sticky header state on scroll
- mobile drawer with staggered link reveal, Escape to close
- `IntersectionObserver` reveal animations with optional `data-reveal-delay`
- marquee track cloned for a seamless loop
- counters animate once when scrolled into view
- single-open accordion with height transition
- active nav link derived from the current filename
- quote form validation with inline errors and an ARIA live region

## Accessibility

- Skip-free semantic landmarks, one `h1` per page
- Visible `:focus-visible` outline in the accent colour
- `prefers-reduced-motion` disables every animation and transition
- Form errors wired to inputs with `role="status"` feedback
- All decorative SVG marked `aria-hidden`

## Local preview

```bash
npx serve .
```

or

```bash
python -m http.server 8000
```

## Deploy

Deployed to GitHub Pages straight from the `main` branch root — no build step, no
`actions/` workflow. The `.nojekyll` file tells Pages to serve the files as-is
instead of running them through Jekyll.

To change the deployment target later, go to **Settings → Pages → Source**.

The quote form validates in the browser only and does not transmit data.

---

Photography from [Pexels](https://www.pexels.com/) under the Pexels licence.
Fonts from Google Fonts (Instrument Sans, Martian Mono) under the SIL Open Font License.
