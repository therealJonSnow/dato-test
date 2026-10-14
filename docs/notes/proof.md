# Notes — agent "proof" (product updates, case studies, partners)

Files: `src/components/sections/{ProductUpdatesSection,CaseStudiesSection,PartnersSection}.astro`,
`src/components/updates/{ProductUpdateItem,CardCloudSync}.astro`,
`src/components/cases/{CaseStudyCard,CaseStudyLogo}.astro`, `src/assets/svg/case-logos/*.svg` (6 logos),
preview `src/pages/preview/proof.astro`.

## (a) Ambiguities / contradictions and what I decided

### product-updates-section (breakpoint proposal) 3014:13045
- **Row type changes across breakpoints**: product-update-item Size=1320 (421:17653) uses Oracle/H2 for date+headline,
  but Size=768 (1494:29348) and Size=393 (1494:30716) use Oracle/H1. Implemented as-is (H1 below 1152, H2 from 1152).
  Consequence: at 1152 the headline is 25px (H2) while at 768–1151 it is 40px (H1) — rows get *smaller* when the
  viewport gets wider. Probably intended, but worth a designer check.
- **Divider** is a fixed 1320-wide rectangle (`divider`, surface/accent-pressed) inside a 1160 column — read as
  "full-bleed line". Implemented as a full-bleed pseudo-element clipped by the section. At 1920 the Figma line is
  still only 1320 wide (centred) — I made it span the full viewport; tell me if it should stop at 1320.
- **Hover band** (`bg-hover` 421:17667) is 1395×132 positioned at left −107 — i.e. wider than the row and 3px taller,
  covering the neighbouring dividers. Implemented as full-bleed band, 1px over each divider.
- **Hover gating**: section note says rows hover "from 1152 up"; card-cloud-sync hover has no breakpoint rule.
  Rows: `(min-width:1152px) and (hover:hover)`. "Show All": `(hover:hover)` at every width.
- **"Show All Product Updates"** text node (306:6289) is FIXED 728 wide, right-aligned. At 393 (30px) it does not fit
  333px and overhangs the left padding in the 393 frame. Implemented nowrap ≥380px, wrapping below 380px.
- The tag/userpic sizing differences (393: 12px tag padding all round + 14px text, 38px userpic) are only visible in the
  variant, not described — implemented from the variant.
- Heading text node is fixed 611 wide at ≥768 (FILL at 393) → `max-width: 611px` from 768.
- Rows are hover-styled like links but there is no link target in the design; rows render as `<a>` when `href` is
  passed (homepage default uses `#`), otherwise `<article>` without hover.
- Userpics are rasters → placeholders (circle, 40/38px). `mix-blend-mode: luminosity` kept for real images.

### case-studies-section (breakpoint proposal) 3014:66627 / Case-study-card (proposal) 3014:13589
- The "controls" at the top are **not tabs**: they are two Button instances (1477:56042) — "Lets Talk!"
  (Deep on White / Primary / Leading=Userpic) and "All Case Studies →" (Deep on White / Secondary / arrow).
  No reactions/prototype on them; they behave like the Button component (hover/pressed). Implemented as two links.
- **Header→grid gap**: bound to space/2xl (60) at 1320/1152/768 but to a different variable (=50, I assume
  section/padding-y) in the 393 frame (3030:21243). Implemented: section/padding-y below 768, space/2xl from 768.
  The component variant `Breakpoint=<768` (3014:66571) itself shows 120 — the variant and the placed instance disagree.
- Compact card (<768) uses **Subtitle Medium** for the text (not Body) — implemented, but it is not mentioned in the note.
- Compact logo box is 114×20 with max-width 186.67 (=280·2/3) and the vectors scale to 2/3 → implemented via
  `--logo-h` × 2/3. Hashicorp vector is 34 tall in a 30 box (top −2) — kept centred overflow.
- Grid max width is 1320 (not 1160) because cards carry section/padding-x — kept, alignment with the header holds.
- Description says hover is "Case-study-card-logo State=Hover" — there is no component with that name; the hover
  lives in Case-study-card (proposal) State=Hover (3014:13586). Hover colours: surface/inverse bg,
  logo text/on-inverse, text text/on-inverse-muted.
- Exported logo fills were `#351615` / `#42180F` (hard-coded, not variables). Converted to `currentColor` and the card
  uses text/primary, so the hover recolouring works. Only the 6 brands on the homepage were exported; the other 8
  brands of Case-Study-Logo (2242:30430) fall back to text — export them the same way if needed.

### partners-section (breakpoint proposal) 3019:66682
- The 393 frame uses an instance literally named "partners-section (breakpoint proposal)" (3030:21244), the others
  "partners-section-full-screen" — same component set, variant Breakpoint=<1152; no difference in build.
- Globe: `video-earth` is a RECTANGLE with a VIDEO fill (FILL). The pixel/dot-matrix globe on the canvas is just its
  frame. Placeholder box: desktop = full height of the half, max 660 wide, pinned to the centre line; stacked = full
  width with **768:891** ratio (taken from the 768 frame; 393 frame is ≈ the same). The note says "fixed proportion"
  but gives no number.
- Video behaviour implemented in a `<script>` (muted, loop, playsinline, plays only while in view via
  `onVisibility`, reduced motion → paused on frame 0). It activates when `videoSrc` is passed.
- Text column: eyebrow fixed 378 wide on desktop, subline min-w-full → `max-width: 378px` ≥1152, full width below.
- The h2 is the region list; I prefixed it with a visually-hidden "Agency Partners:" for context.

### General
- `ReadMcpResourceTool` was not available in this session, so the skill resources
  (figma-design-to-code / figma-use) could not be read; skillNames were passed anyway, use_figma was read-only.
- `npx astro dev --port 4405` refused to start: Astro 7 reports "Dev server already running at :4400" (one per
  project). I screenshotted my preview via the existing :4400 server and did not stop it.

## (b) Suggestions for the system
- State the stacked ratio of the globe video and the text column max width in the partners note.
- Bind logo vector fills in Case-Study-Logo to a Theme variable (text/primary) instead of hex — then the hover colour
  is self-documenting and the export is directly usable.
- Give product-update-item a single text style per breakpoint in the note (H1 vs H2 switch at 1152 is easy to miss).
- Rename the "Case-study-card-logo State=Hover" reference in the case-studies note to Case-study-card (proposal).
- Fix the `Breakpoint=<768` variant of case-studies-section (gap 120, header padding 120/80) so it matches the 393 frame.
- Mark full-bleed elements (divider, hover bands) explicitly as "full width of the section" instead of a fixed 1320/1395 rectangle.
