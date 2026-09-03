# Portfolio Website — Build Spec

A single reference doc covering design system, content, section layout, animation
spec, project setup, and deployment. Use this as the source of truth while building
(with or without AI assistance) and keep it updated as the site grows over the next
two years.

---

## 1. Identity & Goals

- **Owner**: CSE undergraduate (4th semester, extensible for 2+ more years of work)
- **Personality pillars**: bike photography, CSE / software engineering, console games
- **Tone**: minimalist, sophisticated, slightly animated — not maximalist, not template-y
- **Inspiration**: Gazi Jarin (cursor-following project reveal, restrained SWE minimalism),
  Jackie Zhang (personality mosaic, live clock, playful contact CTA, embedded case-study media)
- **Primary goal**: clearly present identity, contact info, education, projects,
  achievements/research — while leaving obvious extension points for future work

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React + Vite | Component-based, fast dev server, easy to scale as projects/sections are added |
| Animation | Framer Motion (`motion` package) | Declarative scroll-reveal, stagger, and gesture animations |
| Scroll detection | `react-intersection-observer` (or native `IntersectionObserver`) | Trigger reveals once, on enter |
| Hosting | GitHub Pages | Free, required by assignment, works cleanly with a Vite static build |
| CI/Deploy | GitHub Actions (`actions/deploy-pages`) | Auto-deploys on push to `main`, no manual `gh-pages` branch management |
| Fonts | Google Fonts: Space Grotesk, IBM Plex Sans, IBM Plex Mono | See typography spec below |

No CSS framework — plain CSS with custom properties (design tokens), for full control
over the non-default color system and motion timing.

---

## 3. Design System

### 3.1 Color tokens

Dark is the base theme; **one section** ("Mosaic / Personality") intentionally
flips to a warm light theme as a contrast beat. Accent = Phosphor Amber, chosen
because it doubles as a CRT/terminal color, a Game Boy–adjacent tone, and a
brass/oil tone — ties CSE, console games, and bikes into one palette.

```css
:root {
  /* Dark theme (default — hero, about, experience, projects, achievements, contact) */
  --bg: #0C0D0F;
  --bg-elevated: #17181B;      /* cards, panels, education/experience surface */
  --text: #EDEAE3;
  --text-dim: #8A8578;
  --accent: #C98A2B;
  --accent-bright: #E3A94A;    /* hover/glow state */
  --border: #23262B;

  /* Light theme (Mosaic / Personality section only) */
  --bg-light: #F4EFE6;
  --text-light: #1C1A17;
  --text-light-dim: #6E6658;
  --accent-light: #A66B1D;     /* deepened amber, readable on cream */
}
```

Rules:
- Never pure black (`#000`) or pure white — always the off-black / off-cream above.
- The light section is the *only* section allowed to invert; everything else stays dark.
- Transition between dark and light sections uses an 80–120px gradient buffer or an
  SVG diagonal/curved clip seam — never a hard cut.

### 3.2 Typography

| Role | Font | Usage |
|---|---|---|
| Display | Space Grotesk | Name, section headers, hero tagline |
| Body | IBM Plex Sans | Paragraphs, descriptions |
| Mono | IBM Plex Mono | Dates, tags, nav labels, project tech-stack chips — reinforces CS identity |

Scale: hero name ~64–88px / section headers ~32–40px / body 16–18px / mono labels 12–13px.
Two weights max per family (regular + medium/semibold) — avoid a heavy weight ladder.

### 3.3 Layout

- Single content column, max-width ~760–800px, left-aligned (not centered)
- Vertical rhythm: 120–160px between major sections
- Persistent left-edge **scroll progress rail**: thin vertical line filling with
  `--accent` as the user scrolls, with a node per section that lights up when active
  (this is the site's signature structural element — encodes real scroll position,
  not decorative numbering)

---

## 4. Animation Spec

| Effect | Where | Notes |
|---|---|---|
| Staggered hero load-in | Hero | Name → tagline → subtitle → socials, ~100–150ms stagger, total ~500ms |
| Split-letter / typewriter tagline | Hero | Pick ONE signature text animation, don't combine both |
| Custom cursor (lerp/spring follow) | Global | Small dot/ring, lags slightly behind real cursor; expands over interactive elements |
| Cursor-following image reveal | Projects list only | Hidden thumbnail fades+scales in near cursor on row hover, tracks mouse position while hovered |
| Scale-on-hover (simple) | Nav links, icons, tags, mosaic tiles, skill chips | `transform: scale(1.03–1.08)`, CSS transition only, no JS needed |
| Scroll-triggered fade+slide-up | Every section, staggered children | Trigger once via IntersectionObserver, ~24px slide + opacity 0→1 |
| Card hover lift | Project cards | `translateY(-4px)` + soft accent-tinted shadow |
| Live local clock | Hero or footer corner | Small, unobtrusive, ticks in real time |
| Dark→light section transition | Before Mosaic section | Gradient buffer or SVG clip seam, scroll-triggered fade |
| Easing | All entrances | `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo feel) |
| Reduced motion | Global | `prefers-reduced-motion: reduce` → disable slides/parallax, keep opacity-only transitions |

---

## 5. Section-by-Section Content Plan

1. **Hero** (dark) — Name, one-line identity tag, animated tagline, social icon row, live clock
2. **About** (dark, transitional tone) — 2–3 sentence bio
3. **Education** (dark, elevated surface) — Timeline: institution, degree, dates, coursework
4. **Experience / Involvement** (dark, elevated surface) — Internships, clubs, competitions, community work
5. **Mosaic / Personality** (**light break section**) — 5–6 rotated photo tiles, low-opacity duotone treatment elsewhere on site, full color here. Tags to include: bike photography, CSE identity (hackathon/lab/code shot), console games. Caption fades in on hover.
6. **Projects** (back to dark) — Clean text list (name + one-liner + mono tech tags), cursor-following image/GIF reveal on hover, click-through to real case-study detail (problem → approach → result)
7. **Achievements / Research** (dark, elevated surface) — Awards, competition placements, publications, certifications; calmer, denser, minimal animation (credibility section)
8. **Skills** — Grouped tag list (Languages / Frameworks / Tools), no heavy design needed
9. **Contact / Footer** (dark, bookends hero) — Email, GitHub, LinkedIn as icon links; playful CTA line; one small hidden easter egg optional

Background texture (all sections, subtle): low-opacity (6–15%) duotone-treated
photos (bike / circuit-board / pixel pattern) tinted toward `--accent`, positioned
behind content, slow parallax drift on scroll.

---

## 6. Content Checklist (assignment requirements)

- [ ] Full name and identity statement
- [ ] Contact: email, GitHub profile link, LinkedIn profile link (bare minimum)
- [ ] Education: institution, degree program, expected graduation, relevant coursework
- [ ] Projects: at least current/ongoing work, each with description + links + tags
- [ ] Academic achievements (awards, competitions, GPA if desired)
- [ ] Research (if any) — publications, ongoing research involvement
- [ ] Personal-interest content: bike photography, console games, CSE identity (mosaic section)
- [ ] AI tool usage disclosure — see Section 9 below (required deliverable)

---

## 7. Project Structure

```
portfolio/
├── .github/workflows/deploy.yml
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css                # design tokens + global styles
│   ├── data/                    # EDIT THESE to add content — no component changes needed
│   │   ├── profile.js           # name, tagline, contact links
│   │   ├── education.js
│   │   ├── experience.js
│   │   ├── projects.js
│   │   ├── achievements.js
│   │   └── skills.js
│   └── components/
│       ├── ScrollRail.jsx       # signature scroll-progress element
│       ├── CustomCursor.jsx
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Education.jsx
│       ├── Experience.jsx
│       ├── Mosaic.jsx           # the light-break section
│       ├── Projects.jsx         # cursor-follow reveal lives here
│       ├── Achievements.jsx
│       ├── Skills.jsx
│       └── Contact.jsx
├── index.html
├── package.json
└── vite.config.js
```

**Extensibility rule**: adding a new project, award, or experience entry should only
ever require adding an object to the relevant file in `src/data/` — never editing a
component. This is what makes the site painless to update over the next two years.

---

## 8. Build & Deploy Steps

### 8.1 Scaffold
```bash
npm create vite@latest portfolio -- --template react
cd portfolio
npm install
npm install framer-motion react-intersection-observer
```

### 8.2 Configure for GitHub Pages
In `vite.config.js`, set `base` to your repo name (unless using a custom domain
or a `username.github.io` repo, in which case leave it as `/`):
```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

### 8.3 GitHub Actions deploy workflow
`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 8.4 Repo settings
1. Push the repo to GitHub, set visibility to **Public**
2. Go to **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically
4. Site will be live at `https://<username>.github.io/<repo-name>/`

### 8.5 Local dev
```bash
npm run dev       # local preview with hot reload
npm run build     # production build to /dist
npm run preview   # preview the production build locally
```

---

## 9. AI Tool Usage Disclosure (fill in as you go)

Per assignment requirements, keep a running log here (or in a separate
`AI_USAGE.md`) of every AI tool used and the prompts sent, e.g.:

| Tool | Purpose | Prompt summary |
|---|---|---|
| Claude | Brainstorming design direction, color system, animation spec, this build doc | See conversation export / prompt history |

Export/save the actual conversation transcript alongside this table before submission.

---

## 10. Open Decisions / Next Steps

- [ ] Finalize actual name, bio copy, and real project list
- [ ] Source/shoot bike + console-game photos for mosaic and background textures
- [ ] Decide final hero tagline animation (typewriter vs. split-letter stagger)
- [ ] Write project case-study copy (problem → approach → result) for each project
- [ ] Optional: custom domain setup (if desired, beyond GitHub Pages default URL)

---

## 11. Feature Implementation Guide

Concrete approach for every non-trivial piece, so nothing in Section 4 stays abstract.

### 11.1 Scroll progress rail (signature element)

**Approach**: one fixed-position `<div>` down the left edge with a filled bar
(`height` driven by scroll %) plus a row of `<button>` node markers, one per section.

```jsx
// ScrollRail.jsx (concept)
const [progress, setProgress] = useState(0);
useEffect(() => {
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    setProgress(scrolled * 100);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);
```
Use `react-intersection-observer`'s `useInView` per section to know which node
should be "active" (lit up), independent of the fill percentage.
**Resources**: [MDN IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), `react-intersection-observer` docs.
**Gotcha**: throttle the scroll listener or use `requestAnimationFrame` — raw scroll events fire very often.

### 11.2 Custom cursor (lerp-follow dot/ring)

**Approach**: track real cursor position in state, render a fixed `<div>` that
animates toward it with a spring, not 1:1. Framer Motion's `useSpring` + `useMotionValue`
handles the lag naturally.

```jsx
const cursorX = useMotionValue(0);
const cursorY = useMotionValue(0);
const springX = useSpring(cursorX, { damping: 25, stiffness: 300 });
const springY = useSpring(cursorY, { damping: 25, stiffness: 300 });
useEffect(() => {
  const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
  window.addEventListener('mousemove', move);
  return () => window.removeEventListener('mousemove', move);
}, []);
```
Expand the ring (`scale`) via a CSS class toggle when hovering `a`, `button`, or `.project-row`.
**Resources**: [Framer Motion `useSpring` docs](https://motion.dev/docs/react-use-spring).
**Gotcha**: hide the custom cursor entirely on touch devices (`@media (hover: hover) and (pointer: fine)`), and set `cursor: none` on `body` only when it's active — otherwise mobile users get no cursor at all.

### 11.3 Cursor-following project image reveal

**Approach**: same mouse-tracking technique as 11.2, but scoped to the Projects
section. Each project row wraps an absolutely-positioned `<img>` that's
`opacity: 0` by default; on `onMouseEnter` fade+scale it in, on `onMouseMove`
update its `left`/`top` (offset from cursor), on `onMouseLeave` fade it out.

```jsx
<div onMouseEnter={() => setActive(project.id)}
     onMouseLeave={() => setActive(null)}
     onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}>
  {project.name}
</div>
{active && (
  <motion.img src={project.image} style={{ left: pos.x + 24, top: pos.y - 60 }}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} />
)}
```
**Resources**: Codrops "Hover Effect Ideas" archive for reference patterns (search "image trail hover effect codrops").
**Gotcha**: keep the image `position: fixed`, high `z-index`, and `pointer-events: none` so it never blocks the actual link click.

### 11.4 Scroll-triggered fade-up reveals

**Approach**: wrap each section (or each card) in a small `<Reveal>` component
using `useInView` (from `react-intersection-observer` or Framer Motion's built-in
`whileInView`), triggering once.

```jsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```
For staggered children (e.g. project cards), use a parent `variants` object with
`staggerChildren: 0.08`.
**Resources**: [Framer Motion `whileInView` docs](https://motion.dev/docs/react-scroll-animations).

### 11.5 Hero tagline animation (pick one)

- **Typewriter**: a small custom hook that reveals the string one character at a
  time via `setInterval`/`setTimeout`, plus a CSS `::after` blinking cursor
  (`animation: blink 1s step-end infinite`). No library needed.
- **Split-letter stagger**: split the string into `<span>` per letter, animate
  each with Framer Motion `variants` and `staggerChildren`. Watch performance
  with long strings — keep the tagline under ~40 characters.

### 11.6 Live local clock

**Approach**: `setInterval` updating a `Date` in state every second (or every
30s is enough for a "GMT+6:00 · 14:32" display), formatted with
`Intl.DateTimeFormat`. No external library required.
```js
new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' }).format(new Date())
```

### 11.7 Duotone / low-opacity background photography

Two viable approaches:

- **Pre-processed (recommended for quality)**: duotone the photo *before*
  uploading, in Figma/Photopea (free, browser-based) or Photoshop, mapping
  shadows → near-black and highlights → `--accent`. Export as WebP, apply
  `opacity: 0.08–0.15` in CSS on top.
- **CSS-only (faster, lower fidelity)**: `filter: grayscale(1) sepia(1) hue-rotate(15deg) saturate(2)`
  approximates a duotone without pre-processing, tune the `hue-rotate` value to land on amber.

**Resources**: [Photopea](https://www.photopea.com) (free Photoshop-alternative, browser-based), [Squoosh](https://squoosh.app) (compress/convert to WebP before committing).
**Gotcha**: large uncompressed photos will tank your Lighthouse performance score — always run images through Squoosh first, target under ~150KB each for background textures.

### 11.8 Mosaic / personality tile grid

**Approach**: CSS Grid or absolute-positioned tiles with slight random rotation
(`transform: rotate(-3deg)` etc., hard-coded per tile for a "corkboard" feel, not
randomized at runtime — consistency matters more than randomness here). Caption
`<span>` positioned over the image, `opacity: 0` by default, fades in on
`:hover`/`:focus-within` (use `:focus-within` too, for keyboard accessibility).

### 11.9 Dark → light section transition seam

**Approach**: an SVG shape (a wide, shallow curve or diagonal `<path>`) placed at
the bottom of the Experience section / top of the Mosaic section, filled with
the *target* background color, sitting on top of the source section's background.
Alternatively, a plain `<div>` with `background: linear-gradient(180deg, #14171B, #F4EFE6)`
sized ~100px tall between the two sections is a lower-effort version that still
avoids a hard cut.
**Resources**: [Shapedivider.app](https://www.shapedivider.app) — generates SVG section-divider shapes you can copy directly.

---

## 12. Resources & Tools

### Fonts
- [Space Grotesk on Google Fonts](https://fonts.google.com/specimen/Space+Grotesk)
- [IBM Plex Sans on Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Sans)
- [IBM Plex Mono on Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono)
- Load via `<link>` in `index.html` or self-host with `@fontsource/space-grotesk` etc. (npm packages) for better performance than the Google Fonts CDN.

### Icons
- [Lucide React](https://lucide.dev) (`npm i lucide-react`) — clean outline icons for nav/social/UI glyphs
- [Simple Icons](https://simpleicons.org) — brand-accurate GitHub/LinkedIn/etc. logos if you want authentic brand marks instead of generic icons

### Animation & interaction
- [Framer Motion docs](https://motion.dev/docs/react-quick-start)
- [react-intersection-observer docs](https://github.com/thebuilder/react-intersection-observer)
- [Shapedivider.app](https://www.shapedivider.app) for section-seam SVGs
- [Codrops](https://tympanus.net/codrops/) — reference archive for hover/cursor effect ideas (read for concepts, don't copy code verbatim)

### Image tooling
- [Photopea](https://www.photopea.com) — free browser Photoshop alternative, for duotone treatment and cropping
- [Squoosh](https://squoosh.app) — compress/convert images to WebP before committing to the repo
- Your own bike/console-game/CSE photos — shoot or select these yourself; this is the one part of the site an AI tool genuinely can't do for you, and it's the part that will make it actually look like *your* site

### Testing & quality
- Chrome DevTools **Lighthouse** tab — run before every deploy, target 90+ performance/accessibility
- [axe DevTools extension](https://www.deque.com/axe/devtools/) — accessibility checks (contrast, focus order, alt text)
- Test with `prefers-reduced-motion` forced on in DevTools' Rendering tab to confirm the reduced-motion fallback actually works

### Deployment references
- [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart)
- [Vite static deploy guide](https://vite.dev/guide/static-deploy.html#github-pages)
- [Custom domain on GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) (optional, only if you buy a domain later)
