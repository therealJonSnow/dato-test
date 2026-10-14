# Ambiguities and improvement log

This is the record of every place where the Figma file (`-int- DATO CMS Web`, page "Homepage — rebuilt with proposal components") was unclear, contradictory or incomplete while building this site, plus suggestions that would make the system easier for the next agent or developer to build.

Detail per area (with node ids and the decision taken) is in `docs/notes/`:

| File | Covers |
|---|---|
| [notes/lead.md](notes/lead.md) | Variables, text styles, Button, Hero, Logos-line, text-headline-centered, process |
| [notes/chrome.md](notes/chrome.md) | header, nav-dropdown, mobile-menu, footer-animation-section, footer-links, footer-legal |
| [notes/showcase.md](notes/showcase.md) | developer-editor-experience-section, TEST/headless-cms-section + lockup + animation |
| [notes/features.md](notes/features.md) | features-multi-section, feature-row, feature-visual, feature-section, Code-snippet-preview |
| [notes/ai-community.md](notes/ai-community.md) | card-section, Card-AI, community-section, community-section-animation |
| [notes/proof.md](notes/proof.md) | product-updates-section, product-update-item, card-cloud-sync, case studies, partners |

## Most important issues

Legend: `[x]` done in Figma · `[~]` partly done (the rest needs a manual step) · `[ ]` open. Round 1 of Figma fixes was on 2026-10-14; the code has not been updated yet (see "Code follow-ups" at the end of this section).

### 1. Getting assets out of the file *(on hold)*
- [ ] Every image, video and most icons can only be reached through temporary `figma.com` URLs, which a sandboxed build agent often can't fetch.
  - Vectors were exported through the Plugin API instead (`exportAsync({format:'SVG_STRING'})`).
  - Rasters and videos are placeholders.
- [ ] No MP4s exist for the product video, the globe or the waving hand, and the API can't export them.
- [ ] Several logos and icons fail to export because of hidden copies or masks (Logos-line, the Card-AI check icon). Vercel exported with a clipped viewBox.
- **Suggestions:**
  - Ship the assets: an "Assets" page with export settings, or a shared folder.
  - Make every logo its own flattened vector component, bound to a colour variable rather than hex.

### 2. Descriptions and the drawn design disagree
- [x] **Hero** (2939:56515)
  - [x] The description said the secondary button was "Docs" while the instance said "Explore Pricing". The description now says "Explore Pricing" (Deep on White, Secondary, no arrow).
  - [x] The description put a typed line break only at ≥1152, but the design breaks the line at every width. The description now says the subheadline always starts on a new line.
  - [x] The final face was "[••]" in the timeline but "[•ᴥ•]" in the design. The description now says the final state ends on "[••]", and all 6 homepage instances now end in "[••]" (updated by hand).
    - The subheadline copy also changed to: "The AI-agnostic CMS that's human on support and transparent in pricing [••]".
- [x] **footer-animation-section** (3020:67323)
  - [x] The description said the band reads "Ciao [•ᴗ•]", but the component shows "Questions? Ask away [••]". The description now describes the real Footer-cta.
  - [x] The description said "blend Screen", but the fill is Normal. The blend reference is removed.
  - [x] New: the face smiles on hover. Footer-cta (2377:38619) now has a description: on hover the arrow appears and "[••]" → "[•ᴗ•]", instantly. The Hover variant (2377:38711) now reads "Questions? Ask away [•ᴗ•]".
- [x] **nav-dropdown** (2883:11102): the description said Subtitle-size links and a soft button, but the drawing uses H2 links and an underlined link. The description now matches the drawing, including the fixed 489 height.
- [x] **developer-editor** (3026:11822): the description said the mock-up is 608×915, but the variants draw it at 648×974.7. The description now uses the variant sizes (648×974.7 at 768+, 333×500.9 at 393).
- [x] **features-multi-section** (3007:14711): the description said to hide descriptions below 768, but the 393 frames show them. The description now says they always show, and the open question is removed.
- [x] **Case studies** (3014:66627)
  - The note referred to "Case-study-card-logo State=Hover", which doesn't exist. It now points to Case-study-card (proposal) State=Hover.
  - The header → grid gap is documented from the variants: space/2xl at ≥768, section/padding-y below 768 (50 at 393). The variant already binds section/padding-y, so there was no override to remove.
- [x] **feature-section variants** (2990:14104, 2999:14394): they said the layout stacks below 1024px. They now say 1152, and "Not yet used in any design" became "Used on the homepage".
- HTML entities (`&amp;lt;`, `&#39;`, …) in the edited descriptions were cleaned to plain characters.
- **Suggestion:** treat the description as the spec and regenerate it whenever the variant changes, or add a "verified against variant on <date>" line.

### 3. Page instances override the components silently
- [x] **Hero at 393:** an extra padding-top and gap bound to `section/padding-y` were set only on the instance. The override is removed (unbound, set to 0). The hero is now 400 tall and the frame reflowed.
- [x] **Code-snippet-preview:** height overridden to 580 on the page. Decision: 580 is correct at every size. The Size=393 variant (2614:18657) was resized from 528 to 580 (by hand), so components and page now agree. The code already uses 580.
- [ ] **Instance text left as placeholders** (blocked by the font, see below):
  - "Primary Button" → "Join us on Slack" on the 6 Slack-band instances.
  - Trailing "\n" on the Card-AI question at 768 and 393.
  - Trailing space on the headless-cms paragraph in all 6 frames.
- **Suggestion:** if an override is intended, move it into the component and describe it; otherwise reset it.

### 4. Tokens bypassed in the file *(on hold)*
These raw values were mapped to theme tokens in code so they re-theme.
- [ ] **Hard-coded colours or primitives where a Theme token exists:**
  - Dark text-headline runs (raw `#e7d864`).
  - card-section heading (Purple Deep primitives inside a Blue section).
  - feature-visual (Green Light/50).
  - Code-snippet colours.
  - Mobile-menu separators (Brown/700).
  - Logo fills.
  - The D symbol.
  - Footer status (raw Green primitives; suggest a `status/ok` token).
- [ ] **Theme collection:** `surface/inverse-fade` and `surface/default-pressed` are raw values, not aliases. The Default mode uses "Brown" and "Yellow" instead of the `<Colour> Deep/Light` naming.
- [ ] **Component-specific variables in the global Sizing collection:** the `test/headless-*` set.
- [ ] **Text style descriptions don't match use:** Display is "for heroes", but the hero uses H1. product-update-item and the headless headline switch between H1 and H2 at a breakpoint without saying so.

### 5. Motion specs that don't quite close *(on hold)*
- [ ] **Spring vs duration:** Figma "Slow" springs (m1 k80 c20) take about 1s to settle, but the prototypes say 208ms or 416ms. The code compresses them into the stated durations with CSS `linear()` curves. Suggestion: specify motion as duration + cubic-bezier.
- [ ] **headless-cms list:** it isn't a real cycle (irregular repeats, "Mobile" appears only in the animation strip), so the code uses a clean 9-item loop.
- [ ] **Card-AI "lands on C…":** interpreted as the shuffle ending on "C", after which the rest of the answer is typed.
- [ ] **Missing timing:** the developer-editor transition is still "to be agreed (~300ms)".

### 6. Missing information
- [ ] No link targets anywhere, so every link is `#`.
- [ ] No hover state for footer links; an underline was used. The new footer-links description now states underline as the rule, but no hover state is drawn.
- [ ] No accessible names for the logo strip or the mock-ups.
- [ ] No real code for the Nuxt, SvelteKit and Astro tabs. Placeholder code was written; replace it.
- [x] **No description on footer-links or footer-legal.** Both now have full descriptions:
  - footer-links: layout, type and colour, the Status group, breakpoints (1152 uses space/xl, 768 a 3-column grid, 393 a 2-column grid), links and hover.
  - footer-legal: layout, Caption text, mailto, and the 393 wrap/right-align.
- [ ] The chevron icon in the community cards is an empty frame.
- [ ] The "Feature Request" pill in a community card is visible, although the note says "cta-buttons are hidden".

### Manual steps (blocked for the agent)
- **The trial font can't be loaded by the plugin.** "ABC Oracle Unlicensed Trial" isn't available to the Plugin API, and Figma refuses to edit a text layer whose font it can't load. That blocks:
  - the Slack button label,
  - the trailing-whitespace trims.
  - Either edit them by hand, or upload the font as a team font and the agent can redo them.

### Code follow-ups (when we update the site)
- Hero: remove the `<768` padding/gap rule, end the typewriter on "[••]" (it currently switches to "[•ᴥ•]"), and use the new subheadline copy.
- Footer-cta: add the hover smile ("[••]" → "[•ᴗ•]").

## What worked well (keep doing this)
- Breakpoints as variable modes + "Breakpoint" variants with "in code this is a media query, NOT a prop". This mapped one-to-one to CSS.
- Typed motion timelines with exact ms values, plus the shared CURSOR rules and reduced-motion and no-JS fallbacks.
- Explicit semantics: "ONE h1 with a muted span", "render as p", "aria-hidden mock-up with one label".
- Theme modes per section and per feature (features-multi-section recolouring) mapped cleanly to `data-theme`.

## Process notes for the next agent
- The Figma MCP has a per-session tool-call limit. Five parallel agents hit it, and some agents had to finish from metadata or screenshots only. Budget calls: use one `use_figma` script that returns many values instead of many `get_design_context` calls.
- Astro 7 allows one `astro dev` per project. Share one server, or pass `--ignore-lock`.
- Playwright in this environment must launch with `executablePath: '/opt/pw-browsers/chromium'`.
