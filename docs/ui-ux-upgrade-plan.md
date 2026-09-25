# UI/UX Upgrade Plan — Motion-Based Polish

**Status:** Phases 1–4 done and verified (2026-09-13); Phase 5 (from
`animationideas.md`) done and verified (2026-09-14). FilterBar wiring still on request.
**Scope:** `apps/web` only. Material UI stays the primary UI library; Tailwind/shadcn
stays scoped to `src/components/ui/**` (see CLAUDE.md's UI Library exception).
`motion` (installed) is the animation layer used across the existing MUI app —
this is a polish pass, not a redesign.

## Ground rules
- Don't duplicate animation MUI already does well (Snackbar toasts, `SignupWizard`'s
  `Fade` step transitions, `@mui/x-charts`' own chart transitions).
- Every animation respects `prefers-reduced-motion`.
- No new UI library beyond what's already in the repo (`motion`, MUI, the scoped
  Tailwind/shadcn setup from the filter-bar work).

## Phase 1 — Animation primitives (foundation)
Shared, reusable components in `apps/web/src/components/motion/`:
- `FadeIn` — mount-in fade/slide wrapper.
- `StaggerList` — staggers a list of children in on mount.
- `AnimatedNumber` — count-up for numeric stats.

Everything in later phases builds on these instead of hand-rolled animation
per component.

## Phase 2 — Dashboard polish (highest visibility, quickest win)
- `StatCard` numbers count up on mount instead of rendering instantly.
- `StatsRow`'s 4 cards stagger in.
- Skip `ActivityTrendChart`/`ApplicationsChart` — `@mui/x-charts` already animates.

## Phase 3 — List/grid polish (done)
- Job cards (`CustomJobsSection`) and Application cards (`ApplicationsBoard`,
  per Kanban column) stagger in via `StaggerList`, re-triggering when the
  filtered set changes (search/filter, debounced).
- New shared `components/common/EmptyState.tsx` (fades in via `FadeIn`) used
  for: no jobs added yet (previously rendered nothing at all — a real gap),
  no jobs matching the current filter, and no applications yet.
- Did NOT add a motion hover effect to JobCard — it already has a clean
  CSS-only hover (border-color + shadow transition); adding motion on top
  would just duplicate/fight it, so left as-is per the "don't duplicate what
  already works" ground rule.

## Phase 4 — Route transitions (done, scope adjusted after investigation)
- `app/(app)/template.tsx` — an entrance-only fade+slide on every route
  change, not a full `AnimatePresence` cross-fade.
- **Why the scope changed**: `AnimatePresence`'s exit animation does not fire
  across Next.js App Router client-side navigations — confirmed empirically,
  not assumed. Method: in-browser opacity sampling at 60fps via
  `requestAnimationFrame` (no Playwright round-trip latency per sample),
  across a 5-second window, with both routes pre-warmed first (to rule out
  dev-server cold-compile delay as a confound — an earlier, less careful
  timing test gave a false negative for exactly this reason before
  pre-warming was added). Result: opacity never took any value besides `0`
  or `1` — the exit phase never ran. The identical `AnimatePresence` code
  was separately confirmed to animate correctly (real intermediate opacity
  values, e.g. 0.036) when triggered by local React state instead of a route
  change — isolating the cause to the App Router's navigation mechanism
  specifically, not a motion/React version issue. Root cause: the router's
  own segment reconciliation swaps content before `AnimatePresence` gets a
  chance to defer the removal.
- Must be `template.tsx`, not `layout.tsx` — `layout.tsx` persists across
  navigations within a segment (that's what keeps the sidebar/topbar from
  remounting), so a `key`-triggered remount placed there never actually
  fires either; `template.tsx` is the one primitive Next.js guarantees a
  fresh instance of on every navigation.
- Verified live: precise opacity sampling shows a clean 0→1 progression on
  every navigation, sidebar/topbar never remount, no console errors,
  `prefers-reduced-motion` navigates without error (skips the animation).

## FilterBar wiring — optional, separate decision (not started)
Wire the `FilterBar` component (`src/components/ui/filter-token-bar.tsx`,
currently only live at the `/dev-filter-bar` demo route) into the Jobs page's
real filters. Jobs already has a working MUI-based filter UI, so this means
**replacing** it, not just adding to it — needs its own confirmation before
starting, not bundled into the phases above.

## Recommended order
Start with **Phase 1 + 2** (foundation + Dashboard): self-contained, highest
visibility, doesn't touch any complex existing component. Then 3, then 4.
Phase 5 only on request.

## Phase 5 — `animationideas.md` pass (done, 2026-09-14)

Audited the spec against the app as it actually exists. Already covered by
Phases 1–4: animated numbers (§9), card stagger (§4), empty states (§17),
page transitions (§15), reusable primitives (§20). Not applicable yet — the
features don't exist in V1: Career Roadmap (§10), learning courses (§11),
tabs/segmented controls (§13); MUI dialogs already animate (§14).

Built for the gaps that DO apply:
- `components/motion/MotionButton.tsx` — `motion.create(Button)`, hover
  scale 1.02 / tap 0.97, spring-settled; reduced-motion disables both. Applied
  only to primary actions where feedback means something: JobCard Apply,
  "Add Custom Job", EmptyState CTA. Not every button (§12).
- `components/common/AnimatedMenuIcon.tsx` — hamburger ⇄ X via SVG path
  morph (three `motion.path`s), `currentColor` so it follows the theme. Wired
  into AppTopBar's mobile-only menu button with a live `aria-label` /
  `aria-expanded` (§8).
- AppSidebar nav items stagger in via `StaggerList`; `MobileNavDrawer` bumps a
  `replayKey` each time it OPENS so the cascade replays per open despite
  `keepMounted` (deliberately not on close — restarting the entrance while the
  panel slides away would flicker) (§8).
- JobCard: 2px hover lift added to the existing CSS hover (transform in the
  same transition; disabled under `prefers-reduced-motion`); bookmark and
  Applied-checkmark icons spring-pop on state change — gated on the user
  having interacted with THAT card, so refetches/initial render don't pop
  every icon (§5, §7).
- `packages/shared-ui/src/hooks/useAnimatedProgress.ts` — pure-React rAF
  count (easeOutCubic, 700ms), no motion dependency added to shared-ui.
  Used by ProfileCompletionCard (ring + % text count up together) and a new
  `SkillBar` in SkillsOverview. MUI's own progress transition is disabled on
  both so the visual tracks the value exactly instead of easing a second
  time behind it (§9, §11).
- `FadeIn`/`StaggerList` gained an `inView` option (`whileInView`, once,
  small threshold); DashboardContent's two below-the-fold columns use it (§3).

Verified live (Playwright, real data): ring `25→36→42→46→49→50%`, skill bar
`37→54→64→70→73→75`, card hover `translateY(-2px)`, button hover
`scale(1.02)`, hamburger path `M 2 2.5 L 20 2.5 → M 3 16.5 L 17 2.5`, drawer
items observed mid-stagger, drawer closes on navigate, reduced-motion snaps to
final values with zero errors. Typecheck/lint/build clean; bundle sizes
unchanged.

## Perf check after Phase 5 (2026-09-14) — "nav clicks feel slow"

Diagnosed, not guessed. Two separate causes:
1. **Dev-server cold compilation (the multi-second part).** The dev log showed
   `Compiled /resume in 15.3s`, `/documents in 12.6s`, `GET /dashboard in
   10563ms` — each first visit to a route compiles it (~4.4–4.6k modules per
   page). Every dev-server restart in this work wiped `.next`, so every route
   paid that again on the user's next click. Fix: stop clearing `.next` on
   restarts; pre-warm all routes after any restart. Once warm, server time
   per route is 60–900ms and repeat hits ~30ms. Not an animation cost, and
   not present in a production build.
2. **Animation layering (the ~100–200ms part).** Measured click→visible and
   click→fully-settled on WARM routes with animations on vs off
   (`reducedMotion` context as the A/B). Before tightening: avg settled
   288ms vs 130ms. The dashboard was double-faded (route template fade +
   its own `FadeIn`) with stacked stagger delays (0.15s/0.25s).
   Fixes: removed the redundant dashboard `FadeIn`; template fade 0.25s→0.15s
   (y 8→6); dashboard stagger delays 0.15/0.25→0.05/0.1, stagger 0.1/0.08→0.06.
   After: avg settled 241ms vs 105ms (Dashboard 367→324ms). The remaining
   overhead is essentially the 150ms template fade — kept deliberately, per
   the spec's own 150–250ms micro-interaction guideline.
Rule going forward: any per-navigation animation is a fixed tax on every
click — re-measure with the on/off A/B before adding one.
