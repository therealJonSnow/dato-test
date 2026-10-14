# Notes: agent "showcase"

Sections: developer-editor-experience-section (breakpoint proposal) 3026:11822, and TEST/headless-cms-section 2983:14001 with TEST/headless-cms-lockup 2982:14064.

## (a) Ambiguities, contradictions, missing info, and what I decided

### developer-editor-experience-section (3026:11822)
1. **768+ mock-up size.** The description says "portrait mock-up drawn at 608×915", but the 768+ variants (3026:11604 / 3026:11713) draw it at **648×974.7**, the full column at 768. I used the variant geometry (648×974.7). Between 768 and 1151 I capped the mock-up at 648px and centred it. Scaling it to the full column would make it about 1550px tall at 1151px. Please confirm.
2. **<768 is a uniform scale of 768+.** The <768 values are exactly the 768+ values × 0.5139 (333/648), so one portrait drawing scales with `cqi` and there are no separate <768 numbers.
3. **768+ Editor CMS text is enlarged on its own.** In 3026:11713 the cms-panel field labels are 14.98px and the values 17.09px. The panel's uniform scale would give 9.14px and 11.25px. The label column width and the richtext row do follow the uniform scale. I copied this with `--cms-lab-z: 1.639` and `--cms-val-z: 1.519`, applied only in portrait Editor. It looks like a hand-edit, so a designer should confirm it.
4. **Code editor at 1152+ Editor is not proportional.** The box is 299.84×246.4 and its text scales by width (×0.87). The height is taller than that scale would give. I copied the box exactly and scaled the content by width; the box clips the rest.
5. **The illustration shifts by sub-pixel amounts.** At 1152+, website-preview and navbar move by about 0.3px between Focus states (x 152.48 → 152.77). The description says "mock-up shifts right", but the visible shift is only the CMS panel and the code editor. I kept website-preview and navbar static.
6. **Code colours change with Focus, but the description doesn't say so.** In Developer the highlighted fields are orange-light-400 and the text is white 70%. In Editor the highlights are white and the whole code block is at 70% opacity. In Developer the CMS header and the first four field rows are at 70% opacity. I implemented all of this.
7. **website-preview-navbar is a bitmap.** It is a browser-chrome image (navbar-background) with a mix-blend-color overlay. Rasters can't be downloaded, so I drew a bar instead: brown-800, "overnice.com" and outline dots. The navbar is also wider than the preview at 768+ (it overhangs on the right); I kept that geometry.
8. **No MP4 for product-video or the CMS "Hero Video" thumbnail.** Both are placeholders. The section takes `videoSrc` / `videoPoster`. When `videoSrc` is set, the video is muted, loops, uses `mix-blend-mode: screen`, plays only while in view, and stays on its first frame with reduced motion.
9. **Button names.** The button component description says variants are "solid/soft", but Button.astro uses `primary`/`secondary`. I used `primary`/`secondary`. The Focus switch swaps the `btn--primary`/`btn--secondary` classes at runtime. The section adds a 300ms colour transition to its two buttons, which also softens their hover.
10. **Transition timing** is "to be agreed – suggest ~300ms ease-out". I used 300ms ease-out (`--de-dur` / `--de-ease` on the section).
11. **Button wrapping at 393.** Two buttons plus the gap come to about 338px against a 333px column, so they wrap onto two rows. I couldn't confirm the 393 frame's button row while rate-limited. I allowed wrapping so nothing overflows.

### TEST/headless-cms-section (2983:14001) and lockup (2982:14064)
12. **Animation found:** component set `headless-cms-section-animation` **1499:47138** (page "Responsive (source of truth)", frame "Animation"). Spec from its description and prototype:
    - 0.8s AFTER_TIMEOUT, then Smart Animate 416ms with the "Slow" spring (mass 1, stiffness 80, damping 20).
    - 6 steps that loop seamlessly; pauses off-screen.
    - Reduced motion shows Step 1.

    I implemented a 1216ms step (0.8s hold + 416ms move). The overdamped spring is approximated with a CSS `linear()` easing, and the item opacity crossfades between 30% and 100%.
13. **The list contents don't form a cycle.** The 11 static items (Car Widget, Kiosk, Watch, Alexa, Store, **Chatbot**, Website, App, Smart TV, Car Widget, Watch) repeat irregularly. The animation strip also includes "Mobile", and Step 5 → 6 jumps back by several rows. I used a clean 9-item cycle in the static order: Kiosk, Watch, Alexa, Store, Chatbot, Website, App, Smart TV, Car Widget. The DOM holds it three times and jumps back one cycle invisibly. Above Chatbot it matches Figma exactly; the last item below shows Kiosk instead of Watch. The `items` prop lets content change this.
14. **Headline type differs between breakpoints.** It is Oracle/H2 at 768+ but Oracle/H1 at <768 (3030:21236). I implemented it as drawn. Check whether H1 on mobile is intended.
15. **The cqi values don't quite match every Sizing mode.** One fluid rule (7.3cqi) gives 84.7 / 75.3 / 47.3px, while the modes have 84.5 / 76.6 / 48.6. That is at most 1.3px off, which is accepted per the description. Mobile uses 9.855cqi (= 32.817 / 333) and 7.2cqi for the D. All other test/headless-* values are scoped `--hl-*` custom properties per Sizing mode, at the shared breakpoints 393 / 768 / 1152 / 1320.
16. **Lockup pad and lift variables are only there to copy small offsets** (lockup-pad-left/right/top/bottom and symbol-lift). Per the lockup description they could be removed. I kept them for 1:1 fidelity.
17. **Figma MCP rate limit.** I hit it partway through. I couldn't screenshot the 393 developer-editor variants (3042:17817 / 3042:17913) separately; they are the 768+ drawing scaled, so I checked them against my 393 render by logic only.

## (b) Suggestions for the next agent / the design system
- Put the Focus-specific code colours (point 6) and the CMS row opacities into the component description. They are only discoverable by diffing the variants.
- Give `website-preview-navbar` (3026:12325) a vector export, or mark it as a CSS-drawn bar. It is currently a cropped PNG with a blend-mode overlay.
- Fix the description size of the 768 mock-up (608×915 vs 648×974.7) and say what should happen between 768 and 1151.
- headless-cms-section-animation (1499:47138): make the list an actual repeating cycle (no "Mobile" only in the strip, no step 5 → 6 jump). Also link the node id from the TEST/headless-cms-section description, since searching for it took four page scans.
- The D symbol (in 2982:14064) is exported with a fixed `#E7D864`. In code it uses `currentColor` (text/on-inverse), so it follows the theme.
- Shared change suggestion: Button.astro could take a `transition` (or always transition background/colour) so sections that swap variants at runtime don't need a `:global(.btn)` override.
- Astro 7 runs only one dev server per project. `astro dev --port 4402` reported "already running at 4400" and exited. I previewed through the existing 4400 server and did not stop it.
