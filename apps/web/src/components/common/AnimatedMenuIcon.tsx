'use client';

import { motion, useReducedMotion, type Transition } from 'motion/react';

interface AnimatedMenuIconProps {
  open: boolean;
  size?: number;
}

const lineProps = {
  fill: 'transparent',
  strokeWidth: 2,
  stroke: 'currentColor',
  strokeLinecap: 'round',
} as const;

/**
 * Hamburger ⇄ close icon. The three bars morph: outer two rotate into an X
 * via SVG path interpolation, the middle one fades. Inherits `currentColor`
 * so it picks up whatever color the surrounding IconButton has in either
 * theme. Reduced motion snaps between states instead of morphing.
 */
export function AnimatedMenuIcon({ open, size = 20 }: AnimatedMenuIconProps) {
  const reduce = useReducedMotion();
  const morph: Transition = reduce ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 };

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      initial={false}
      animate={open ? 'open' : 'closed'}
      aria-hidden
      style={{ display: 'block' }}
    >
      <motion.path
        {...lineProps}
        variants={{ closed: { d: 'M 2 2.5 L 20 2.5' }, open: { d: 'M 3 16.5 L 17 2.5' } }}
        transition={morph}
      />
      <motion.path
        {...lineProps}
        d="M 2 9.423 L 20 9.423"
        variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }}
        transition={{ duration: reduce ? 0 : 0.1 }}
      />
      <motion.path
        {...lineProps}
        variants={{ closed: { d: 'M 2 16.346 L 20 16.346' }, open: { d: 'M 3 2.5 L 17 16.346' } }}
        transition={morph}
      />
    </motion.svg>
  );
}
