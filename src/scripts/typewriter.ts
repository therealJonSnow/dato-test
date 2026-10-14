/**
 * Shared typing engine for every typewriter animation on the page
 * (Hero, Card-AI, community heading).
 *
 * CURSOR rule from Figma (shared by all typing animations):
 *  - The cursor is "•" (U+2022) in the current run's colour/size/style, right after the
 *    last typed character. It does not blink.
 *  - Characters appear one by one with ±40% jitter. Line breaks are typed like characters.
 *  - The full text is always in the DOM for screen readers; the animation is visual only.
 *  - prefers-reduced-motion or no JS: show the final state immediately.
 *
 * Markup contract (see .tw in global.css):
 *   <el class="tw">
 *     <span class="tw__final">final markup (read by screen readers)</span>
 *     <span class="tw__anim" aria-hidden="true"></span>
 *   </el>
 * Both layers share one grid cell, so the final text reserves the space and nothing moves
 * while typing. While animating, .tw--playing makes the final layer transparent.
 */

export const CURSOR = '•';

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class Typer {
  readonly root: HTMLElement;
  readonly anim: HTMLElement;
  private current: HTMLElement;
  readonly cursor: HTMLSpanElement;

  constructor(root: HTMLElement) {
    this.root = root;
    const anim = root.querySelector<HTMLElement>('.tw__anim');
    if (!anim) throw new Error('Typer: missing .tw__anim');
    this.anim = anim;
    this.anim.textContent = '';
    this.cursor = document.createElement('span');
    this.cursor.className = 'tw__cursor';
    this.cursor.textContent = CURSOR;
    this.current = this.run();
  }

  /** Start playing: hides the final layer visually (it stays in the accessibility tree). */
  start() {
    this.root.classList.add('tw--playing');
    return this;
  }

  /** Show the final layer again and drop the animated layer. */
  finish() {
    this.root.classList.remove('tw--playing');
    this.root.classList.add('tw--done');
  }

  /** Begin a new colour run (e.g. muted subheadline). The cursor moves into it and takes its colour. */
  run(className = '') {
    const span = document.createElement('span');
    if (className) span.className = className;
    this.anim.appendChild(span);
    this.current = span;
    span.appendChild(this.cursor);
    return span;
  }

  /** Instantly append text (no typing) before the cursor. */
  write(text: string) {
    for (const ch of text) this.appendChar(ch);
  }

  /** Type text at `cps` characters per second with ±jitter timing. */
  async type(text: string, cps = 60, jitter = 0.4) {
    const base = 1000 / cps;
    for (const ch of text) {
      this.appendChar(ch);
      await sleep(base * (1 + (Math.random() * 2 - 1) * jitter));
    }
  }

  /** Remove `n` characters before the cursor in the current run. */
  erase(n = 1) {
    for (let i = 0; i < n; i++) {
      const prev = this.cursor.previousSibling;
      if (!prev) return;
      if (prev.nodeType === Node.TEXT_NODE) {
        const t = prev as Text;
        t.data = t.data.slice(0, -1);
        if (!t.data) t.remove();
      } else prev.remove();
    }
  }

  /** Change what the cursor shows ("•", "••", "[••]" faces, …). null hides it. */
  setCursor(glyphs: string | null) {
    if (glyphs === null) this.cursor.remove();
    else {
      this.cursor.textContent = glyphs;
      if (!this.cursor.isConnected) this.current.appendChild(this.cursor);
    }
  }

  /** Play a sequence of cursor glyphs, `ms` each. */
  async cursorFrames(frames: string[], ms: number) {
    for (const f of frames) {
      this.setCursor(f);
      await sleep(ms);
    }
  }

  private appendChar(ch: string) {
    if (ch === '\n') {
      this.current.insertBefore(document.createElement('br'), this.cursor);
      return;
    }
    const prev = this.cursor.previousSibling;
    if (prev && prev.nodeType === Node.TEXT_NODE) (prev as Text).data += ch;
    else this.current.insertBefore(document.createTextNode(ch), this.cursor);
  }
}

/** Resolve once `el` has crossed the given intersection threshold / rootMargin. */
export function whenInView(el: Element, options: IntersectionObserverInit = { threshold: 0.5 }) {
  return new Promise<void>((resolve) => {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        resolve();
      }
    }, options);
    io.observe(el);
  });
}

/** Run `cb` while `el` is in view and `off` when it leaves (loops, videos, marquees). */
export function onVisibility(el: Element, on: () => void, off: () => void, threshold = 0) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => (e.isIntersecting ? on() : off())),
    { threshold },
  );
  io.observe(el);
  return io;
}
