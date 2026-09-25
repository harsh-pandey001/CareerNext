'use client';

import { useEffect, useRef } from 'react';
import { animate, useMotionValue, useReducedMotion, useTransform } from 'motion/react';

export interface AnimatedNumberProps {
  /** A plain number counts up on mount; a pre-formatted string (e.g. "42%") just renders as-is — never parsed. */
  value: string | number;
  duration?: number;
}

/**
 * Count-up for a numeric stat. Mutates the DOM node directly on each tick
 * (motion's `.on('change', ...)`) instead of a React re-render per frame —
 * the standard, cheap way to animate a text value at 60fps.
 */
export function AnimatedNumber({ value, duration = 0.9 }: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const spanRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (typeof value !== 'number') return;
    if (reduce) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [value, duration, reduce, motionValue]);

  useEffect(() => {
    if (typeof value !== 'number') return;
    // Set the starting frame immediately — otherwise there's a one-tick
    // flash of "0" before the first `change` event fires.
    if (spanRef.current) spanRef.current.textContent = display.get();
    return display.on('change', (v) => {
      if (spanRef.current) spanRef.current.textContent = v;
    });
  }, [display, value]);

  if (typeof value !== 'number') {
    return <span>{value}</span>;
  }

  return <span ref={spanRef}>{reduce ? value.toLocaleString() : '0'}</span>;
}
