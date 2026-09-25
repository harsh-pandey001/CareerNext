import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// easeOutCubic — fast start, gentle settle, so the real value is legible
// almost immediately rather than only at the very end.
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Animates a progress value (0–100) from its previous value to `target`
 * with a requestAnimationFrame loop — starting from 0 on mount, so a
 * progress ring/bar fills in rather than appearing pre-filled. Pure React,
 * no animation library (this package stays dependency-light). Callers
 * should disable MUI's own built-in progress transition (see
 * ProfileCompletionCard) so the visual tracks this value exactly instead of
 * lagging a second easing behind it.
 *
 * Honors prefers-reduced-motion: snaps straight to `target`.
 */
export function useAnimatedProgress(target: number, durationMs = 700): number {
  const [value, setValue] = useState(0);
  const currentRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      currentRef.current = target;
      setValue(target);
      return;
    }
    const from = currentRef.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const next = from + (target - from) * ease(t);
      currentRef.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
