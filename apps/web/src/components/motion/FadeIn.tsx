'use client';

import { motion, useReducedMotion } from 'motion/react';
import Box, { type BoxProps } from '@mui/material/Box';

// `motion.create` wraps an arbitrary component (MUI's Box) so it keeps every
// MUI prop (sx, component, etc.) while also accepting motion's animation
// props — the standard way to combine motion with a component library
// instead of dropping to plain <motion.div> and losing sx/theme access.
const MotionBox = motion.create(Box);

// motion redefines these prop names for its own gesture/animation API with
// signatures incompatible with the native DOM event handlers BoxProps
// inherits — the standard fix when wrapping a typed component via
// `motion.create` is to omit them from the props type we expose.
type MotionSafeBoxProps = Omit<
  BoxProps,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

export interface FadeInProps extends MotionSafeBoxProps {
  /** Seconds to wait before starting. */
  delay?: number;
  /** Starting vertical offset in px — 0 for a pure fade with no slide. */
  y?: number;
  duration?: number;
  /** Trigger when scrolled into view (once) instead of on mount — for below-the-fold sections. */
  inView?: boolean;
}

/**
 * Fade/slide entrance — the base primitive every other motion component here
 * builds on. Honors prefers-reduced-motion (skips straight to the end state).
 */
export function FadeIn({ delay = 0, y = 12, duration = 0.45, inView = false, children, ...boxProps }: FadeInProps) {
  const reduce = useReducedMotion();
  const target = { opacity: 1, y: 0 };
  return (
    <MotionBox
      {...boxProps}
      initial={reduce ? false : { opacity: 0, y }}
      {...(inView
        ? { whileInView: target, viewport: { once: true, amount: 0.2 } }
        : { animate: target })}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionBox>
  );
}
