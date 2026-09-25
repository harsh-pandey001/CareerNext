'use client';

import { motion, useReducedMotion } from 'motion/react';
import Button, { type ButtonProps } from '@mui/material/Button';

const MotionMuiButton = motion.create(Button);

// Same omission as FadeIn/StaggerList — motion reuses these prop names for
// its own gesture API with signatures incompatible with the native DOM
// handlers MUI's props inherit.
type MotionSafeButtonProps = Omit<
  ButtonProps,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

export type MotionButtonProps = MotionSafeButtonProps;

/**
 * MUI Button with a subtle press/hover response — a small scale up on hover
 * and compression on tap, spring-settled. Reserved for primary actions where
 * the feedback communicates something (Apply, Save, Add…) — not every button.
 * MUI's own ripple still plays underneath; the two don't conflict (ripple is
 * a fill, this is a transform).
 */
export function MotionButton(props: MotionButtonProps) {
  const reduce = useReducedMotion();
  return (
    <MotionMuiButton
      whileHover={reduce ? undefined : { scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.6 }}
      {...props}
    />
  );
}
