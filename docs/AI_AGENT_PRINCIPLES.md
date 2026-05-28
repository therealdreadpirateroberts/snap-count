# AI Agent Principles — MockMaxxing
*Version 2.1 (May 2026 — Light Mode Edition, Seven-Expert Frame Added)*

**Purpose:** Single source of truth for every AI agent working on this project (coding, design, audit, refactor). When in doubt, this file wins over any other instruction.

**How to read this:** Three layers, top to bottom. Higher layers govern lower layers when they conflict.

- **Layer 1 — How to Think** (Karpathy's principles, adapted): Universal reasoning rules for any task.
- **Layer 2 — What to Build** (Design System): The color, material, and interaction rules for this specific app.
- **Layer 3 — How to Verify** (Audit Protocol): The procedure for confirming compliance and grilling on uncertainty.

---

## LAYER 1 — HOW TO THINK

These principles apply to every task, every agent, every change. Adapted from Karpathy's CLAUDE.md.

### 1. Think Before Acting

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing anything:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

For design work specifically: If a screen, component, or state isn't covered by the design system, do NOT invent a treatment. Stop and grill (see Layer 3).

### 2. Simplicity First

Minimum work that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No new themes, materials, or color roles unless explicitly requested.
- No error handling for impossible scenarios.
- If you wrote 200 lines and it could be 50, rewrite it.

**Spirit clause for design work:** When defining a component, specify all its standard states (rest, hover, pressed, focused, disabled, loading, error, empty) — these are part of the component itself, not feature creep. But don't invent NEW components that weren't asked for.

The test: Would a senior engineer say this is overcomplicated? If yes, simplify.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code or design:

- Don't "improve" adjacent code, comments, formatting, or styling.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code or deprecated patterns, mention them — don't fix them silently.

When your changes create orphans:

- Remove imports/variables/functions/styles that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

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

### 5. Structured Interactive Clarification (Mandatory Communication Law)

Whenever you (the agent) receive visual feedback, design reviews, or encounter layout ambiguities:
- **Do not ask open-ended questions** (e.g., "what should we change?" or "how do you want this styled?").
- **Do evaluate the context, compile concrete options, and present structured Multiple-Choice choices** (Option A, Option B, Option C).
- **Proactively state a recommended option first** (labeled as `(Recommended)`), explaining why it aligns with MockMaxxing's design laws.
- **Format options clearly** as direct visual choices or user actions, enabling the user to respond simply with a single letter (e.g., "a", "b", "c") or make selections using interactive tooling.
- This multiple-choice structure minimizes cognitive friction, guarantees rapid feedback cycles, and aligns developer choices strictly to the project's brand canon.

### 6. The Seven-Expert Frame (Required on Analytical Phases)

When working on **Discovery** or **Investigation** phases of any non-trivial initiative, you MUST analyze the problem through seven distinct expert perspectives. Each expert must contribute observations specific to their domain. Do not collapse the perspectives into one homogeneous voice — the value of the frame is that different experts notice different things.

**The default expert roster:**

1. **Product Owner** — What is the user-visible impact? Does this serve the core problem (helping serious drafters max out their draft potential)? Is this consistent with PRODUCT_VISION's "what MockMaxxing is NOT" list?
2. **Domain Expert (Fantasy Football)** — Does this reflect how real fantasy football works? Are draft strategies, scoring formats, position scarcity, and league norms handled correctly?
3. **Predictive Analytics Modeler** — Are projections, variances, and probabilities being modeled with statistical honesty? Are point estimates being presented as if they were certainties?
4. **Multi-Agent ML/RL Engineer** — Are bot opponents behaving like distinct agents with coherent strategies? Are learning loops sound? Are mutations bounded and reversible?
5. **Behavioral Economist / Sports Psychologist** — How will real users perceive and react to this? Are we creating false-confidence signals, misleading consensus framings, or anchoring effects?
6. **Systems Architect** — Are the data flows, state mutations, and persistence layers clean? Are there race conditions, hidden globals, or coupling problems?
7. **Data Engineer** — Where does the data come from, how is it ingested, how is it validated, and how does it stay current? Is anything seeded or hardcoded that should be live?

**Rules for the frame:**

- **Always include all seven** unless the initiative explicitly calls for a swapped roster (e.g., adding a Statistician for variance work, a UX Writer for copy work). Roster changes must be declared in the prompt, not silently dropped.
- **Each expert must produce something** — at minimum one observation, concern, or recommendation specific to their domain. If an expert has nothing to say, state that explicitly ("Data Engineer: no concerns in this scope") rather than omitting them silently.
- **Experts can disagree.** When two experts surface conflicting recommendations, surface the conflict as a multiple-choice decision per Section 5. Do not paper over disagreement with a synthesized middle position.
- **The user appreciates honest pushback from experts.** If an expert thinks the proposed direction is wrong, say so directly. The expert frame is not a rubber-stamping exercise.

**When the frame applies:**

- **REQUIRED:** Discovery phase prompts (read-only audits, "what's here, what's broken").
- **REQUIRED:** Investigation phase prompts (confirming whether suspected issues are real).
- **REQUIRED:** Fix-mapping phase prompts (surfacing tradeoffs and decisions as multiple-choice).

**When the frame does NOT apply:**

- **NOT REQUIRED:** Implementation phase prompts (executing decisions already made).
- **NOT REQUIRED:** Correction phase prompts (surgical edits to fix specific issues identified in verification).
- **NOT REQUIRED:** Verification phase prompts (read-only confirmation that implementation matches spec).

Including the frame on surgical execution prompts produces ceremonial output, not insight. The rule is legible: analytical phases get the frame; mechanical phases don't.

### 7. These Principles Are Working If...

- Fewer unnecessary changes in diffs
- Fewer rewrites due to overcomplication
- Clarifying questions come BEFORE implementation, not after mistakes
- The agent stops when uncertain instead of guessing
- Discovery and Investigation reports surface domain-specific concerns from multiple expert lenses, not generic engineering observations

---

## LAYER 2 — WHAT TO BUILD (DESIGN SYSTEM)

The canonical design system for MockMaxxing. These rules govern every visual decision.

### The product feel, in one sentence

**MockMaxxing should feel like a premium analytics tool with sport-broadcast accents on the moments that matter.** Clean, dashboard-grade, information-dense most of the time — with kinetic flares of color when something *happens* (a pick comes in, the clock starts running, an A-grade lands).

The whole color system flows from that. Most surfaces are light and quiet so the user can work. A few surfaces are heavy and dark on purpose, because the user has stopped working and is receiving something.

---

### The palette

| Color | Hex | What it means |
| :--- | :--- | :--- |
| **Chalk White** | `#F4F5F7` | The base canvas. Every page sits on this. |
| **Obsidian Black** | `#0c0c0c` | Primary text. Headings, body, and any text inside yellow fills. |
| **Deep Graphite** | `#1A1D21` | **Ceremonial dark surfaces only.** See the principle below. |
| **liftedCanvas** | `#E8EAED` | Sliding panels — bottom sheets, modals, drawer navigation. Seamlessness with the canvas, not contrast. |
| **Lifted Charcoal** | `#4a4a4a` | Sub-panels nested *inside* Deep Graphite cards. Only used there. |
| **Mid-Gray** | `#64748b` | Structural chrome. Button outlines, dividers, slider tracks, input outlines, active selector borders. |
| **Slate** | `#475569` | Textual chrome. Secondary text, timestamps, bye-week labels, inactive states. |
| **Pylon Orange** | `#FF5722` | "Press this." Primary CTAs, focus rings, clock urgency under 15 seconds. Action only. |
| **Hall of Fame Yellow** | `#FFCD00` | "This is yours / premium." User position badges, favorite toggles, A-grade medals, board row highlights. State, not action — users recognize yellow, they don't click it. |
| **Pigskin Brown** | `#6B3615` | Football flourish. Card border trim, accents. Never a surface or button fill. |
| **Deep Field Green** | `#1F4712` | On-the-clock banner backdrop and small specialty accents only. Never a background. |

#### Premium Glow & Overlay Accents (Technical Assets)

- **Deep Field Green Glow** — `rgba(31, 71, 18, 0.14)` (Radial glow highlights behind brand elements on the home screen)
- **Pylon Orange Glow** — `rgba(255, 87, 34, 0.07)` (Radial glow highlights behind action blocks on the home screen)
- **High Contrast Inactive** — `#cbd5e1` (Inactive icons and tab selection navigation states)

---

### The big principle: ceremonial vs. working surfaces

This is the rule that decides where dark surfaces live and where they don't.

#### Working surfaces (most of the app)

A working surface is where the user *does the job* — scanning, comparing, filtering, deciding. The user's eyes dart across the page. Information density is high. Dwell time on any one element is low.

**Working surfaces stay light.** Chalk White canvas, Obsidian Black text, Mid-Gray chrome doing the structural work.

The reason: a dark surface on a working page reads as oppressive because the user is being asked to *look at* something while they're trying to *look through* it.

**These are working surfaces:**
- Home page (every tile, every section)
- Rankings page (every row, every filter)
- Active draft page (player list, position chips, search bar, tab row)
- Settings / Account
- Inbox
- Search inputs
- Sticky headers and tab bars on every page

#### Ceremonial surfaces (a few specific moments)

A ceremonial surface is where the user *receives a verdict* — the draft is done, the grade has landed, the moment is the point. The user has stopped scanning. Dwell time is high. The surface is meant to be looked *at*, not *through*.

**Ceremonial surfaces use Deep Graphite.** The dark surface against the light canvas reads as a framed object — a premium thing embedded on the page, like a 1970s baseball card in a clean album.

**These are ceremonial surfaces:**
- Recap trading card (the textbook example)
- Roster swiper / draft summary cards (semi-ceremonial — the user is reviewing their own work)
- Achievement / grade moments embedded anywhere (A+ badges, completion tiles)

#### The two-question test

For any new surface, ask:

1. **Is the user working or receiving?**
2. **Is this surface a frequent visitor or a rare event?**

Working + frequent → light. Receiving + rare → Deep Graphite earns its weight.

---

### How the colors work together

#### On working (light) surfaces:
- **Canvas:** Chalk White
- **Text:** Obsidian Black (primary), Slate (secondary)
- **Outlines & dividers:** Mid-Gray, at least 1.5px thick (anything thinner disappears on white)
- **Action buttons:** Pylon Orange fill with Chalk White text
- **State indicators (favorites, "your pick," premium):** Hall of Fame Yellow fill with Obsidian Black text inside
- **Football flourishes:** Pigskin Brown for trim and borders only — never a fill

#### On ceremonial (Deep Graphite) surfaces:
- **Surface:** Deep Graphite
- **Text:** Chalk White (primary), light grays for meta
- **Nested sub-panels:** Lifted Charcoal (one shade lighter than the parent)
- **Border trim:** Pigskin Brown — this is where the trading-card feel comes from
- **Grade badges, "your pick" callouts:** Hall of Fame Yellow fill with Obsidian Black text inside

---

### Hard rules (these are not negotiable)

1. **No yellow text on white.** Yellow is fill-only with Obsidian Black text inside. Yellow text on white has roughly 1.4:1 contrast — basically invisible.
2. **No green backgrounds.** Deep Field Green lives in the on-the-clock banner and small specialty accents only. Never a button fill, never a page background.
3. **No Pigskin Brown surfaces.** Brown is trim and flourish only. Never fill a card or button with it.
4. **No translucency or glassmorphism on sticky headers.** Solid backgrounds only — Chalk White (preferred) or Deep Graphite (only if the surface is genuinely ceremonial, which is rare).
5. **Structural chrome must be at least 1.5px thick** on light surfaces. Thinner outlines disappear on Chalk White.
6. **Deep Graphite ≠ liftedCanvas.** They look similar in name but do opposite work:
   - Deep Graphite = static, dark, embedded, framed object (recap card)
   - liftedCanvas = sliding, light, seamless with the page (bottom sheets, modals)
7. **Pylon Orange is for action. Hall of Fame Yellow is for state.** Never use orange for "this is yours" or yellow for "press this." Users learn this instinctively after one session.

---

### Component cheat sheet

- **Primary CTA buttons** — Pylon Orange fill, Chalk White text (Reserved for top-priority action per screen)
- **Secondary buttons** — Transparent fill, 1.5px Mid-Gray border, Obsidian Black text (Never solid Mid-Gray fill)
- **Tertiary buttons** — Text-only Obsidian Black, no border
- **Destructive buttons** — 1.5px Mid-Gray border (not orange — destructive is not an action to encourage), Obsidian Black text
- **Active filter chips** — Solid Obsidian Black fill, Chalk White text
- **Inactive filter chips** — Transparent, 1.5px Mid-Gray outline, Slate label
- **Search inputs** — 1.5px Mid-Gray border at rest, solid Pylon Orange when focused
- **Sliders** — Hall of Fame Yellow filled track, Mid-Gray inactive track, Chalk White handle with Mid-Gray border
- **User position badge** — Hall of Fame Yellow fill, Obsidian Black text
- **Recap trading cards (Roster / Swiper cards)** — Deep Graphite surface, Pigskin Brown border trim, Chalk White text inside
- **Sticky headers & tab bars** — Solid Chalk White (this is the default and the right answer almost every time)
- **Persistent "MOCK NOW" CTA (Pill Button):** If a persistent floating Mock Now button is rendered on any page, it must have a fixed size (`width: 140`, `height: 48`), `borderRadius: 24`, a 1.5px `borderWidth`, and be absolutely positioned in the exact same layout coordinates (`bottom: 96` / `104` on iOS, and `right: 16` or `Spacing.three`), utilizing Pylon Orange fill with Chalk White text.
- **On-the-clock banner:** Deep Field Green background, pulsing Chalk White dot, escalates to Pylon Orange under 15 seconds, glow under 5 seconds.
- **Sliding Panels & Bottom Sheets:** Must use solid **liftedCanvas `#E8EAED`** as their primary container background.
- **Achievement grades (A-tier):** Hall of Fame Yellow fill, Obsidian Black text.
- **Achievement grades (B-tier):** Hall of Fame Yellow at ~65% opacity, Obsidian Black text.
- **Achievement grades (C and below):** Mid-Gray fill, Obsidian Black text.
- **Stars/favorites:** Hall of Fame Yellow fill when active, Mid-Gray outline when inactive.

---

### Universal interaction states

- **Hover (desktop):** 6–8% black overlay on light surfaces, 6–8% white overlay on Deep Graphite surfaces
- **Pressed / tap-active:** 12–16% darker overlay plus a 1–2px downward translate (haptic press feeling)
- **Keyboard focused:** 2px solid Pylon Orange focus ring at 2px offset
- **Disabled:** 40% opacity, non-reactive

---

### What's been retired (do not use)

- Chrome Silver `#9EA7B0` — replaced by Mid-Gray `#64748b`
- Penalty-Flag Yellow `#FFC107` — replaced by Hall of Fame Yellow `#FFCD00`
- Champagne Bronze `#bea98e` — gone
- Indianapolis Colts Navy `#002C5F` — gone
- Deep Field Green `#1F4712` as primary background — now specialty gridiron banner background only.
- Pigskin Brown `#6B3615` as content surface — now accent flourish (borders, badges, trim) only.

The MockMaxxing Bible (MOCKMAXXING_BIBLE.md) Version 1.0 is **deprecated**. Its Champagne Bronze CTA, Obsidian Elegance palette, and Triple-Core contrast specs do NOT apply. The Bible's Starbucks-inspired LAYOUT language IS kept (segmented capsule switchers, sticky scrolling, swiping cards, sheet slides, premium tile sizing, rewards-card-style components) — only its palette is rejected.

---

### Quick reference: where does Deep Graphite go?

| Surface | Working or Ceremonial? | Deep Graphite? |
| :--- | :--- | :--- |
| Home page tiles | Working | ❌ Stay light |
| Rankings page | Working | ❌ Stay light |
| Active draft page | Working | ❌ Stay light |
| Settings / Account | Working | ❌ Stay light |
| Search inputs | Working | ❌ Stay light |
| Sticky headers | Working | ❌ Stay light (Chalk White) |
| Recap trading card | Ceremonial | ✅ Yes |
| Roster swiper cards | Semi-ceremonial | ✅ Yes |
| A+ grade / achievement badges | Ceremonial | ✅ Yes |
| Bottom sheets / modals | Sliding, not ceremonial | ❌ Use liftedCanvas instead |

---

### A note on "heaviness"

If a Deep Graphite surface ever feels too heavy or harsh against the white canvas, the first move is **not** to lighten the color. It's to soften how the surface lands on the page:

- Larger border radius (12–16px instead of 8px)
- Soft outer shadow to blur the edge against the canvas
- Thin Pigskin Brown border trim to break the hard color cutout
- Generous internal padding so the dark surface has room to breathe

If after all of that the surface still feels harsh, *then* it's worth revisiting whether the surface should be ceremonial at all. Usually the answer is that the dark surface was being used on a working page where it didn't belong.

---

## LAYER 3 — HOW TO VERIFY (AUDIT PROTOCOL)

When auditing the app for design system compliance, follow this protocol.

### Mission

Audit every screen, component, state, and interaction. Achieve 100% compliance with Layer 2. Run up to 100,000 simulated passes, OR stop early when 100% compliance is reached, OR stop when a blocking question is raised.

### Audit Scope — 10 Categories

Every pass must check all of:

1. **Page backgrounds** — every route, modal, drawer, sheet, popover, loading state, empty state, error page, 404, onboarding, auth.
2. **Buttons (all variants)** — primary, secondary, tertiary, icon, FAB, destructive, plus all four interaction states.
3. **Form controls** — inputs, search, dropdowns, sliders, toggles, checkboxes, radios, date pickers, steppers.
4. **Navigation** — header, tab bar, side nav, breadcrumbs, back buttons, segmented controls, pagination.
5. **Content surfaces** — player cards, roster cards, matchup cards, news cards, leaderboard rows, draft badges, settings rows, list items.
6. **Status & feedback** — banners, timers, toasts, errors, success messages, spinners, progress bars, badges, grades.
7. **Data visualization** — charts, stat displays, comparison tables, rankings, filter chips.
8. **Typography** — heading colors (H1-H6), body, secondary, captions, links (all states), disabled, error, success.
9. **Borders & dividers** — section, list item, card, input (all states), decorative.
10. **Shadows & depth** — card elevations, modal shadows, button depressions, floating shadows.

### The Audit Loop

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
   - MINOR DEVIATION → auto-correct ONLY if the fix is a 1:1 match to an existing spec (e.g., `#B0B0B0` border → `#64748b` Mid-Gray). Log the change.
   - MAJOR DEVIATION → do NOT auto-correct. Flag for grilling.
   - UNCOVERED → STOP. Issue a grilling question.
5. **Tally** — calculate compliance %. If 100%, stop. Otherwise continue.

### The Grilling Protocol

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

Rules for grilling:

- One cohesive question per stop (group related sub-questions when possible).
- Always provide options — never ask open-ended "what do you want?"
- Always show your recommendation if you have one.
- Wait for explicit human approval before resuming.
- Log every answer permanently into Layer 2 — never ask the same question twice.

### Termination & Reporting

Stop when (whichever first):

- 100% compliance achieved across all 10 categories.
- 100,000 passes completed.
- Blocking grilling question raised.

On termination, produce a final report with:

- Total passes executed
- Final compliance percentage
- Per-category breakdown
- All auto-corrections made
- All remaining gaps
- All grilling questions raised + how they were resolved
- Updated Layer 2 spec reflecting new decisions

---

## HARD RULES — NEVER VIOLATE

Pulled from across all three layers. If any of these conflict with another instruction, these win.

1. Never guess. If unsure, stop and ask.
2. Never hide confusion. Name what's unclear.
3. Never expand scope silently. Touch only what was asked.
4. Never invent a color, theme, or component not specified in Layer 2 without grilling first.
5. Never let two colors mean the same thing in the system.
6. Never let one color mean two different things in the system.
7. Never use color identity shifts as state changes — overlays and motion only.
8. Never make destructive actions the loudest element on screen.
9. Never flood content with material — material frames, doesn't fill.
10. Never start an attention state at maximum intensity — leave room to escalate.
11. Never declare an audit complete without verifying all 10 categories.
12. Never ask the same question twice — extend the spec when answered.
13. Never use Deep Field Green as a background. It is the on-the-clock specialty color only.
14. Never use Pigskin Brown as a content surface. It is a flourish (borders, badges, trim) only.
15. Never refer to the Champagne Bronze CTA, Obsidian Elegance palette, or Triple-Core framework from the deprecated MockMaxxing Bible.
16. Never skip the Seven-Expert Frame on Discovery, Investigation, or Fix-mapping phase prompts. Each of the seven experts must produce at least one domain-specific observation, even if it's an explicit "no concerns in this scope."

### Hard Rule #17 — No Decorative Emojis in User-Facing UI

No emojis are permitted in any user-facing UI surface. This includes:
- JSX text content (e.g., `<Text>WELCOME 🏈</Text>`)
- String literals passed to `accessibilityLabel`, `title`, `placeholder`, button labels, modal titles, screen titles
- Toast and alert messages (even ephemeral ones surfaced to users)
- Any data field that renders as an avatar, icon, or visual element on screen
- Telemetry strings surfaced in user-visible log panels (e.g., the admin training log on `/algo-admin`)

The following Unicode glyphs are PERMITTED as functional UI affordances, NOT as decorative emojis:
- ✕ (U+2715) — close/dismiss affordances
- ✓ (U+2713) — checkmark / metric-success bullets
- ⚠ (U+26A0) and ⚠️ (U+26A0 U+FE0F) — warning status badges
- ✅ (U+2705) — success status badges

This list is exhaustive. Any other emoji or pictographic Unicode glyph in user-facing UI is forbidden. The list may only be extended by an explicit canon amendment, not by agent judgment.

OUT OF SCOPE for this rule (i.e., emojis are permitted here):
- Code comments
- `console.log`, `console.warn`, `console.error` strings
- Test descriptions (`it()`, `describe()`)
- `.md` files (governance docs, READMEs)

Verification: every Implementation that touches user-facing strings must include a grep check using the Unicode emoji regex range (e.g., `grep -rnP "[\x{1F300}-\x{1F9FF}\x{2600}-\x{27BF}]" src/ --include="*.tsx" --include="*.ts"`) and confirm any hits fall within the permitted-glyph list above or in OUT OF SCOPE contexts.

---

## WHEN PRINCIPLES CONFLICT

If two principles seem to contradict each other on a given task:

1. **Higher layer wins.** Layer 1 > Layer 2 > Layer 3.
2. Within a layer, hard rules win over softer guidance.
3. When still unclear, grill the human. Don't pick silently.

Example: The audit protocol says "investigate every nook and cranny." Karpathy's principles say "touch only what you must." These don't actually conflict — investigation is in-scope work (it's the task itself), and "touch only what you must" applies to making changes, not to checking things. But if you're ever unsure which applies, grill.

---

**END OF PRINCIPLES**
