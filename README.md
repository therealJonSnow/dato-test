# DatoCMS homepage — Astro build from the Figma proposal components

A static Astro site that rebuilds the DatoCMS homepage from the Figma page **"Homepage — rebuilt with proposal components (not in use)"**. All content is hard-coded; there is no CMS.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Structure
- `src/styles/tokens/`: the Figma variable collections as CSS custom properties.
  - `primitives.css`: Colors.
  - `theme.css`: Theme modes. Each section sets `data-theme="orange|green|purple|blue|pink|default"`.
  - `sizing.css`: Sizing modes, as mobile-first media queries at 768 / 1152 / 1320. The 1320, 1920 and 2560 frames share values.
  - `radius.css`: Radius.
- `src/styles/typography.css`: the Figma text styles as `.t-*` classes (ABC Oracle trial fonts in `public/fonts`, DM Mono).
- `src/components/sections/`: one component per section on the page. Sub-components live in folders per section.
- `src/components/ui/Button.astro`: the shared button. It takes `appearance` × `variant`, with hover and pressed states from the Theme tokens.
- `src/scripts/typewriter.ts`: the shared typing engine (cursor rules, reduced motion, screen-reader text) used by Hero, Card-AI and Community.
- `docs/AMBIGUITIES.md`: everything that was unclear in the Figma file, with decisions and suggestions.

## Placeholders
Raster images and videos could not be exported (figma.com is blocked in the build environment). They render as striped `.asset-placeholder` boxes at the right size. The video sections take `videoSrc` props, already wired to play muted, play only while in view, and respect reduced motion.
