
# CareerNext UI Motion & Animation Upgrade

You are working on my existing **CareerNext** application.

I want to upgrade the UI with polished, modern animations using the Motion library/examples provided below.

The goal is **not** to copy the demo animations literally. Treat the supplied Motion examples as references/patterns and adapt them to the existing CareerNext UI, component architecture, design system, colors, spacing, typography, and UX.

The application should feel like a polished modern SaaS/productivity/career platform rather than a website overloaded with animations.

---

## Primary Goal

Audit the existing CareerNext frontend and introduce purposeful animations throughout the product.

Animations should:

* Improve perceived performance.
* Make interactions feel responsive.
* Give the interface more personality.
* Help users understand state changes.
* Provide hierarchy and visual feedback.
* Remain professional and suitable for a career/productivity platform.

Do **not** add animations simply because an example exists.

Prefer subtle, fast, intentional motion.

---

# 1. First Inspect the Existing Application

Before modifying anything:

1. Understand the current frontend architecture.
2. Identify the routing structure.
3. Identify the main reusable components.
4. Identify the existing design system/theme.
5. Determine whether Tailwind CSS, CSS modules, styled components, or another styling approach is being used.
6. Check whether Motion is already installed.
7. Reuse existing components whenever possible instead of creating duplicates.
8. Preserve all existing functionality.
9. Do not redesign the entire UI unless a small change is required to make an animation work correctly.

Adapt all animation implementation to the existing project conventions.

---

# 2. Motion Principles for CareerNext

Use Motion for:

* `initial`
* `animate`
* `whileInView`
* `whileHover`
* `whileTap`
* `variants`
* `stagger`
* `useAnimate`
* `useMotionValue`
* `useTransform`
* layout animations where appropriate
* spring-based interactions where they feel natural

Prefer GPU-friendly properties such as:

* transform
* opacity
* scale
* rotate
* x/y

Avoid unnecessary animation of expensive layout properties.

Keep animations short and responsive.

Typical guideline:

* Micro interaction: ~150–250ms
* Card/button interaction: ~200–350ms
* Section entrance: ~400–700ms
* Larger state transition: ~400–800ms

These are guidelines, not hard requirements.

Use spring animation when it creates a natural physical interaction.

Use easing when the animation is informational rather than physical.

---

# 3. Scroll-Triggered Animations

Use the provided scroll-triggered Motion example as inspiration.

Reference pattern:

* `initial="offscreen"`
* `whileInView="onscreen"`
* `viewport`
* variants
* spring transition

Adapt this concept to CareerNext.

### Recommended locations

Use scroll reveal animations on:

### Dashboard

Animate major sections when they enter the viewport:

* Welcome/header section
* Career progress section
* Recommended jobs
* Recommended learning resources
* Skills section
* Career roadmap
* Recent activity
* Projects

Do not animate every tiny element independently.

Instead, animate the section/container and optionally stagger its children.

Example behavior:

```text
Section enters viewport
        ↓
container fades + moves slightly upward
        ↓
cards appear sequentially
        ↓
content settles naturally
```

Use subtle movement such as:

```text
opacity: 0 → 1
y: 20 → 0
scale: 0.98 → 1
```

Avoid large dramatic movements such as cards flying hundreds of pixels.

---

# 4. Card Stagger Animations

Use Motion variants/staggering for repeated CareerNext content.

Good candidates:

* Job cards
* Learning course cards
* Skill cards
* Recommended resources
* Project cards
* Roadmap steps
* Application cards
* Interview preparation modules

Example concept:

```text
Container
 ├── Card 1  → appears
 ├── Card 2  → appears slightly later
 ├── Card 3  → appears slightly later
 └── Card 4  → appears slightly later
```

Use a small stagger delay.

Do not make the stagger slow enough that the user has to wait for content.

---

# 5. Job Card Interaction

Job cards are an important part of CareerNext, so give them polished micro-interactions.

On hover:

* slightly increase scale or elevation
* subtly move/translate the card
* reveal secondary actions when appropriate
* animate bookmark/save icon
* animate arrow/action indicators

Example:

```text
Hover
  ↓
Card slightly lifts
  ↓
shadow/elevation increases
  ↓
action icon subtly moves
```

Keep this extremely subtle.

Do not make cards bounce continuously.

---

# 6. Save Job / Add to Career Action Animation

Use the supplied **AddToBasket** Motion example as inspiration.

Do NOT literally create a shopping-basket interaction.

CareerNext equivalent should be something such as:

```text
Job card
   ↓
User clicks "Save Job"
   ↓
Bookmark/job icon receives the interaction
   ↓
visual confirmation travels toward Saved Jobs/bookmark area
   ↓
Saved count/state updates
```

Depending on the existing CareerNext UI, choose the most natural target:

* Saved Jobs
* Wishlist
* Career Plan
* Learning Plan
* Application Tracker

The animation should communicate:

**"The item was successfully saved."**

After the animation:

* update the actual application state
* update counts if applicable
* keep the interaction functional without depending on animation completion

Do not break saving functionality because an animation fails.

---

# 7. Apply / Application Tracker Feedback

When the user applies for or tracks a job, add an appropriate success animation.

Possible flow:

```text
Apply / Track
      ↓
button interaction
      ↓
loading/state feedback if necessary
      ↓
success state
      ↓
small visual confirmation
```

Examples:

* checkmark appearing
* button morphing into "Applied"
* status badge transitioning
* progress indicator
* subtle scale/spring effect

Do not use excessive confetti unless it genuinely fits the existing product personality.

CareerNext should feel professional.

---

# 8. Mobile Navigation / Sidebar

Use the provided Motion sidebar/menu example as inspiration.

Implement polished navigation animation for the existing:

* mobile menu
* sidebar
* dashboard navigation
* responsive drawer

Desired behavior:

```text
Menu closed
      ↓
User taps menu
      ↓
Navigation panel expands
      ↓
navigation items stagger into position
      ↓
menu icon transforms into close icon
```

And reverse the animation when closing.

Use the existing CareerNext navigation structure and labels.

Do not create placeholder menu items.

Use actual application routes.

The menu icon should have a smooth transition between hamburger and close states where practical.

---

# 9. Dashboard Metrics / Animated Numbers

Use the provided animated number example for meaningful metrics.

Possible CareerNext metrics include whatever already exists in the application, for example:

* Applications
* Saved Jobs
* Interviews
* Skills Completed
* Courses Completed
* Career Progress
* Profile Completion
* Learning Progress
* Interview Score
* Projects
* Certifications

Do not invent metrics merely for the animation.

If a metric already exists, animate its value when the relevant dashboard component mounts or enters the viewport.

Example:

```text
0
↓
12
```

or

```text
0%
↓
78%
```

The animation should be quick enough that the user immediately understands the real value.

Do not animate every number on every re-render.

---

# 10. Career Roadmap Animation

The Career Roadmap is a strong place for meaningful Motion.

Consider:

* roadmap line drawing/revealing progressively
* milestones appearing sequentially
* current milestone having a subtle pulse
* completed milestones transitioning into their completed state
* upcoming milestones entering with a slight fade/slide

Possible visual flow:

```text
Career Goal
    ↓
Milestone 1
    ↓
Milestone 2
    ↓
Current Stage
    ↓
Future Stage
```

The animation should reinforce progression.

Avoid continuous looping animations except for a current/in-progress indicator.

---

# 11. Learning Progress

For learning/course sections:

* progress bars can animate from their previous value to the current value
* completed lessons can use a small checkmark animation
* course cards can reveal progress smoothly
* achievement/completion states can use a subtle success animation

Example:

```text
Progress: 0%
        ↓
        68%
```

Use Motion values rather than repeatedly forcing React re-renders when appropriate.

---

# 12. Buttons and Micro Interactions

Add small interactions to important controls.

For buttons:

```text
whileHover → subtle scale
whileTap   → subtle compression
```

Good candidates:

* Apply
* Save Job
* Start Learning
* Continue Learning
* Update Profile
* Generate/Analyze actions
* Add Project
* Search
* Filter
* Next/Previous controls

Do not animate every button in the application.

Prioritize actions where motion communicates feedback.

---

# 13. Tabs / Filters / Segmented Controls

Where CareerNext has:

* Job filters
* Dashboard tabs
* Learning tabs
* Career stages
* Profile sections
* Status filters

Use Motion's layout capabilities where appropriate so the active indicator moves smoothly between options instead of disappearing/reappearing abruptly.

The interaction should feel like the selection itself moves.

---

# 14. Modal / Dialog / Drawer Animations

For existing dialogs, drawers, popovers, or overlays:

Use:

```text
overlay:
opacity 0 → 1

content:
opacity 0 → 1
scale 0.96 → 1
y 8 → 0
```

Reverse when closing.

Keep it subtle.

Do not create complicated animations that prevent the dialog from closing immediately.

---

# 15. Page Transitions

Where appropriate, introduce lightweight transitions between major CareerNext pages.

Possible transitions:

```text
opacity
+
small vertical translation
```

Avoid dramatic page transitions that slow down navigation.

The user should feel that the application is responsive, not that they are watching an animation.

---

# 16. Loading / Skeleton States

Inspect the existing loading states.

Where suitable, add subtle Motion to:

* skeleton elements
* content placeholders
* loading indicators

Do not replace good existing skeleton implementations unnecessarily.

---

# 17. Empty States

Improve important empty states with subtle entrance animation.

Examples:

* No saved jobs
* No applications
* No learning progress
* No projects
* No notifications

Use:

```text
icon/illustration
opacity: 0 → 1
scale: slightly smaller → normal
content follows with small stagger
```

Avoid excessive bouncing.

---

# 18. Accessibility

Very important:

Respect users who prefer reduced motion.

Implement a reduced-motion strategy using Motion/accessibility best practices.

Users with:

```text
prefers-reduced-motion: reduce
```

should receive either:

* minimal animation
* instant transitions
* or significantly reduced movement

Do not make important application functionality depend on animation.

---

# 19. Performance

Be careful not to introduce performance problems.

Avoid:

* unnecessary continuous animations
* animations running for off-screen elements
* expensive layout calculations
* huge numbers of independent animated elements
* animation loops that never stop
* unnecessary React state updates

Prefer:

* viewport-triggered animations
* transform/opacity
* variants
* shared reusable motion components
* reusable animation presets

---

# 20. Create Reusable Motion Patterns

Rather than implementing every animation independently, create reusable patterns where appropriate.

For example:

```text
FadeUp
StaggerContainer
StaggerItem
ScaleIn
SlideIn
MotionButton
MotionCard
AnimatedNumber
SuccessCheck
```

Only create abstractions when they make the code cleaner.

Do not over-engineer the animation system.

---

# 21. Use the Provided Motion Examples as References

The supplied examples include:

### Example A — ScrollTriggered

Use this as inspiration for:

* section reveal
* card entrance
* viewport-based animation
* staggered content

### Example B — AddToBasket

Use this as inspiration for:

* item-to-target animation
* save/bookmark confirmation
* application action feedback
* state-change animations

Do not implement a literal shopping basket.

### Example C — Animated Sidebar Variants

Use this as inspiration for:

* mobile navigation
* dashboard drawer
* sidebar
* staggered navigation items
* hamburger → close icon transition

### Example D — Animated Number

Use this as inspiration for:

* dashboard metrics
* progress values
* application counts
* learning statistics

---

# 22. Important: Use Your Own Design Judgment

You are explicitly allowed to identify additional places in the CareerNext application where Motion would improve the user experience.

After inspecting the application, use your judgment.

For example, you may identify useful animation opportunities in:

* notifications
* profile completion
* search results
* filters
* onboarding
* AI-generated career recommendations
* skill matching
* resume analysis
* interview preparation
* application status changes
* success states
* charts
* progress indicators

But only add them when they genuinely improve UX.

Do not animate something just to demonstrate Motion.

---

# 23. Do Not Change the Product Identity

The application should still feel like the same CareerNext application.

Preserve:

* existing branding
* colors
* typography
* spacing
* component style
* information hierarchy
* routes
* business logic
* existing API behavior
* responsive behavior

Motion should enhance the UI, not replace the UI design.

---

# 24. Visual Quality Target

Aim for a product experience similar to a polished modern SaaS application.

Think:

```text
subtle
responsive
smooth
intentional
professional
fast
```

Not:

```text
flashy
overanimated
game-like
slow
distracting
```

Every animation should answer one question:

**"What does this motion communicate to the user?"**

If the answer is "nothing", don't add it.

---

# 25. Implementation Process

Follow this process:

### Step 1

Audit the existing CareerNext frontend.

### Step 2

Identify the highest-value animation opportunities.

### Step 3

Implement shared Motion utilities/patterns where beneficial.

### Step 4

Implement animations incrementally.

### Step 5

Check desktop responsiveness.

### Step 6

Check mobile responsiveness.

### Step 7

Check reduced-motion accessibility.

### Step 8

Verify that animations do not interfere with:

* clicks
* routing
* forms
* API calls
* loading
* state updates
* modals
* navigation

### Step 9

Run the project's lint/build/type checks.

### Step 10

Fix any issues introduced by the animation work.

---

# Final Instruction

Do not simply paste the Motion example code into CareerNext.

**Understand the existing UI first, then adapt the Motion concepts to the product.**

You have freedom to make your own animation decisions wherever they improve the UX.

Prioritize quality over quantity.

The final result should make CareerNext feel significantly more polished and alive while still remaining fast, professional, accessible, and easy to use.





these are example implementation :--> 

Add the following to this project. Adapt according to project styles: e.g. if the project uses Tailwind, adapt styles to use Tailwind etc. Install the referenced packages if not already installed. If code imports from motion-plus, install it by following the Motion+ installation guide at https://motion.dev/docs/react-motion-plus-installation (a Motion+ membership and access token are required).

```jsx
import * as motion from "motion/react-client"
import type { Variants } from "motion/react"

export default function ScrollTriggered() {
return (
<div style={container}>
{food.map(([emoji, hueA, hueB], i) => (
<Card i={i} emoji={emoji} hueA={hueA} hueB={hueB} key={emoji} />
))}
</div>
)
}

interface CardProps {
emoji: string
hueA: number
hueB: number
i: number
}

function Card({ emoji, hueA, hueB, i }: CardProps) {
const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`

return (
<motion.div
className={`card-container-${i}`}
style={cardContainer}
initial="offscreen"
whileInView="onscreen"
viewport={{ amount: 0.8 }}
>
<div style={{ ...splash, background }} />
<motion.div style={card} variants={cardVariants} className="card">
{emoji}
</motion.div>
</motion.div>
)
}

const cardVariants: Variants = {
offscreen: {
y: 300,
},
onscreen: {
y: 50,
rotate: -10,
transition: {
type: "spring",
bounce: 0.4,
duration: 0.8,
},
},
}

const hue = (h: number) => `hsl(${h}, 100%, 50%)`

/**
* ==============   Styles   ================
*/

const container: React.CSSProperties = {
margin: "100px auto",
maxWidth: 500,
paddingBottom: 100,
width: "100%",
}

const cardContainer: React.CSSProperties = {
overflow: "hidden",
display: "flex",
justifyContent: "center",
alignItems: "center",
position: "relative",
paddingTop: 20,
marginBottom: -120,
}

const splash: React.CSSProperties = {
position: "absolute",
top: 0,
left: 0,
right: 0,
bottom: 0,
clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
}

const card: React.CSSProperties = {
fontSize: 164,
width: 300,
height: 430,
display: "flex",
justifyContent: "center",
alignItems: "center",
borderRadius: 20,
background: "var(--white)",
boxShadow:
"0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 16px hsl(0deg 0% 0% / 0.075)",
transformOrigin: "10% 60%",
}

/**
* ==============   Data   ================
*/

const food: [string, number, number][] = [
["🍅", 340, 10],
["🍊", 20, 40],
["🍋", 60, 90],
["🍐", 80, 120],
["🍏", 100, 140],
["🫐", 205, 245],
["🍆", 260, 290],
["🍇", 290, 320],
]





Add the following to this project. Adapt according to project styles: e.g. if the project uses Tailwind, adapt styles to use Tailwind etc. Install the referenced packages if not already installed. If code imports from motion-plus, install it by following the Motion+ installation guide at https://motion.dev/docs/react-motion-plus-installation (a Motion+ membership and access token are required).

```jsx
"use client"

import { arc, motion, useAnimate, useMotionValue } from "motion/react"
import { useRef, useState } from "react"

/**
* ==============   Constants   ================
*/

const PRODUCT_SIZE = 160
const BASKET_BOX = 56
const FLY_SCALE = BASKET_BOX / PRODUCT_SIZE

type Direction = "auto" | "cw" | "ccw"

interface AddToBasketProps {
strength?: number
peak?: number
rotate?: number
duration?: number
basketVelocityFactor?: number
direction?: Direction
}

/**
* ==============   Components   ================
*/

export default function AddToBasket({
strength = 0.5,
peak = 0.15,
rotate = 0.9,
duration = 0.45,
basketVelocityFactor = 0.05,
direction = "cw",
}: AddToBasketProps = {}) {
const [scope, animate] = useAnimate()
const productRef = useRef<HTMLDivElement>(null)
const basketRef = useRef<HTMLDivElement>(null)
const ringRef = useRef<HTMLDivElement>(null)
const [isFlying, setIsFlying] = useState(false)
const productX = useMotionValue(0)
const productY = useMotionValue(0)

const addToBasket = async () => {
const product = productRef.current
const basket = basketRef.current
const ring = ringRef.current
if (!product || !basket || !ring || isFlying) return
setIsFlying(true)

const from = product.getBoundingClientRect()
const to = basket.getBoundingClientRect()
const dx = to.left + to.width / 2 - (from.left + from.width / 2)
const dy = to.top + to.height / 2 - (from.top + from.height / 2)

// Fly into the basket, shrinking to its size, then clip it away right
// at the end so it disappears into the basket.
await animate(
product,
{
x: dx,
y: dy,
scale: FLY_SCALE,
opacity: [1, 1, 0],
},
{
duration,
path: arc({
strength,
peak,
rotate,
direction: direction === "auto" ? undefined : direction,
}),
ease: [0.74, 0.18, 0.93, 0.69],
opacity: { inherit: true, times: [0, 0.95, 1] },
},
)

// Knock the basket up and to the right with an explicit impact
// velocity, then let a spring settle it back to rest.
animate(
basket,
{ x: 0, y: 0 },
{
type: "spring",
stiffness: 500,
damping: 12,
x: {
inherit: true,
velocity: productX.getVelocity() * basketVelocityFactor,
},
y: {
inherit: true,
velocity: productY.getVelocity() * basketVelocityFactor,
},
},
)

// Ripple an outline out from the basket as it takes the hit.
animate(
ring,
{ scale: [1, 2.2], opacity: [0.8, 0] },
{ duration: 0.5, ease: "easeOut" },
)

// Snap the now-invisible product back to its resting spot, ready to
// reappear.
animate(
product,
{
x: 0,
y: 0,
scale: 0.9,
rotate: 0,
opacity: 0,
clipPath: "inset(0%)",
},
{ duration: 0 },
)

// Bring a fresh product back into view, scaling in with a slight bounce.
await animate(
product,
{ opacity: 1, scale: 1 },
{
scale: { type: "spring", visualDuration: 0.4, bounce: 0.35 },
opacity: { duration: 0.25, ease: "easeOut" },
},
)

setIsFlying(false)
}

return (
<div ref={scope} style={stage}>
{/* Fill the sandbox so the basket sits in the true top-right. */}
<style>{`#sandbox { position: relative }`}</style>

<div ref={basketRef} style={basket}>
<motion.div ref={ringRef} style={ring} />
<BasketIcon />
</div>

<div style={center}>
<motion.div
ref={productRef}
style={{ ...product, x: productX, y: productY }}
>
<span style={glyph}>👟</span>
</motion.div>

<div style={meta}>
<span style={name}>Campus 00s</span>
<span style={price}>£128</span>
</div>

<motion.button
type="button"
onClick={addToBasket}
disabled={isFlying}
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
style={{
...button,
opacity: isFlying ? 0.55 : 1,
pointerEvents: isFlying ? "none" : "auto",
}}
>
Add to basket
</motion.button>
</div>
</div>
)
}

function BasketIcon() {
return (
<svg
xmlns="http://www.w3.org/2000/svg"
width="26"
height="26"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>
<path d="m15 11-1 9" />
<path d="m19 11-4-7" />
<path d="M2 11h20" />
<path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
<path d="M4.5 15.5h15" />
<path d="m5 11 4-7" />
<path d="m9 11 1 9" />
</svg>
)
}

/**
* ==============   Styles   ================
*/

const stage: React.CSSProperties = {
position: "absolute",
inset: 0,
display: "flex",
alignItems: "center",
justifyContent: "center",
overflow: "hidden",
fontFamily: "var(--font-mono)",
color: "var(--foreground)",
}

const basket: React.CSSProperties = {
position: "absolute",
top: 80,
right: 80,
width: BASKET_BOX,
height: BASKET_BOX,
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "var(--layer)",
border: "1px solid var(--border)",
color: "var(--accent)",
willChange: "transform",
}

const ring: React.CSSProperties = {
position: "absolute",
inset: -1,
border: "1px solid var(--accent)",
opacity: 0,
pointerEvents: "none",
willChange: "transform, opacity",
}

const center: React.CSSProperties = {
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: 18,
}

const product: React.CSSProperties = {
width: PRODUCT_SIZE,
height: PRODUCT_SIZE,
display: "flex",
alignItems: "center",
justifyContent: "center",
background: "var(--layer)",
border: "1px solid var(--border)",
willChange: "transform, opacity, clip-path",
}

const glyph: React.CSSProperties = {
fontSize: 84,
lineHeight: 1,
userSelect: "none",
}

const meta: React.CSSProperties = {
display: "flex",
alignItems: "baseline",
gap: 12,
fontFamily: "var(--font-mono)",
fontSize: 13,
letterSpacing: "0.04em",
}

const name: React.CSSProperties = {
color: "var(--foreground)",
}

const price: React.CSSProperties = {
color: "var(--accent)",
}

const button: React.CSSProperties = {
marginTop: 4,
padding: "13px 26px",
border: "none",
background: "var(--accent)",
color: "var(--background)",
fontFamily: "var(--font-mono)",
fontSize: 12,
letterSpacing: "0.12em",
textTransform: "uppercase",
cursor: "pointer",
}




Add the following to this project. Adapt according to project styles: e.g. if the project uses Tailwind, adapt styles to use Tailwind etc. Install the referenced packages if not already installed. If code imports from motion-plus, install it by following the Motion+ installation guide at https://motion.dev/docs/react-motion-plus-installation (a Motion+ membership and access token are required).

```jsx
"use client"

import type { Variants } from "motion/react"
import { stagger } from "motion/react"
import * as motion from "motion/react-client"
import { useEffect, useRef, useState } from "react"

export default function Variants() {
const [isOpen, setIsOpen] = useState(false)
const containerRef = useRef<HTMLDivElement>(null)
const { height } = useDimensions(containerRef)

return (
<div>
<div style={container}>
<motion.nav
initial={false}
animate={isOpen ? "open" : "closed"}
custom={height}
ref={containerRef}
style={nav}
>
<motion.div style={background} variants={sidebarVariants} />
<Navigation />
<MenuToggle toggle={() => setIsOpen(!isOpen)} />
</motion.nav>
</div>
</div>
)
}

const navVariants = {
open: {
transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) },
},
closed: {
transition: { delayChildren: stagger(0.05, { from: "last" }) },
},
}

const Navigation = () => (
<motion.ul style={list} variants={navVariants}>
{[0, 1, 2, 3, 4].map((i) => (
<MenuItem i={i} key={i} />
))}
</motion.ul>
)

const itemVariants = {
open: {
y: 0,
opacity: 1,
transition: {
y: { stiffness: 1000, velocity: -100 },
},
},
closed: {
y: 50,
opacity: 0,
transition: {
y: { stiffness: 1000 },
},
},
}

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF", "#4400FF"]

const MenuItem = ({ i }: { i: number }) => {
const border = `2px solid ${colors[i]}`
return (
<motion.li
style={listItem}
variants={itemVariants}
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
>
<div style={{ ...iconPlaceholder, border }} />
<div style={{ ...textPlaceholder, border }} />
</motion.li>
)
}

const sidebarVariants: Variants = {
open: (height = 1000) => ({
clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
transition: {
type: "spring",
stiffness: 20,
restDelta: 2,
},
}),
closed: {
clipPath: "circle(30px at 40px 40px)",
transition: {
delay: 0.2,
type: "spring",
stiffness: 400,
damping: 40,
},
},
}

interface PathProps {
d?: string
variants: Variants
transition?: { duration: number }
}

const Path = (props: PathProps) => (
<motion.path
fill="transparent"
strokeWidth="3"
stroke="hsl(0, 0%, 18%)"
strokeLinecap="round"
{...props}
/>
)

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
<button style={toggleContainer} onClick={toggle}>
<svg width="23" height="23" viewBox="0 0 23 23">
<Path
variants={{
closed: { d: "M 2 2.5 L 20 2.5" },
open: { d: "M 3 16.5 L 17 2.5" },
}}
/>
<Path
d="M 2 9.423 L 20 9.423"
variants={{
closed: { opacity: 1 },
open: { opacity: 0 },
}}
transition={{ duration: 0.1 }}
/>
<Path
variants={{
closed: { d: "M 2 16.346 L 20 16.346" },
open: { d: "M 3 2.5 L 17 16.346" },
}}
/>
</svg>
</button>
)

/**
* ==============   Styles   ================
*/

const container: React.CSSProperties = {
position: "relative",
display: "flex",
justifyContent: "flex-start",
alignItems: "stretch",
flex: 1,
width: 500,
maxWidth: "100%",
height: 400,
backgroundColor: "var(--accent)",
borderRadius: 20,
overflow: "hidden",
}

const nav: React.CSSProperties = {
width: 300,
}

const background: React.CSSProperties = {
backgroundColor: "var(--white)",
position: "absolute",
top: 0,
left: 0,
bottom: 0,
width: 300,
}

const toggleContainer: React.CSSProperties = {
outline: "none",
border: "none",
WebkitUserSelect: "none",
MozUserSelect: "none",
cursor: "pointer",
position: "absolute",
top: 18,
left: 15,
width: 50,
height: 50,
borderRadius: "50%",
background: "transparent",
}

const list: React.CSSProperties = {
listStyle: "none",
padding: 25,
margin: 0,
position: "absolute",
top: 80,
width: 230,
}

const listItem: React.CSSProperties = {
display: "flex",
alignItems: "center",
justifyContent: "flex-start",
padding: 0,
margin: 0,
listStyle: "none",
marginBottom: 20,
cursor: "pointer",
}

const iconPlaceholder: React.CSSProperties = {
width: 40,
height: 40,
borderRadius: "50%",
flex: "40px 0",
marginRight: 20,
}

const textPlaceholder: React.CSSProperties = {
borderRadius: 5,
width: 200,
height: 20,
flex: 1,
}

/**
* ==============   Utils   ================
*/

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
const dimensions = useRef({ width: 0, height: 0 })

useEffect(() => {
if (ref.current) {
dimensions.current.width = ref.current.offsetWidth
dimensions.current.height = ref.current.offsetHeight
}
}, [ref])

return dimensions.current
}




Add the following to this project. Adapt according to project styles: e.g. if the project uses Tailwind, adapt styles to use Tailwind etc. Install the referenced packages if not already installed. If code imports from motion-plus, install it by following the Motion+ installation guide at https://motion.dev/docs/react-motion-plus-installation (a Motion+ membership and access token are required).

```jsx
"use client"

import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect } from "react"

export default function HTMLContent() {
const count = useMotionValue(0)
const rounded = useTransform(() => Math.round(count.get()))

useEffect(() => {
const controls = animate(count, 100, { duration: 5 })
return () => controls.stop()
}, [])

return (
<motion.div
style={{
fontFamily: "var(--font-mono)",
fontSize: 64,
lineHeight: 1,
color: "var(--hue-6)",
}}
>
{rounded}
</motion.div>
)
}



