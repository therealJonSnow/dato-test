# Lead notes (tokens, Button, Hero, Logos-line, text-headline-centered, page assembly)

## Environment / process
- **figma.com asset URLs are not downloadable from a locked-down build environment.** `get_design_context` only hands out temporary `figma.com/api/mcp/asset/...` URLs. Workaround used: vector assets exported through the Plugin API (`node.exportAsync({format:'SVG_STRING'})`), raster/video replaced by placeholders. Suggestion: keep an "Assets" page/section with every logo, icon, image and video marked for export (or a link to a shared drive) so an agent can get them without the canvas.
- **Hidden duplicate layers fail to export.** In `Logos-line` the first copy of most logos fails `exportAsync` ("no visible layers"), probably because of the masked/clip-path groups. Flatten logos into single vector components (one `logo/<name>` component per brand) so they export cleanly and can be reused.
- **Videos can't be exported via the API** (footer hand, globe, product video). Ship the MP4s with the file.
- **Font is a trial ("ABC Oracle Unlicensed Trial").** The text styles reference the trial family name; code uses `ABC Oracle`. Note in the file which licensed family name production should use.

## Variables
- **Sizing has no 2560 mode** although there's a 2560 frame; it uses the 1920 values. 1920 and 1320 are identical, so the 1920 mode is redundant. Suggest documenting "≥1320 = one mode" on the collection.
- **Static spacing tokens are in the Sizing collection** with identical values in every mode (space/*, radius). Fine, but put them in a separate "Spacing" collection with one mode to make it obvious they don't change.
- **`test/headless-*` variables live in the global Sizing collection.** They're component-specific (headless-cms-section). Put them in a component-scoped collection or prefix group so they're not mistaken for global tokens.
- **Theme Default mode maps "deep" to the Brown primitives and "light" to Yellow**, while every other mode uses `<Colour> Deep` / `<Colour> Light`. Rename `Brown` → `Yellow Deep` (or document it) so the pattern is predictable.
- **`surface/inverse-fade` and `surface/default-pressed` are raw colour values**, not aliases like every other Theme token. They should alias primitives (e.g. add `/0` and `/70%` steps) so they can't drift.
- **Primitive steps are inconsistent:** `/750` and `/350` alphas differ per colour (e.g. Orange Light/350 = e8, Green Light/350 = e5, Purple Light/350 = db, Blue Light/350 = c9). Probably tuned for contrast; if so, say so in the descriptions.
- **Oracle/Caption** has a fixed 12px line height while its size drops to 9px at 393 – check that's intended.
- **Text styles vs. usage:** Oracle/Display says "Page headline in heroes", but the homepage Hero uses Oracle/H1 (45px). Either the description or the hero is wrong.

## Button (1477:56042)
- Variant property values are **Primary / Secondary**, but the description calls them **solid / soft** and suggests the code prop `variant: "solid" | "soft"`. Code uses `primary | secondary` to match the Figma property; pick one name.
- The description says "deep on white – near-white text", the binding is `text/on-inverse-strong` ✔. "light on white hover: deep fill, accent text" ✔ (`surface/inverse` + `text/on-inverse`).
- Disabled for "Light on Deep" uses `surface/subtle` (a dark-on-light token) on a dark background – it'll be almost invisible. Probably should be `surface/accent-subtle` / `text/on-inverse-subtle`.
- The arrow "→" is a text glyph, not an icon. That's fine, but it depends on the font having the glyph.
- Leading=Userpic/Logos variants exist but aren't used on this page, and there are no assets/rules for what goes in them.

## Hero (2939:56515)
- **The 393 page instance overrides the hero**: root `paddingTop` and `itemSpacing` are bound to `section/padding-y` only on the 393 instance (0 on all other frames). The description says "no size variants", so this override is undocumented. Implemented as a `<768px` rule.
- **Copy in the description doesn't match the instance:** the description says the secondary button is "Docs" with the arrow off; the homepage instance says "Explore Pricing". The instance was used.
- **Typed line break:** the description says "On ≥1152 the subheadline starts on a new line (typed line break)", but the static design shows the subheadline on its own line at every width (768 and 393 too: headline and subheadline are two separate text layers). Code always breaks the line so the animation's final state matches the static design.
- **Final face mismatch:** the timeline ends on "[••]" (after the wink), but the static design / final state ends with "[•ᴥ•]". Implemented: the cursor face plays the described sequence and then settles on "[•ᴥ•]" when the buttons fade in.
- **"Bring Your Own AI." as h1:** good, explicit. The label "small eyebrow line" has no style specified; `Oracle/Subtitle Medium` + `text/muted` was assumed.
- The **logo strip at 393** shows the same 40px-high logos; there's no rule on whether logo size should scale. Kept at 40px.

## Logos-line (1629:21027)
- "32 px/s" is clear. The list has 4 copies of the 7 logos in Figma (to fill 2560px). Code renders 2 copies and measures, so it's seamless at any width. A note like "duplicate as needed to fill the viewport" would help.
- `List=AI-providers` exists but has no use on this page; its logos weren't exported.
- No accessible name given for the logo strip. Code adds a visually hidden "Trusted by: …" list; confirm the wording.

## text-headline-centered (proposal) (3020:67057)
- **Placeholder copy in the page instance:** the Light ("Or join us on Slack.") instance's button still reads **"Primary Button"**. Replaced with "Join us on Slack" in code. Fix the label in Figma.
- **Hard-coded colours in the Dark instance headline:** the two colour runs use raw `#e7d864` and `rgba(231,216,100,0.7)` instead of `text/on-inverse` / `text/on-inverse-muted`. They happen to match the Default theme, but they won't re-theme. Bind them.
- On the Dark instance only the **secondary** button is visible, even though `Show secondary button` is the toggle and the description says "keep the first button and change its Variant" for a single secondary-style button. The instance does the opposite (hides the primary). Code renders a single `light-on-deep` secondary button, which matches the visuals.
- The Light instance has no muted run in its headline. Fine, but say so in the description ("muted part optional").
