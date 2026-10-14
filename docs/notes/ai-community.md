# ai-community — notes

Sections: card-section (layout proposal) 3001:14482 with Card-AI (proposal) 3001:14431, and
community-section (breakpoint proposal) 3011:11428 with community-section-animation 1499:42969.

## (a) Ambiguities, contradictions, missing info and what I decided

### card-section / Card-AI
- **Subline differs per layout (as the description warns).** The only difference is a trailing space:
  `"Use AI your way, Dato will make it feel right at home. "` at 1152+ (3029:66063, 3030:18871, 3030:17671) vs
  `"…at home."` at <1152 (3030:20065, 3030:21239). It makes no visual difference, so there is one string (no trailing space).
- **Heading colours are primitives, not theme tokens.** Headline = `Purple Deep/800`, Subline = `Purple Deep/700`
  (a near-black neutral), while everything else is on the Blue theme. Kept as in Figma
  (`--color-purple-deep-800/700`). If it should follow the theme, it would be `--text-primary` / `--text-muted`.
- **The question text has a trailing "\n" at 768 and 393** (3030:20065 / 3030:21239, "How many pages … descriptions?\n"),
  which adds an empty line. It looks accidental (not there at 1152+), so I left it out.
- **The answer line's fill is bound to `Blue Light/400`** at node level, but its text range uses `text/on-inverse`. I used the token.
- **Figma's `text/on-inverse-muted` renders as #7fc4db @ 70%** in the instance, but the theme token resolves to blue-light-300. I used the token.
- **No link targets.** The Hover state (title band and arrow) suggests the card is clickable, but there's no URL. The cards accept
  `href` (passed through `connectHref` / `teachHref` on the section). With an href, the title link stretches over the whole card.
  The hover look is always shown on pointer devices (`(hover: hover) and (pointer: fine)`) and also on keyboard focus.
- **The hover band is the same colour as the section** (surface/accent on surface/accent), so on hover the card seems to lose its top 105px.
  That matches Figma (3001:14423), so I kept it.
- **"├──" glyph:** ABC Oracle seems to lack U+251C, and the Figma render shows only "──". The browser falls back to a system font that draws "├".
- **Typewriter interpretations:**
  - "Lands on 'C…'": the shuffle ends showing "C", the cursor comes back, and the rest of the answer is typed.
  - The slot machine cycles Chat-GPT → Gemini → Claude, 8 swaps × 100ms (≈0.8s).
  - "Blank line" in card 2 = the paragraph gap (space/lg) between the two text nodes, as in the static design.
  - **Card 2 start:** it waits for card 1's start + 1.2s *and* its own 50% visibility. When the cards are stacked (<1152), card 2 can be further down the page.
- **Figma's "Breakpoint=<1152" variant** is drawn at Sizing=768. At 393 the instance uses Sizing=393, so tokens just follow the viewport.

### community-section / community-section-animation
- **Which text is the "subline"?** The heading node holds "Community [•ᴗ•]\n" (text/primary) plus "Ask us anything…" (text/muted).
  Only "Community [•ᴗ•]" is typed. The muted line, "Connect with +3000…" and the button are visible from the start.
- **Wink frame "•-":** the timeline says "→ '••' (100ms)" then "0.80s types". 0.40 + 0.15 + 0.15 + 0.10 = 0.80, so this is consistent and implemented exactly.
- **The centred heading would shift while typing.** I typed it in an inline-grid box as wide as the final text, left-aligned inside, so nothing moves.
- **"cta-buttons hidden – do not build it" vs card3.** In card4 the cta wrapper has opacity 0 (not built). Every second "cta-buttons"
  ("Content Delivery API") is hidden (not built). In **card3, the "feature-request > cta-buttons" pill ("Feature Request") is visible**
  in all 7 steps, so I built it. Please confirm.
- **Spring vs 208ms.** Figma's "Slow" spring (m1 k80 c20, ζ≈1.12, overdamped) takes ≈1s to settle, but the prototype duration is 208ms.
  The description's ≈4.5s cycle only adds up with 208ms, so the spring curve is squeezed into 208ms (and 625ms for 7→1).
  This uses `linear()` with 20 sample points, and `cubic-bezier(.2,.85,.25,1)` as a fallback.
- **Odd keyframes kept as-is:** in Step 3, card3 nudges to (-1104, 113, h145) and then goes back to y=106 in Step 4.
- **Crop frames.** Each card is a crop window (`card-1`, `card-2`, …) over a taller post card. The heights per step are copied from the variants.
  card3's crop frame has no stroke in Figma, so its cut edge has no bottom border.
- **"expand-icon / chevron-up" (1499:43020) is an empty 16×16 frame**, with nothing to export. I rendered an empty 20×20 box.
- **Avatars are image fills (ELLIPSE fills=IMAGE).** I used `.asset-placeholder` circles. Solved-bar avatars keep `mix-blend-mode: luminosity`.
- **The "Solved" check icon** (Group 48096341/2, a boolean subtract) could not be exported. The Figma MCP rate limit was reached, so it is redrawn as an inline SVG
  (surface/inverse circle with the check masked out).
- **Band scale:** 1 at ≥1152, 906/1320 (0.686) at 768–1151, 641/1320 (0.486) below 768. Band height = 360 × scale.
  The band is centred on the section and clipped by `overflow: clip` on the section.
- **Main gap:** section/padding-x, except 768–1151 which uses space/xl (40). Text→button gap: space/md below 768, space/lg above.

### Process
- `ReadMcpResourceTool` was not available in this session, so the skill:// resources could not be read. I followed the brief's rules directly.
- I hit the Figma MCP tool-call limit after the structure dumps. 768/393/1152/1920 were checked from node metadata (positions, sizes, bound variables)
  instead of screenshots. Only the 1320 screenshots were compared visually.
- `astro dev --port 4404` refused to start ("Dev server already running at 4400"). Astro allows one dev server per project.
  I used the existing dev server on port 4400 for the screenshots (port 4404 not used).

## (b) Suggestions for the next agent / design system
- Bind the card-section heading colours to theme tokens (text/primary, text/muted) instead of the Purple Deep primitives.
- Remove the stray trailing "\n" / trailing spaces in the copy (Card-AI question at 768/393, card-section subline at 1152+).
- Make the Card-AI hover band differ from the section background, or confirm that it is meant to blend in.
- Either remove the visible "Feature Request" pill on card3, or reword the "cta-buttons hidden" note so it names exactly which layers.
- Put a real icon in `chevron-up` (1499:43020), or delete the empty frame.
- State spring timings as "duration X ms, ease ≈ cubic-bezier(…)" in the description. Figma spring presets don't map 1:1 to a duration.
- Several layers are misnamed (the Card-AI text nodes in "Teach it DatoCMS" are still called "How many pages…" / "Claude: 8 pages…";
  the crop frames are "card4/card-1/card-2/card3"). Clear names would speed up mapping.
- Allow one dev server per agent (or tell agents to share the lead's server on 4400). Astro 7 blocks a second `astro dev` in the same project.
