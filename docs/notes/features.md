# Notes — agent "features"

Sections: features-multi-section (breakpoint proposal) 3007:14711 and feature-section (layout proposal) 2999:14413.
Files: `src/components/sections/FeaturesMultiSection.astro`, `src/components/sections/FeatureSection.astro`,
`src/components/features/FeatureRow.astro`, `FeatureVisual.astro`, `CodeSnippetPreview.astro`, preview `src/pages/preview/features.astro`.

## (a) Ambiguities / contradictions and decisions

### features-multi-section (3007:14711)
1. **Descriptions below 768.** The note says to hide them, but the 393 frame instance (3030:21237), the `Breakpoint=<768` variants (3035:17760…) and "Preview @393" all show the active description. **Decision: show the active description at every width** (two design artefacts vs. one note line that is already flagged as an open question). I checked whether showing them breaks the scroll logic: it does not. The switch happens when the *previous* row's title passes under the image, so the next row is still a full row height below the image when the previous description collapses. No cascade, and no scroll compensation is needed. The section sets `overflow-anchor: none` so browser scroll anchoring can't fight this. To hide them instead, add `@media (max-width: 767.98px) { .feature-row__desc { display: none } }` in FeatureRow.astro.
2. **"Card image: max height 400px" vs. "image max 207 wide below 768".** These don't conflict: at 1000:1160, 400px tall is 345 wide (the 768 cap). Below 768 the cap is 207 wide, so 240 tall, which makes the sticky block 340px (not ~500px as the open question says). The second open question (the last row becomes active behind the image) is therefore much smaller at 393. In testing, row 5 becomes active while scrolling and stays active (the last item stays active).
3. **"Switching is instant" (below 1152) vs. "300ms crossfade".** I read "instant" as "no delay or debounce when the active item changes". The Theme colour crossfade (300ms ease-in-out) applies at every width. The *image* swap crossfades 300ms only at ≥1152 and is instant below that, to avoid ghosting while scrolling. With prefers-reduced-motion, everything is instant.
4. **feature-visual (3011:65540) is not real artwork.** Each variant is 2–5 rounded rectangles named "image 47x" at 30% opacity. Feature 1–4 are hard-bound to the primitive `Green Light/50`, and Feature 5 is unbound (raw white). The description says "Transparent: background comes from the section (Theme mode)". **Decision:** I rebuilt the rectangles in code (percent positions from the 500×580 frame) and filled them with `--surface-default` so they follow the active theme. This also matches the hover-interaction states 306:5409. Real artwork can be passed per feature via `image` (an img URL).
5. **No section heading in the design.** I added a visually hidden `<h2>` ("Features") so the h3 row titles have a parent heading.
6. **Row semantics.** Each row is an `h3 > button[aria-expanded]` that controls its description (disclosure pattern). Focus or click activates the row at ≥1152. Below 1152, a click scrolls the row right under the sticky image. Hover activation only reacts to `pointerType === 'mouse'`, so touch devices at ≥1152 use click.
7. **The vertical zone on the image** is each row's box, extended to the midpoints of the gaps on either side. Moving the pointer above the first row or below the last row changes nothing.
8. **Divider colour.** The dividers are LINEs bound to `text/on-inverse-muted`. Implemented as the row's `border-bottom` (row padding-bottom = list gap = 20px, which matches row / 20 / divider / 20).
9. **Hover-interaction component.** Found at 306:5409 ("Features-multi-section-hover-interaction", page "Responsive (source of truth)"). It confirms that the content and colours per state match the proposal set.

### feature-section (2999:14413) + Code-snippet-preview (2614:18656)
10. **Only the Next.js tab has code in Figma.** The Nuxt, SvelteKit and Astro snippets are **made-up placeholders** in the same style (FeatureSection.astro `DEFAULT_SNIPPETS`). Replace them with official snippets from DatoCMS docs or the CMS. The tabs work (ARIA tablist with arrow / Home / End keys).
11. **Card height.** Size=393 (2614:18657) is 528 tall, but every page-frame instance overrides it to 580. **Decision: `min-height: 580px`** at all widths. Size=393 below 768 uses 20px padding, a 4px gap between tabs and a 10px gap from line numbers to code. Size=1320 at ≥768 uses 30px, 12px and 20px. The 768 frame uses the Size=1320 variant.
12. **Code is clipped at 393 in Figma.** In code the text pane scrolls horizontally (focusable, scrollbar hidden) instead of being cut off for good.
13. **Code colours** use raw hex/primitives in Figma (`#f6f5ff`, `#9e8ef5`, `rgba(...0.86)`). I mapped them to theme tokens: identifiers use `--text-on-inverse-strong`, GraphQL fields/comments use `--text-on-inverse`, and the rest uses `--text-on-inverse-soft`. The snippet follows any theme.
14. **Button logos** ("Explore Integrations", Leading=Logos) are crops of one raster PNG ("1761921586-one-line-of-code.png"). I rendered them as six 20px placeholder circles with the white ring and −10px overlap. Swap in real SVG logos later.
15. The 1152+ variant description says "wraps to stacked below 1024px (min-width 512 per half)", which contradicts the set description ("breakpoint at 1152"). **Decision: 1152** (set description + brief).

### Tooling
- `astro dev --port 4403` refuses to start while another agent's dev server holds the lock (Astro 7 prints "Dev server already running at 4400"). I used `--ignore-lock`.
- The scratchpad is shared between agents. Generic script names (`shot.mjs`) got overwritten by another agent, so use per-agent sub-folders.

## (b) Suggestions for the design system
- feature-row (3011:65510): collapse `Content=1–5` into Title/Description text properties (as its own note says).
- feature-visual (3011:65540): bind the rectangles to `surface/default` (Theme), not `Green Light/50`, and bind Feature 5 too. Better still, replace them with real exported artwork.
- features-multi-section (3007:14711): close the "descriptions below 768" open question in the note, so the note and the 393 frames agree.
- Code-snippet-preview (2614:18656): add the code for the other three tabs (or mark them as decorative). Bind the code text colours to Theme variables, and set the Size=393 variant's height to 580 to match its instances.
- Give each proposal section an explicit (even hidden) heading text in Figma, so heading levels don't have to be guessed.
