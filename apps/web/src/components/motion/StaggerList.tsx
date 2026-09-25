'use client';

import { Children } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import Box, { type BoxProps } from '@mui/material/Box';

const MotionBox = motion.create(Box);

// See FadeIn.tsx for why these are omitted — motion's gesture/animation API
// reuses these prop names with signatures incompatible with the native DOM
// handlers BoxProps inherits.
type MotionSafeBoxProps = Omit<
  BoxProps,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export interface StaggerListProps extends MotionSafeBoxProps {
  /** Seconds between each child's entrance. */
  stagger?: number;
  /** Seconds before the first child starts. */
  delayChildren?: number;
  /** Trigger when scrolled into view (once) instead of on mount — for below-the-fold sections. */
  inView?: boolean;
}

/**
 * Staggers its direct children in on mount. This IS the layout container —
 * pass whatever `sx` you'd have put on the Box/Stack it replaces (grid,
 * flex column, etc.); every direct child becomes a grid/flex item exactly as
 * before, each just wrapped in a `motion.div` carrying the entrance variant.
 */
export function StaggerList({
  stagger = 0.08,
  delayChildren = 0.04,
  inView = false,
  children,
  ...boxProps
}: StaggerListProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <Box {...boxProps}>{children}</Box>;
  }

  return (
    <MotionBox
      {...boxProps}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren } } }}
      initial="hidden"
      {...(inView ? { whileInView: 'show', viewport: { once: true, amount: 0.15 } } : { animate: 'show' })}
    >
      {Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </MotionBox>
  );
}
