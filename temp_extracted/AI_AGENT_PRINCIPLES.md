# AI Agent Principles — Fantasy Football App

**Purpose:** Single source of truth for every AI agent working on this project (coding, design, audit, refactor). When in doubt, this file wins over any other instruction.

**How to read this:** Three layers, top to bottom. Higher layers govern lower layers when they conflict.

- **Layer 1 — How to Think** (Karpathy's principles, adapted): Universal reasoning rules for any task.
- **Layer 2 — What to Build** (Design System): The color, material, and interaction rules for this specific app.
- **Layer 3 — How to Verify** (Audit Protocol): The procedure for confirming compliance and grilling on uncertainty.

---

# LAYER 1 — HOW TO THINK

These principles apply to every task, every agent, every change. Adapted from Karpathy's CLAUDE.md.

## 1. Think Before Acting

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing anything:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

**For design work specifically:** If a screen, component, or state isn't covered by the design system, do NOT invent a treatment. Stop and grill (see Layer 3).

## 2. Simplicity First

Minimum work that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No new themes, materials, or color roles unless explicitly requested.
- No error handling for impossible scenarios.
- If you wrote 200 lines and it could be 50, rewrite it.

**Spirit clause for design work:** When defining a component, specify all its standard states (rest, hover, pressed, focused, disabled, loading, error, empty) — these are part of the component itself, not feature creep. But don't invent NEW components that weren't asked for.

**The test:** Would a senior engineer say this is overcomplicated? If yes, simplify.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code or design:
- Don't "improve" adjacent code, comments, formatting, or styling.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code or deprecated patterns, **mention them — don't fix them silently.**

When your changes create orphans:
- Remove imports/variables/functions/styles that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform vague tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Match the design system" → "Audit each component, score compliance, fix until 100%"

For multi-step tasks, state a brief plan up front:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. These Principles Are Working If...

- Fewer unnecessary changes in diffs
- Fewer rewrites due to overcomplication
- Clarifying questions come BEFORE implementation, not after mistakes
- The agent stops when uncertain instead of guessing

---

# LAYER 2 — WHAT TO BUILD (DESIGN SYSTEM)

The canonical design system for this fantasy football app. These rules govern every visual decision.

## Color Palette & Roles

| Color | Hex | Role |
|---|---|---|
| Pylon Orange | `#FF5722` | Primary action CTAs only |
| Penalty-Flag Yellow | `#FFC107` | Attention indicators, stars/favorites, focus rings, slider fills, achievement markers |
| Chalk White | `#F4F5F7` | Structure, dividers, active filter fills, active input outlines |
| Chrome Silver | `#9EA7B0` | Secondary button outlines, inactive filters, destructive-action outlines, neutral chrome |
| Pigskin Brown | `#6B3615` | Content surfaces ONLY (cards, panels, navigation trays, frames) — NEVER an interactive button |
| Deep Field Green | `#1F4712` | Primary background |
| Deep Graphite | `#1A1D21` | Premium card backgrounds (recap screen) |

## The 12 Governing Principles

1. **One color per meaning** — never reuse a color for two meanings.
2. **Luminance contrast drives hierarchy**, not hue. Dark-on-dark is mush regardless of color.
3. **Materials map to roles** — brown = content, silver = chrome, white = structure.
4. **States change via overlays and motion**, not color identity shifts.
5. **Destructive actions are visually quiet, interactively loud** — require confirmation, never make them the brightest thing on screen.
6. **The metaphor is flavor, not foundation** — football textures season the UI, they don't carry function.
7. **Group secondary actions in containers; let primary actions float free.**
8. **Inputs are quiet at rest, expressive when engaged.** Different interaction types deserve different visual languages.
9. **Controls that show quantity should make the quantity visible.** Fill = data, track = container.
10. **Attention states should escalate, not start at maximum.** Reserve loudest treatments for true urgency.
11. **Material themes frame content, they don't flood it.** Use material as accent, not wallpaper.
12. **Use color to encode evaluation.** Gold = achievement. Silver = neutral. Color is information.

## Universal Interaction States

Apply to every interactive element unless overridden:

- **Hover (desktop):** 6-8% white overlay on dark surfaces, 6-8% black overlay on light surfaces.
- **Pressed/Active:** 12-16% overlay (darker than hover) + 1-2px translate-Y for physical depression.
- **Focused (keyboard nav):** 2px Penalty-Yellow outline at 2px offset. Required for accessibility, not optional.
- **Disabled:** 40% opacity, no hover/pressed states.

## Component-Specific Rules

See companion guidance documents (rounds 1 and 2) for full component breakdowns. Key rules summarized:

- **Primary CTAs:** Pylon Orange fill, white text. Reserved for top-priority action per screen.
- **Secondary buttons:** 1.5px Chrome Silver outline, transparent fill, silver text. Never solid silver.
- **Tertiary buttons:** Text-only, Chalk White, no border.
- **Destructive buttons:** Chrome Silver outline (NOT orange), require confirmation modal.
- **Stars/favorites:** Yellow fill when active, silver outline when inactive.
- **Sliders:** Yellow filled portion, silver inactive portion, white handle.
- **Active filter chips:** Chalk White fill, dark text.
- **Inactive filter chips:** Transparent fill, Chrome Silver outline.
- **Search bars:** Silver outline at rest, white outline when focused, never solid white.
- **Roster cards:** Pigskin Brown with subtle inner highlight at top edge.
- **Recap swiper cards:** Deep Graphite background with Pigskin Brown border (NOT solid brown).
- **On-the-clock banner:** Green background, pulsing yellow dot, escalates to orange under 15 seconds.
- **Achievement grades:** Gold for A range, yellow at 85% saturation for B range, silver for C and below.

---

# LAYER 3 — HOW TO VERIFY (AUDIT PROTOCOL)

When auditing the app for design system compliance, follow this protocol.

## Mission

Audit every screen, component, state, and interaction. Achieve 100% compliance with Layer 2. Run up to 100,000 simulated passes, OR stop early when 100% compliance is reached, OR stop when a blocking question is raised.

## Audit Scope — 10 Categories

Every pass must check all of:

1. **Page backgrounds** — every route, modal, drawer, sheet, popover, loading state, empty state, error page, 404, onboarding, auth.
2. **Buttons (all variants)** — primary, secondary, tertiary, icon, FAB, destructive, plus all four interaction states.
3. **Form controls** — inputs, search, dropdowns, sliders, toggles, checkboxes, radios, date pickers, steppers.
4. **Navigation** — header, tab bar, side nav, breadcrumbs, back buttons, segmented controls, pagination.
5. **Content surfaces** — player cards, roster cards, matchup cards, news cards, leaderboard rows, recap cards, settings rows, list items.
6. **Status & feedback** — banners, timers, toasts, errors, success messages, spinners, progress bars, badges, grades.
7. **Data visualization** — charts, stat displays, comparison tables, rankings, filter chips.
8. **Typography** — heading colors (H1-H6), body, secondary, captions, links (all states), disabled, error, success.
9. **Borders & dividers** — section, list item, card, input (all states), decorative.
10. **Shadows & depth** — card elevations, modal shadows, button depressions, floating shadows.

## The Audit Loop

For each pass:

1. **Enumerate** — list every UI element in scope. No skipping.
2. **Classify** — determine each item's semantic role (action, attention, structure, content, chrome).
3. **Compare** — match against Layer 2 rules. Score each as:
   - **COMPLIANT** — exact match to spec.
   - **MINOR DEVIATION** — wrong shade, opacity, or border width but correct color role.
   - **MAJOR DEVIATION** — wrong color role entirely.
   - **UNCOVERED** — no spec exists for this element.
4. **Escalate or fix:**
   - COMPLIANT → log and move on.
   - MINOR DEVIATION → auto-correct ONLY if the fix is a 1:1 match to an existing spec (e.g., `#B0B0B0` border → `#9EA7B0` Chrome Silver). Log the change.
   - MAJOR DEVIATION → do NOT auto-correct. Flag for grilling.
   - UNCOVERED → STOP. Issue a grilling question.
5. **Tally** — calculate compliance %. If 100%, stop. Otherwise continue.

## The Grilling Protocol

When ANY of these occur:
- A component isn't covered by Layer 2
- Two principles could apply and conflict
- A new screen/feature has no color spec
- An interaction state isn't defined
- A color value is ambiguous between two design system colors
- A major deviation requires judgment to fix

...the agent MUST stop and grill the human with this format:

```
CONTEXT:
  [Where the question lives — page, component, interaction]

THE AMBIGUITY:
  [Plain-language description of what's unclear]

PRINCIPLES IN TENSION (if applicable):
  [Which of the 12 principles could apply and how they conflict]

PROPOSED OPTIONS (2-3):
  Option A: [Specific treatment + reasoning]
  Option B: [Specific treatment + reasoning]
  Option C: [Specific treatment + reasoning, if applicable]

RECOMMENDATION:
  [The option you'd lean toward and why — but still wait for approval]

IMPACT IF UNDECIDED:
  [What downstream work is blocked]
```

**Rules for grilling:**
- One cohesive question per stop (group related sub-questions when possible).
- Always provide options — never ask open-ended "what do you want?"
- Always show your recommendation if you have one.
- Wait for explicit human approval before resuming.
- Log every answer permanently into Layer 2 — never ask the same question twice.

## Termination & Reporting

Stop when (whichever first):
1. 100% compliance achieved across all 10 categories.
2. 100,000 passes completed.
3. Blocking grilling question raised.

On termination, produce a final report with:
- Total passes executed
- Final compliance percentage
- Per-category breakdown
- All auto-corrections made
- All remaining gaps
- All grilling questions raised + how they were resolved
- Updated Layer 2 spec reflecting new decisions

---

# HARD RULES — NEVER VIOLATE

Pulled from across all three layers. If any of these conflict with another instruction, these win.

1. **Never guess.** If unsure, stop and ask.
2. **Never hide confusion.** Name what's unclear.
3. **Never expand scope silently.** Touch only what was asked.
4. **Never invent a color, theme, or component** not specified in Layer 2 without grilling first.
5. **Never let two colors mean the same thing** in the system.
6. **Never let one color mean two different things** in the system.
7. **Never use color identity shifts as state changes** — overlays and motion only.
8. **Never make destructive actions the loudest element** on screen.
9. **Never flood content with material** — material frames, doesn't fill.
10. **Never start an attention state at maximum intensity** — leave room to escalate.
11. **Never declare an audit complete** without verifying all 10 categories.
12. **Never ask the same question twice** — extend the spec when answered.

---

# WHEN PRINCIPLES CONFLICT

If two principles seem to contradict each other on a given task:

1. **Higher layer wins.** Layer 1 > Layer 2 > Layer 3.
2. **Within a layer, hard rules win** over softer guidance.
3. **When still unclear, grill the human.** Don't pick silently.

Example: The audit protocol says "investigate every nook and cranny." Karpathy's principles say "touch only what you must." These don't actually conflict — investigation is in-scope work (it's the task itself), and "touch only what you must" applies to making changes, not to checking things. But if you're ever unsure which applies, grill.

---

# END OF PRINCIPLES

Last updated: based on rounds 1 and 2 of design guidance, plus Karpathy CLAUDE.md framework. Extend this document as new decisions are made — never let it go stale.
