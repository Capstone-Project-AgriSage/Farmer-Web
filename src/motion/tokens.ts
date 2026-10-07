// Motion tokens for Framer Motion (seconds, cubic-bezier arrays).
// Keep in sync with --dur-* and --motion-ease-* in src/index.css.

export const DURATION = {
  micro: 0.2,
  standard: 0.35,
  image: 0.55,
  large: 0.7,
  counter: 1,
  /** Scroll-in reveals on marketing pages (see --dur-reveal in index.css). */
  reveal: 0.9,
} as const

export const EASE = {
  out: [0.22, 1, 0.36, 1],
  standard: [0.4, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
} as const

/** Viewports narrower than this get the "reduced" motion policy. */
export const REDUCED_MOTION_MAX_WIDTH = 767
