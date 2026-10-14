# Agent "chrome": header and footer notes

## (a) Ambiguities, contradictions, missing info, and what I decided

1. **Figma MCP rate limit.** Partway through, get_design_context and use_figma began returning "tool call limit reached". Screenshots still worked. Because of this, footer-links (1492:33921) was built from the 1320, 768 and 393 screenshots plus pixel measurements, not from node data:
   - Padding is 60 top/bottom at every size (space/2xl).
   - The grid is 2 columns, then 3 columns at 768, then one row at 1152 and up. Gap is 60.
   - Lines are 4px apart and groups are 30px apart.
   - Colours were sampled from the screenshots: headings are Purple Light/350 (text/on-inverse-soft), links are text/on-inverse, and Status is Green Light/350 and 400.
   - The size of the status dot (6px) and its gap (12px) are estimates.
   - **Not checked:** exact node values for footer-links, any hover state on footer links (I used an underline, the same as nav-link), and link URLs (all `#`).
2. **footer-animation-section (3020:67323): wrong text in the description.** It says the band contains the static text "Ciao [•ᴗ•]". The component actually holds Footer-cta 2377:38619, which reads "Questions? Ask away [••]" and has a Hover variant where a hidden "→" fades in. I built Footer-cta as a link with the instant arrow reveal. The `ctaHref` default is `#contact`, which is a guess.
3. **Video blend mode.** The description says "blend Screen over Purple Light/400", but the VIDEO fill's blendMode is NORMAL and the component has no background fill. I followed the description: the wrapper uses surface/accent (Purple Light/400 in the Purple theme) and the `<video>` uses `mix-blend-mode: screen`.
4. **nav-dropdown (2883:11102): description vs drawing.**
   - The description says links are "Subtitle-size" and "See all…" links are "the soft button". The drawing (and nav-link 2884:11180) uses Oracle/H2 links, and "→ All …" is an underlined text link. I followed the drawing.
   - The "All …" label text is hard-coded to 30px in Figma (it is not bound to type/h2). I used `.t-h2` so it scales.
   - Every variant has a fixed height of 489, so I used `min-height: 489px`.
   - The variants render in the Default theme, while the header is Orange. The panel inherits the header's theme.
5. **The header has two dato-logo component sets: 2553:34097 (Version=short|long) and 14:64 (Property 1=short|long).** They are the same artwork; in 2553 the "CMS" letters sit 4px tighter. I built one `DatoLogo.astro` using the 14:64 geometry.
6. **mobile-menu separators** are bound to the primitive Brown/700, so they ignore the theme. I used the themed `--text-muted`, which equals Brown/700 in the Default theme.
7. **Header dropdown "leaving the panel closes it".** The rule doesn't say what happens while the pointer crosses the gap between a nav item and the panel. I close the panel when the pointer leaves the whole header and panel area (`pointerleave` on `<header>`, which contains the panels). Click toggles the panel. A mouse click right after a hover-open keeps it open.
8. **Mobile menu height.** The description says "the menu scrolls inside itself". Its max-height is the viewport height minus the header's bottom edge, measured when it opens. Crossing 1152px closes it, and Esc closes it.
9. **The header search icon has no defined behaviour.** It is a link with `aria-label="Search"` (`searchHref` prop, default `#search`).
10. **Footer-legal at 393.** The text wraps onto two lines and stays right-aligned, as in the screenshot. The logo is 152px wide at every size.

## (b) Suggestions for the next agent or designer

- Give footer-links (1492:33921) and footer-legal (1545:36015) component descriptions covering hover state, link targets and responsive rules. They have none, and footer-links has six Size variants with nothing explaining them.
- Update the footer-animation-section description: replace "Ciao [•ᴗ•]" with the real Footer-cta, and either set the VIDEO fill to Screen with a Purple Light/400 background or remove the claim.
- Merge the two dato-logo sets (2553:34097 and 14:64) into one.
- Bind the "All …" label size in nav-dropdown to type/h2, and fix "Subtitle-size" / "soft button" in its description.
- Bind the mobile-menu separator to a theme token (border/strong or text/muted) instead of Brown/700.
- Add a Status colour token (for example `status/ok`) instead of the raw Green primitives in footer-links.
- Astro 7 refuses a second `astro dev` while another is running. Use `npx astro dev --port <port> --ignore-lock`.
