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

### 1. Getting assets out of the file
- Every image, video and most icons can only be reached through temporary `figma.com` URLs. A sandboxed build agent often can't fetch these.
- Vectors were exported through the Plugin API instead (`exportAsync({format:'SVG_STRING'})`). Rasters and videos are placeholders.
- No MP4s exist for the product video, the globe or the waving hand, and the API can't export them.
- **Suggestions:**
  - Ship the assets: an "Assets" page with export settings, or a shared folder.
  - Make every logo its own flattened vector component, bound to a colour variable rather than hex.
- **Related:** several logos/icons fail to export because of hidden copies or masks (Logos-line, the Card-AI check icon), and Vercel exported with a clipped viewBox.

### 2. Descriptions and the drawn design disagree
The descriptions are excellent and were followed closely, but in many places they contradict the components or page instances. Each case below records which one was followed.
- **Hero:**
  - The description says the secondary button is "Docs"; the instance says "Explore Pricing".
  - The description puts a typed line break only at ≥1152; the design breaks the line at every width.
  - The final face is "[••]" in the timeline but "[•ᴥ•]" in the design.
- **footer-animation-section:**
  - The description says the band reads "Ciao [•ᴗ•]"; the component shows "Questions? Ask away [••]".
  - The description says "blend Screen", but the fill is set to Normal.
- **nav-dropdown:** the description says Subtitle-size links and a soft button; the drawing uses H2 links and an underlined link.
- **developer-editor:** the description says the mock-up is 608×915; the variants draw it at 648×974.7.
- **features-multi-section:** the description says to hide descriptions below 768; the 393 frames show them. The note itself flags this as an open question.
- **Case studies:** the note refers to "Case-study-card-logo State=Hover", which doesn't exist. The variant gap is 120; the 393 instance gap is 50.
- **feature-section variant:** it mentions a 1024 breakpoint; the set says 1152.
- **Suggestion:** treat the description as the spec and regenerate it whenever the variant changes, or add a "verified against variant on <date>" line.

### 3. Page instances override the components silently
- **Hero at 393:** extra padding-top and gap bound to `section/padding-y`, set only on the instance.
- **Code-snippet-preview:** height overridden to 580 everywhere.
- **Instance text left as placeholders:** "Primary Button" on the Slack band, and trailing "\n" or spaces in several Card-AI and card-section strings.
- **Suggestion:** if an override is intended, move it into the component and describe it; otherwise reset it.

### 4. Tokens bypassed in the file
These raw values were mapped to theme tokens in code so they re-theme:
- **Hard-coded colours or primitives where a Theme token exists:**
  - Dark text-headline runs (raw `#e7d864`).
  - card-section heading (Purple Deep primitives inside a Blue section).
  - feature-visual (Green Light/50).
  - Code-snippet colours.
  - Mobile-menu separators (Brown/700).
  - Logo fills.
  - The D symbol.
  - Footer status (raw Green primitives; suggest a `status/ok` token).
- **Theme collection:** `surface/inverse-fade` and `surface/default-pressed` are raw values, not aliases. The Default mode uses "Brown" and "Yellow" instead of the `<Colour> Deep/Light` naming.
- **Component-specific variables in the global Sizing collection:** the `test/headless-*` set.
- **Text style descriptions don't match use:** Display is "for heroes", but the hero uses H1. Some components switch H1 and H2 at a breakpoint without saying so (product-update-item, headless headline).

### 5. Motion specs that don't quite close
- **Spring vs duration:** Figma "Slow" springs (m1 k80 c20) take about 1s to settle, but the prototypes say 208ms or 416ms. The springs were compressed into the stated durations with CSS `linear()` curves. Suggestion: specify motion as duration + cubic-bezier.
- **headless-cms list:** it isn't a real cycle (irregular repeats, "Mobile" appears only in the animation strip), so a clean 9-item loop was used.
- **Card-AI "lands on C…":** interpreted as the shuffle ending on "C", after which the rest of the answer is typed.
- **Missing timing:** the developer-editor transition is still "to be agreed (~300ms)".

### 6. Missing information
- No link targets anywhere, so every link is `#`.
- No hover state for footer links; an underline was used.
- No accessible names for the logo strip or the mock-ups.
- No real code for the Nuxt, SvelteKit and Astro tabs. Placeholder code was written; replace it.
- No description on footer-links or footer-legal.
- The chevron icon in the community cards is an empty frame.
- The "Feature Request" pill in a community card is visible, although the note says "cta-buttons are hidden".

## Figma fixes — round 1 (2026-10-14)

Fixes were made in the Figma file only; the code has not been updated yet. ✅ = done in Figma, ⚠️ = needs a manual step (see "Manual steps").

### 2. Descriptions vs design
- ✅ **Hero** (2939:56515), description updated:
  - The secondary button is "Explore Pricing" (Deep on White, Secondary, no arrow).
  - The subheadline always starts on a new line at every breakpoint.
  - The final state ends with the face "[••]".
  - ⚠️ The page instances' Subheadline text still ends in "[•ᴥ•]" and needs changing to "[••]".
- ✅ **footer-animation-section** (3020:67323), description rewritten:
  - The "blend Screen" claim is removed.
  - "Ciao [•ᴗ•]" is replaced by the real Footer-cta text, "Questions? Ask away [••]".
- ✅ **Footer-cta** (2377:38619), new description: the arrow appears and the face smiles on hover, "[••]" → "[•ᴗ•]", instantly.
  - ⚠️ The Hover variant text still reads "[••]"; change it to "[•ᴗ•]".
- ✅ **nav-dropdown** (2883:11102), description now matches the drawing: H2 links, an underlined "→ All …" text link instead of the soft button, fixed 489 height.
- ✅ **developer-editor** (3026:11822), description sizes now match the variants: 648×974.7 at 768+ and 333×500.9 at 393 (a uniform 0.514 scale).
- ✅ **features-multi-section** (3007:14711), description updated:
  - The active description always shows at every breakpoint.
  - The open question about it is removed.
- ✅ **case-studies-section** (3014:66627), description updated:
  - The non-existent "Case-study-card-logo" reference now points to Case-study-card (proposal) State=Hover.
  - The header → grid gap is documented from the variants: space/2xl at ≥768, section/padding-y below 768. The variant already binds `section/padding-y`, which gives the 50px at 393, so there was no instance override to remove.
- ✅ **feature-section** variants (2990:14104, 2999:14394), description updated:
  - "Stacks below 1024px" is now "below 1152px".
  - "Not yet used in any design" is now "Used on the homepage".
- HTML entities (`&amp;lt;`, `&#39;`, …) in the edited descriptions were cleaned up to plain characters.

### 3. Instance overrides
- ✅ **Hero 393 override removed.** paddingTop and itemSpacing were unbound and set back to 0, as on every other frame. The hero is now 400px tall at 393 and the frame reflows.
- ⚠️ **Code-snippet-preview at 393** (I3030:21238;2999:14396) is still 580 tall instead of the component's 528.
  - The feature-section variant Breakpoint=<1152 holds the snippet at 580 (Size=1320). The 393 page instance swaps it to Size=393 but keeps the 580 height.
  - The Plugin API won't resize a layer nested inside an instance; the call silently does nothing.
- ⚠️ **Placeholder and stray copy** still needs changing:
  - "Primary Button" → "Join us on Slack" on the 6 Slack-band instances.
  - Remove the trailing "\n" on the Card-AI question at 768 and 393.
  - Remove the trailing space on the headless-cms paragraph (all 6 frames).

### 6. Missing descriptions
- ✅ **footer-links** (1492:33921) now has a full description: layout, type and colour, the Status group, breakpoint behaviour (1152 uses space/xl, 768 a 3-column grid, 393 a 2-column grid) and link/hover rules.
- ✅ **footer-legal** (1545:36015) now has a full description: layout, Caption text, mailto, and the 393 wrap/right-align.

### Not done (on hold by request)
- Section 1 (assets).
- Section 4 (tokens bypassed).
- Section 5 (motion specs).
- The remaining items in sections 2, 3 and 6.

### Manual steps (blocked for the agent)
- **The trial font can't be loaded by the plugin.** "ABC Oracle Unlicensed Trial" isn't available to the Plugin API, and Figma won't edit a text layer whose font it can't load. That blocks:
  - the hero face "[•ᴥ•]" → "[••]" (Subheadline property on the 6 homepage hero instances),
  - "Primary Button" → "Join us on Slack" (6 Slack-band instances),
  - Footer-cta State=Hover text "[••]" → "[•ᴗ•]",
  - the trailing whitespace trims listed above.
  - These take a minute by hand, or the agent can redo them once the font is available to Figma (e.g. uploaded as a team font).
- **Code-snippet-preview 393 height.** Select the snippet inside the 393 feature-section instance and set its height to 528. Or fix it at the source: give the Breakpoint=<1152 variant's snippet the right height per Size.

### Code follow-ups (when we update the site)
- Hero: remove the `<768` padding/gap rule and end the typewriter on "[••]" instead of switching to "[•ᴥ•]".
- Footer-cta: add the hover smile ("[••]" → "[•ᴗ•]").
- Code snippet: use 528 at 393 once Figma is fixed (the code currently uses `min-height: 580px`).

## What worked well (keep doing this)
- Breakpoints as variable modes + "Breakpoint" variants with "in code this is a media query, NOT a prop". This mapped one-to-one to CSS.
- Typed motion timelines with exact ms values, plus the shared CURSOR rules and reduced-motion and no-JS fallbacks.
- Explicit semantics: "ONE h1 with a muted span", "render as p", "aria-hidden mock-up with one label".
- Theme modes per section and per feature (features-multi-section recolouring) mapped cleanly to `data-theme`.

## Process notes for the next agent
- The Figma MCP has a per-session tool-call limit. Five parallel agents hit it, and some agents had to finish from metadata or screenshots only. Budget calls: use one `use_figma` script that returns many values instead of many `get_design_context` calls.
- Astro 7 allows one `astro dev` per project. Share one server, or pass `--ignore-lock`.
- Playwright in this environment must launch with `executablePath: '/opt/pw-browsers/chromium'`.
