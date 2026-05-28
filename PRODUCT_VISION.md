# MockMaxxing — Product Vision

*Version 1.1 (May 2026)*

This document defines what MockMaxxing is, who it's for, what problem it solves, and what it deliberately is not. When an AI agent or designer has to make a judgment call about a feature, screen, or interaction, this is the document that says what the product is trying to be.

If this document and any other document disagree about product direction, this one wins.

---

## What MockMaxxing is

MockMaxxing is a high-fidelity **mock draft** tool for fantasy football players who take their drafts seriously. The product helps users practice, analyze, and improve their drafting — so when their real league draft happens, they walk in with a tested strategy and a roster they've already optimized against realistic opponents.

The name is a play on the alpha-gen term **looksmaxxing** — the practice of maximizing one's physical attractiveness through deliberate self-improvement techniques. MockMaxxing applies that same intent to fantasy football drafting: helping users **max out their fantasy draft potential** through repeated, intelligent practice paired with intelligent feedback and guidance. The product isn't a casual mock draft tool — it's a self-improvement system for drafters.

---

## Who the user is

The MockMaxxing user is a fantasy football player who:

- Plays in one or more leagues that matter to them (money on the line, season-long bragging rights, or both)
- Treats drafting as a skill that rewards preparation, not a one-shot event
- Wants more than the generic mock draft tools offered free by ESPN, Yahoo, and Sleeper — tools that feel shallow, repetitive, and disconnected from real draft conditions
- Is willing to invest time before their actual draft to gain an edge
- Cares about the *quality* of their mock draft experience: realistic CPU opponents, current player data, draft strategies that match real human behavior

This user is not a casual player who joins a league because their friends did. The casual player drafts auto-pick. The MockMaxxing user reads ranking debates, has opinions about Zero-RB vs. Hero-RB strategies, and knows what ECR consensus means.

---

## The core problem MockMaxxing solves

Every fantasy football player faces the same problem before draft day: **you only get one real draft per league per year, and there's no good way to practice for it.**

Existing free mock draft tools have three failure modes:

1. **Unrealistic CPU opponents.** Most mock drafters use predictable algorithms that don't reflect how real humans draft. You can't develop a real strategy against bots that take the same player at the same pick every time.
2. **No feedback loop.** You finish a mock draft and the tool says "draft complete." You have no idea if your roster was actually good, what you missed, what you got right.
3. **No repetition value.** Drafts feel disposable. Each one is an island. There's no learning carried forward from draft #1 to draft #50.

MockMaxxing solves all three:

- **Realistic CPU opponents** that draft according to distinct strategy profiles (Balanced, Zero RB, Hero RB, Late QB/TE Focus, Robust RB, Elite QB/TE Premium) and adapt based on training simulation data
- **Intelligent feedback and guidance** — post-draft recap analysis that grades the user's roster, identifies their best and worst picks, and shows what alternative strategies could have produced
- **Practice that compounds** — rankings the user has refined, lineup strategies they've tested, and drafting habits they've built carry from one mock to the next

---

## Core features (as of May 2026)

The current product centers on these features:

- **Mock draft engine** — snake and linear drafts, configurable league size, scoring format, and roster construction rules
- **CPU opponent system** — bot drafters with strategy profiles that approximate real human drafting behavior, including learning accuracy curves
- **Player rankings** — current ECR-consensus data plus tier classifications, with the ability to edit personal rankings
- **Post-draft recap** — 1970s-baseball-card-style trading card layout that summarizes user picks with grades and analysis
- **News feed** — current player news relevant to drafting decisions
- **Settings & account management** — user profile, preferences, drafting history

There are also internal/diagnostic features (qa-simulation harness, executive dashboard, leaderboard, telemetry) that support the bot opponent system and product analytics. Whether these become user-facing or remain internal is unresolved.

---

## What MockMaxxing is NOT

This list matters as much as the feature list. When in doubt about whether a feature belongs, check here first.

- **MockMaxxing is not a season-long fantasy management tool.** It doesn't handle weekly lineups, waiver claims, trades, or playoffs. After the draft, the user goes back to their league host (ESPN, Yahoo, Sleeper) to play out the season. MockMaxxing is the *pre-season preparation* layer.

- **MockMaxxing is not a daily fantasy sports (DFS) product.** No DraftKings/FanDuel-style single-game contests. No real-money play. No salary cap drafting.

- **MockMaxxing is not a sportsbook.** No betting features. No odds. No live game tracking for wagering purposes.

- **MockMaxxing is not a generic "fantasy sports" platform.** It's football-first and football-specific. Football-specific terminology (snake, ECR, tiers, bye weeks, position scarcity) and football-specific aesthetics (pigskin, field green, on-the-clock urgency) are not removable abstractions — they're the product identity.

- **MockMaxxing is not for casual players.** Casual players are well-served by existing free tools. MockMaxxing is for users who want depth, repetition, and analytical feedback. Features should not be dumbed down to broaden the market.

- **MockMaxxing is not a social network.** No friend graph, no public profiles, no "share your roster" social loops. Drafts can be solo affairs against bots. (This may change if there's strong user demand for human-vs-human mock drafts, but that's a future consideration, not a current direction.)

- **MockMaxxing is not "Madden for fantasy."** Despite some studio-quality assets (Madden audio quotes, photography references), the product is an analytics tool with sport-broadcast flavor, not a sports entertainment experience. The "premium analytics terminal with stadium accents" emotional register from the design system applies here too.

---

## Emotional register

Borrowed from the design system canon and stated here for product context:

MockMaxxing should feel like a **premium analytics product with kinetic sport accents on the moments that matter**. The interface is clean, dashboard-grade, and information-dense — because the user is doing real analytical work. But when something *happens* in the draft (a pick comes in, the clock starts running, an A-tier grade lands on a roster), the product flares with sport-broadcast energy: orange CTAs, gold achievement badges, the on-the-clock banner.

The user should feel like they're operating a serious tool, not playing a casual game. But the tool itself should respect that fantasy football is a sport — and lean into that flavor at the right moments.

The product's emotional ancestry runs through self-improvement culture (the "maxxing" framing). Users come to MockMaxxing because they want to get *better*, not just play. The tone should respect that intent without becoming preachy about it.

---

## Strategic priorities (current)

The top product priorities as of May 2026, in rough order:

1. **Visual polish — light-mode palette migration.** The app currently renders in an outdated dark-mode palette. The canonical palette has been resolved (see `MOCKMAXXING_COLOR_PALETTE.md`) and needs to ship to the code. This is the next focused work.

2. **Mock draft experience refinement.** The core draft engine works but the feel could be sharpened — better realism in CPU opponent behavior, smoother user pacing, clearer in-draft analytics.

3. **Recap depth.** The post-draft recap is the product's differentiated value. Making it more analytically substantial (what worked, what didn't, what alternative paths existed) is high-leverage.

What is NOT a current priority: expanding to other sports, adding social features, building a season-long management layer, building a real-money play layer.

---

## Anti-goals

Things the product is deliberately not optimizing for, listed so future feature debates don't drift toward them:

- **Maximum user count.** MockMaxxing wins by serving serious drafters deeply, not by serving casual drafters shallowly. Feature decisions that broaden the market by reducing depth should be rejected.

- **Maximum session time.** Some products optimize for engagement (keeping the user in the app as long as possible). MockMaxxing is a tool — if the user opens the app, drafts well, and closes it satisfied, that's a win.

- **Maximum monetization surfaces.** No ads inside drafts. No upsells during analytical moments. If monetization happens, it happens at the seams of the experience, not inside it.

- **Generic sports feel.** Every decision should be football-first. "What if we made it work for baseball too" is a path away from product identity, not toward growth.

---

## How to use this document

When an AI agent or designer is making a judgment call and needs to know "should this be in MockMaxxing?", the test in priority order:

1. Does it serve the **core problem** (helping serious drafters max out their draft potential)?
2. Is it consistent with **what MockMaxxing is NOT**?
3. Does it match the **emotional register**?
4. Does it move toward the **strategic priorities**, or pull attention from them?

If 1-3 are yes and 4 is positive: probably worth building.
If any of them are no: probably not for MockMaxxing, or at minimum needs a deliberate decision before proceeding.

---

# END OF PRODUCT VISION
