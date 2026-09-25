'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';

/**
 * `template.tsx`, not `layout.tsx` — Next.js guarantees a fresh instance per
 * navigation here, which is what makes the `key`-triggered remount below
 * actually happen on every route change.
 *
 * This is deliberately an ENTRANCE-only fade, not a full exit+enter
 * crossfade via `AnimatePresence`. Verified empirically (in-browser opacity
 * sampling across a 5s window, at 60fps, with routes pre-warmed to rule out
 * dev-server compile delay as a confound): `AnimatePresence`'s exit
 * animation never fires across a Next.js App Router navigation in this
 * setup — the router's own segment reconciliation swaps content before
 * AnimatePresence gets a chance to defer the removal. The identical
 * AnimatePresence code animates correctly when triggered by local React
 * state (confirmed in isolation), so this is specific to router-driven
 * unmounts, not a general motion/React incompatibility. An entrance-only
 * fade sidesteps it entirely — a mount animation needs no coordination with
 * the outgoing page's removal.
 */
export default function AppTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    // Kept very short: measured on warm routes, this fade is a fixed cost on
    // EVERY navigation (click → fully settled), so it must stay well under
    // the point where it reads as latency rather than polish.
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
