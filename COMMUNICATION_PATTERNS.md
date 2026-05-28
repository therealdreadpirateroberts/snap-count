# How to Ask the AI Agent for a Change

A short guide to phrasing change requests so the agent can act surgically without guessing.

---

## The core pattern

Every change request should answer three questions:

1. **WHERE is the thing?** (Which screen, which component, which file/line if known)
2. **WHAT is the change?** (The specific desired end state, not the desired direction)
3. **WHAT must not change?** (The fence that prevents scope creep)

A request that answers all three is a surgical request. A request that answers only one is a guess-request.

---

## Examples — before and after

### Example 1: Color change

❌ Vague: "Make the background black instead of green."

✅ Surgical: "In the theme constants file (`src/constants/theme.ts`), change the value of `background` in both `LightColors` and `DarkColors` from `#1F4712` (Field Green) to `#0c0c0c` (Obsidian Black). Keep all other color variables, gradients, and positions highlights exactly as they are."

### Example 2: Layout change

❌ Vague: "Move Draft Now down like Mock Now."

✅ Surgical: "On the home page (`src/app/index.tsx`), relocate the Draft Now button (`<ComponentName>`) from its current position at the top of the screen to the same vertical position the Mock Now button occupies on the Mock page (`src/app/[mock-file].tsx`). Match the visual treatment of Mock Now exactly. Keep the existing onClick handler. Do not change any other element on the home page."

### Example 3: Button visual style change

❌ Vague: "Make the exit button louder."

✅ Surgical: "On the active draft page (`src/app/wizard/active.tsx`), change the styling of the exit button (`styles.exitBtn`) from a transparent outline to a solid background using `theme.status.danger` (`#EF4444`) with white text (`theme.primaryAccent`). Keep its position at the top left of the status bar. Do not modify the back arrow SVG inside the button."

### Example 4: Spacing/padding change

❌ Vague: "Add some breathing room between the columns of the draft board."

✅ Surgical: "On the active draft page (`src/app/wizard/active.tsx`), increase the spacing between column grid cells (`styles.gridCell`). Modify the horizontal scroll container margin or cell margin to add 8px of padding on the left and right of each column strip. Do not change the width (`cellWidth`) or height (`cellHeight`) of individual cells."

### Example 5: Swap of one component for another

❌ Vague: "Use the baseball cards on the home page instead of the current tiles."

✅ Surgical: "On the home page (`src/app/index.tsx`), replace the standard `<FeedCard>` tiles in the `renderCardFeed` method with the retro baseball card layout currently defined as `baseballCard` inside `src/app/recap.tsx`. Use the same data mappings (title to player name, kicker to position). Do not change the overall grid layout (`tileGrid`) or click behavior."

### Example 6: Behavior change (onClick)

❌ Vague: "When you press the tab bar ranks, take me to custom ranks."

✅ Surgical: "In the bottom tab navigation bar (`src/components/AppTabBar.tsx`), change the `onPress` behavior of the rankings tab (`TabItem` with label 'RANKS') so that it navigates to `/rankings?board=custom` instead of `/rankings`. Keep the existing icon, active state detection, and haptic feedback. Do not touch any other tab navigation routes."

### Example 7: Request that should be split into two changes

❌ Vague: "retouch the recap screen: make cards black, change mock again button to red, and also clean up the feed cards below."

✅ Surgical (Split into two consecutive requests):
- **Request 1:** "On the recap page (`src/app/recap.tsx`), change the snapping card border (`styles.cardContainer`) from Pigskin Brown (`#6B3615`) to Obsidian Black (`theme.background` which is `#0c0c0c`). In addition, change the background color of the 'Mock Again' button inside the card bottom action row to `theme.status.danger` (`#EF4444`). Do not change any other card stats, baseball cards, or layout."
- **Request 2:** "On the recap page (`src/app/recap.tsx`), increase the padding-top of the 'Just for you' feed container (`justForYouSection`) to 32px. Do not modify the cards inside the feed or any other page section."

---

## Vocabulary cheat sheet

Here are the 20 most-used UI vocabulary terms from `UI_VOCABULARY.md` for quick reference:

1. `persistentMockBtn` — The gold, breathing floating MOCK NOW button at the bottom-right of the mobile home page (`src/app/index.tsx`).
2. `LandingScreen` — The root home page layout container wrapper (`src/app/index.tsx`).
3. `renderSidebar` — The navigation menu displayed on the left column in desktop resolutions (`src/app/index.tsx`).
4. `DraftPositionSelector` — The pick number horizontal slider (1-12) on the setup screen (`src/app/wizard/setup.tsx`).
5. `LeagueRulesSelector` — The teams count and timer sliders card on the setup screen (`src/app/wizard/setup.tsx`).
6. `RosterConstructionPanel` — The adjustments panel for QB, RB, WR increments on the setup screen (`src/app/wizard/setup.tsx`).
7. `headerAbsoluteContainer` — Collapsible title bar header pinned to the top of rankings (`src/app/rankings.tsx`).
8. `inlineSearchWrapper` — Collapsible input text field that expands when search is clicked (`src/app/rankings.tsx`).
9. `filterScrollViewStyle` — Horizontal scroll row of filters (ALL, QB, RB, etc.) on rankings (`src/app/rankings.tsx`).
10. `PlayerRow` — Grid list row displaying individual player cards (`src/components/RankingsRow.tsx`).
11. `swiperScrollView` — The horizontal scrolling viewport container on recap (`src/app/recap.tsx`).
12. `cardContainer` — Individual card decks representing mock run summaries (`src/app/recap.tsx`).
13. `baseballCard` — Retro 1970s baseball cards displaying top draft picks on recap (`src/app/recap.tsx`).
14. `gradeContainer` — Radial grade medal circular badge on the top-left of recap cards (`src/app/recap.tsx`).
15. `topBar` — Status bar pinning the Exit button and overall pick counts (`src/app/wizard/active.tsx`).
16. `boardHorizontalScrollView` — Main draft grid layout displaying columns of drafted players (`src/app/wizard/active.tsx`).
17. `BottomSheet` — Bottom drawer containing draft tabs and player lists (`src/app/wizard/active.tsx`).
18. `sheetHeaderBanner` — Pulse-glow banner displaying active clocks and timers (`src/app/wizard/active.tsx`).
19. `AppHeader` — Shared top bar containing the branding banner and action strips (`src/components/AppHeader.tsx`).
20. `AppTabBar` — Shared floating glassmorphic bottom tab bar (`src/components/AppTabBar.tsx`).

---

## When you don't know the precise name

If you don't know what something is called in the code, do not guess! Guessing leads to incorrect components being modified. The right first request is:

> "Find the [thing you can describe, e.g., the little circular avatar in the header] in the codebase and tell me what component name and file location it maps to. Do not make any code changes yet."

This is one extra round-trip, but it guarantees surgical, 100% accurate edits.

---

## Words that cause scope creep — avoid them

- **"Clean up"** — too broad, the agent will guess and edit unrelated parts.
- **"Modernize"** — undefined visual target.
- **"Make it look better"** — entirely subjective, the agent will improvise.
- **"Fix the [vague region]"** — does not specify what to change or what the correct end state is.

**Instead:** replace each with a concrete, quantitative, and exact visual end state (e.g., "Change border width to 1.5px, set border radius to 12px, and set background color to `theme.surface`").

---

## The STOP signal

If a request feels ambiguous, the agent is trained to **STOP and ask clarifying questions** using interactive options rather than guessing. We prefer taking one extra step to align than making a wrong edit that breaks your app.
