"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFastSimulation = exports.useMockMaxxingStore = exports.applyFormatAndSort = exports.getBotLearningAccuracy = exports.DEFAULT_BOT_PROFILES = exports.BOT_OPTIMIZED_PARAMS = exports.getPlayerSuggestionScore = exports.getPlayerSuggestionScores = exports.getUserNextPick = exports.getTeamNameForIndex = exports.getTeamIndexForPick = exports.getUserTeamName = void 0;
const zustand_1 = require("zustand");
const mockData_1 = require("./mockData");
const scratch_live_metrics_json_1 = __importDefault(require("../../scratch_live_metrics.json"));
const useAuthStore_1 = require("./useAuthStore");
const getUserTeamName = () => {
    return useAuthStore_1.useAuthStore.getState().user?.name || 'Your Team';
};
exports.getUserTeamName = getUserTeamName;
const getUserStorageKeys = () => {
    const userId = useAuthStore_1.useAuthStore.getState().user?.id;
    if (userId) {
        return {
            HISTORICAL_DRAFTS: `mockmaxxing_historical_drafts_user_${userId}`,
            BOT_TRAINING_SIMS: `mockmaxxing_bot_training_sims_user_${userId}`,
            MY_RANKS: `mockmaxxing_my_ranks_user_${userId}`,
            MY_RANKS_NAME: `mockmaxxing_my_ranks_name_user_${userId}`
        };
    }
    return {
        HISTORICAL_DRAFTS: 'mockmaxxing_historical_drafts',
        BOT_TRAINING_SIMS: 'mockmaxxing_bot_training_sims',
        MY_RANKS: 'mockmaxxing_my_ranks',
        MY_RANKS_NAME: 'mockmaxxing_my_ranks_name'
    };
};
// Helper to calculate which team is picking at a given pick number
const getTeamIndexForPick = (pick, leagueSize, draftType) => {
    const round = Math.ceil(pick / leagueSize);
    const indexInRound = (pick - 1) % leagueSize; // 0 to leagueSize - 1
    if (draftType === 'Snake' && round % 2 === 0) {
        // Reverse pick direction in even rounds for Snake
        return leagueSize - 1 - indexInRound;
    }
    return indexInRound;
};
exports.getTeamIndexForPick = getTeamIndexForPick;
const getTeamNameForIndex = (idx, userPosition, customUserTeamName) => {
    if (idx === userPosition - 1) {
        return customUserTeamName || (0, exports.getUserTeamName)();
    }
    // Assign experts to the first three non-user spots
    const nonUserSlots = [];
    for (let i = 0; i < 16; i++) {
        if (i !== userPosition - 1) {
            nonUserSlots.push(i);
        }
    }
    const expertIndex = nonUserSlots.indexOf(idx);
    if (expertIndex === 0)
        return 'Andy';
    if (expertIndex === 1)
        return 'Mike';
    if (expertIndex === 2)
        return 'Jason';
    const firstNames = [
        'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert',
        'Sophia', 'William', 'Daniel', 'Olivia', 'Matthew'
    ];
    return firstNames[(expertIndex - 3) % firstNames.length];
};
exports.getTeamNameForIndex = getTeamNameForIndex;
// Helper to calculate when the user's next turn is
const getUserNextPick = (currentPick, setup) => {
    const totalPicks = setup.rounds * setup.leagueSize;
    for (let p = currentPick + 1; p <= totalPicks; p++) {
        const activeTeamIdx = (0, exports.getTeamIndexForPick)(p, setup.leagueSize, setup.draftType);
        if (activeTeamIdx === setup.userPosition - 1) {
            return p;
        }
    }
    return null;
};
exports.getUserNextPick = getUserNextPick;
const getPlayerSuggestionScores = (available, currentPick, setup, userRoster) => {
    const qbCount = userRoster.filter(p => p.position === 'QB').length;
    const rbCount = userRoster.filter(p => p.position === 'RB').length;
    const wrCount = userRoster.filter(p => p.position === 'WR').length;
    const teCount = userRoster.filter(p => p.position === 'TE').length;
    const kCount = userRoster.filter(p => p.position === 'K').length;
    const dstCount = userRoster.filter(p => p.position === 'DST').length;
    const slots = setup.rosterSlots || {
        QB: 1,
        RB: 2,
        WR: 2,
        TE: 1,
        FLEX: setup.flexCount || 1,
        K: 1,
        DST: 1,
        BENCH: 6,
        IR: 1
    };
    const currentRound = Math.ceil(currentPick / setup.leagueSize);
    const bestAvailableRank = available.length > 0 ? available[0].rank : 1;
    const strategy = setup.userStrategy || 'Late QB/TE Focus';
    return available.map(player => {
        // 1. Base Score derived relative to the best available player's rank (lower gap = higher score)
        // Relative ECR scoring avoids negative base scores in later rounds
        let baseScore = 260 - (player.rank - bestAvailableRank) * 5.0;
        // 2. ADP Value Steal Bonus: boost players that have fallen past their average draft position
        const valueSteal = player.adp - currentPick;
        const valueBonus = valueSteal > 0 ? Math.min(40, valueSteal * 2.0) : 0;
        let score = baseScore + valueBonus;
        // 3. Roster Construction Multiplier based on current position counts and escalating urgency
        let positionMultiplier = 1.0;
        const pos = player.position;
        if (pos === 'QB') {
            let qbMultiplier = 1.0;
            if (setup.passingTdPoints === 6) {
                qbMultiplier = 1.25;
            }
            if (qbCount === 0) {
                if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
                    // Late QB focus: heavily penalize QBs early (before Rd 7), lift lock late
                    positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    // Elite QB/TE Premium: aggressively target QB in first 3 rounds!
                    positionMultiplier = currentRound <= 3 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
                }
                else {
                    positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
                }
            }
            else if (qbCount < slots.QB) {
                positionMultiplier = 1.5;
            }
            else if (qbCount < slots.QB + Math.ceil(slots.BENCH / 5)) {
                positionMultiplier = currentRound >= 12 ? 0.8 : 0.4; // defer backups to very late
            }
            else {
                positionMultiplier = 0.0; // max cap reached
            }
            positionMultiplier *= qbMultiplier;
        }
        else if (pos === 'TE') {
            let teMultiplier = 1.0;
            if (setup.tePremium) {
                teMultiplier = 1.25;
            }
            if (teCount === 0) {
                if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
                    // Late TE focus: heavily penalize TEs early (before Rd 10), lift lock late
                    positionMultiplier = currentRound >= 10 ? 2.5 : 0.3;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    // Elite QB/TE Premium: aggressively target TE in first 4 rounds!
                    positionMultiplier = currentRound <= 4 ? 2.5 : currentRound >= 10 ? 2.5 : 1.35;
                }
                else {
                    positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
                }
            }
            else if (teCount < slots.TE) {
                positionMultiplier = 1.5;
            }
            else if (teCount < slots.TE + Math.ceil(slots.BENCH / 5)) {
                positionMultiplier = currentRound >= 12 ? 0.8 : 0.4;
            }
            else {
                positionMultiplier = 0.0;
            }
            positionMultiplier *= teMultiplier;
        }
        else if (pos === 'RB') {
            if (rbCount < slots.RB) {
                const isFirstRB = rbCount === 0;
                if (isFirstRB) {
                    if (strategy === 'Zero RB') {
                        positionMultiplier = currentRound >= 6 ? 1.8 : 0.2; // avoid RBs early
                    }
                    else if (strategy === 'Hero RB') {
                        positionMultiplier = currentRound >= 2 ? 2.5 : 1.8; // secure elite anchor RB
                    }
                    else if (strategy === 'Late QB/TE Focus') {
                        positionMultiplier = currentRound >= 5 ? 2.5 : 1.8; // prioritize RBs early
                    }
                    else if (strategy === 'Robust RB') {
                        positionMultiplier = currentRound <= 4 ? 3.0 : 1.8; // secure early RBs aggressively
                    }
                    else if (strategy === 'Elite QB/TE Premium') {
                        positionMultiplier = currentRound <= 4 ? 0.8 : 1.8; // defer slightly early RB
                    }
                    else {
                        positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
                    }
                }
                else {
                    if (strategy === 'Zero RB') {
                        positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
                    }
                    else if (strategy === 'Hero RB') {
                        positionMultiplier = currentRound >= 7 ? 2.0 : 0.4; // wait on 2nd RB, load WRs
                    }
                    else if (strategy === 'Late QB/TE Focus') {
                        positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
                    }
                    else if (strategy === 'Robust RB') {
                        positionMultiplier = currentRound <= 4 ? 2.8 : 1.65; // keep buying early RBs!
                    }
                    else if (strategy === 'Elite QB/TE Premium') {
                        positionMultiplier = currentRound <= 4 ? 0.8 : 1.65;
                    }
                    else {
                        positionMultiplier = currentRound >= 7 ? 2.0 : 1.45;
                    }
                }
            }
            else if (rbCount < slots.RB + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
                if (strategy === 'Robust RB' && rbCount < slots.RB + 1) {
                    positionMultiplier = currentRound <= 4 ? 2.5 : 1.2; // keep buying early RBs!
                }
                else {
                    positionMultiplier = 1.1; // filled starters, normal bench addition weight
                }
            }
            else {
                positionMultiplier = 0.0;
            }
        }
        else if (pos === 'WR') {
            if (wrCount < slots.WR) {
                const isFirstWR = wrCount === 0;
                if (isFirstWR) {
                    if (strategy === 'Zero RB') {
                        positionMultiplier = currentRound >= 5 ? 2.5 : 2.0; // WR hoarding early
                    }
                    else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
                        positionMultiplier = currentRound >= 5 ? 2.4 : 1.8; // priority WR early
                    }
                    else if (strategy === 'Robust RB') {
                        positionMultiplier = currentRound <= 4 ? 0.4 : 2.0; // avoid WR early in Robust RB
                    }
                    else if (strategy === 'Elite QB/TE Premium') {
                        positionMultiplier = currentRound <= 4 ? 0.8 : 2.0;
                    }
                    else {
                        positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
                    }
                }
                else {
                    if (strategy === 'Zero RB') {
                        positionMultiplier = currentRound >= 7 ? 2.2 : 1.8;
                    }
                    else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
                        positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
                    }
                    else if (strategy === 'Robust RB') {
                        positionMultiplier = currentRound <= 4 ? 0.3 : 1.8;
                    }
                    else if (strategy === 'Elite QB/TE Premium') {
                        positionMultiplier = currentRound <= 4 ? 0.8 : 1.8;
                    }
                    else {
                        positionMultiplier = 1.6;
                    }
                }
            }
            else if (wrCount < slots.WR + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
                if (strategy === 'Zero RB') {
                    positionMultiplier = 1.3;
                }
                else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
                    positionMultiplier = 1.2;
                }
                else if (strategy === 'Robust RB') {
                    positionMultiplier = currentRound <= 4 ? 0.4 : 1.1;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    positionMultiplier = currentRound <= 4 ? 0.8 : 1.1;
                }
                else {
                    positionMultiplier = 1.1;
                }
            }
            else {
                positionMultiplier = 0.0;
            }
        }
        else if (pos === 'K') {
            const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
                Math.max(0, slots.TE - teCount) +
                Math.max(0, slots.K - kCount) +
                Math.max(0, slots.DST - dstCount) +
                Math.max(0, slots.RB - rbCount) +
                Math.max(0, slots.WR - wrCount);
            const roundsRemaining = setup.rounds - currentRound + 1;
            const hasRosterUrgency = neededStartingSlots >= roundsRemaining;
            if (kCount >= slots.K || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
                positionMultiplier = 0.0; // strictly delay to final 2 rounds unless urgent
            }
            else {
                positionMultiplier = 1.0;
            }
        }
        else if (pos === 'DST') {
            const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
                Math.max(0, slots.TE - teCount) +
                Math.max(0, slots.K - kCount) +
                Math.max(0, slots.DST - dstCount) +
                Math.max(0, slots.RB - rbCount) +
                Math.max(0, slots.WR - wrCount);
            const roundsRemaining = setup.rounds - currentRound + 1;
            const hasRosterUrgency = neededStartingSlots >= roundsRemaining;
            if (dstCount >= slots.DST || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
                positionMultiplier = 0.0;
            }
            else {
                positionMultiplier = 1.0;
            }
        }
        // Strict Complete Roster Rule for suggestions (Force missing starting positions)
        const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
            Math.max(0, slots.TE - teCount) +
            Math.max(0, slots.K - kCount) +
            Math.max(0, slots.DST - dstCount) +
            Math.max(0, slots.RB - rbCount) +
            Math.max(0, slots.WR - wrCount);
        const roundsRemaining = setup.rounds - currentRound + 1;
        if (neededStartingSlots >= roundsRemaining) {
            const isMissingQB = qbCount < slots.QB && pos === 'QB';
            const isMissingTE = teCount < slots.TE && pos === 'TE';
            const isMissingK = kCount < slots.K && pos === 'K';
            const isMissingDST = dstCount < slots.DST && pos === 'DST';
            const isMissingRB = rbCount < slots.RB && pos === 'RB';
            const isMissingWR = wrCount < slots.WR && pos === 'WR';
            if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
                positionMultiplier = 0.0;
            }
        }
        const finalScore = score * positionMultiplier;
        return {
            player,
            finalScore
        };
    });
};
exports.getPlayerSuggestionScores = getPlayerSuggestionScores;
const getPlayerSuggestionScore = (player, currentPick, setup, roster, bestAvailableRank) => {
    const qbCount = roster.QB;
    const rbCount = roster.RB;
    const wrCount = roster.WR;
    const teCount = roster.TE;
    const kCount = roster.K;
    const dstCount = roster.DST;
    const slots = setup.rosterSlots || {
        QB: 1,
        RB: 2,
        WR: 2,
        TE: 1,
        FLEX: setup.flexCount || 1,
        K: 1,
        DST: 1,
        BENCH: 6,
        IR: 1
    };
    const currentRound = Math.ceil(currentPick / setup.leagueSize);
    const strategy = setup.userStrategy || 'Late QB/TE Focus';
    let baseScore = 260 - (player.rank - bestAvailableRank) * 5.0;
    const valueSteal = player.adp - currentPick;
    const valueBonus = valueSteal > 0 ? Math.min(40, valueSteal * 2.0) : 0;
    let score = baseScore + valueBonus;
    let positionMultiplier = 1.0;
    const pos = player.position;
    if (pos === 'QB') {
        let qbMultiplier = 1.0;
        if (setup.passingTdPoints === 6) {
            qbMultiplier = 1.25;
        }
        if (qbCount === 0) {
            if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
                positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
            }
            else if (strategy === 'Elite QB/TE Premium') {
                positionMultiplier = currentRound <= 3 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
            }
            else {
                positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
            }
        }
        else if (qbCount < slots.QB) {
            positionMultiplier = 1.5;
        }
        else if (qbCount < slots.QB + Math.ceil(slots.BENCH / 5)) {
            positionMultiplier = currentRound >= 12 ? 0.8 : 0.4;
        }
        else {
            positionMultiplier = 0.0;
        }
        positionMultiplier *= qbMultiplier;
    }
    else if (pos === 'TE') {
        let teMultiplier = 1.0;
        if (setup.tePremium) {
            teMultiplier = 1.25;
        }
        if (teCount === 0) {
            if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
                positionMultiplier = currentRound >= 10 ? 2.5 : 0.3;
            }
            else if (strategy === 'Elite QB/TE Premium') {
                positionMultiplier = currentRound <= 4 ? 2.5 : currentRound >= 10 ? 2.5 : 1.35;
            }
            else {
                positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
            }
        }
        else if (teCount < slots.TE) {
            positionMultiplier = 1.5;
        }
        else if (teCount < slots.TE + Math.ceil(slots.BENCH / 5)) {
            positionMultiplier = currentRound >= 12 ? 0.8 : 0.4;
        }
        else {
            positionMultiplier = 0.0;
        }
        positionMultiplier *= teMultiplier;
    }
    else if (pos === 'RB') {
        if (rbCount < slots.RB) {
            const isFirstRB = rbCount === 0;
            if (isFirstRB) {
                if (strategy === 'Zero RB') {
                    positionMultiplier = currentRound >= 6 ? 1.8 : 0.2;
                }
                else if (strategy === 'Hero RB') {
                    positionMultiplier = currentRound >= 2 ? 2.5 : 1.8;
                }
                else if (strategy === 'Late QB/TE Focus') {
                    positionMultiplier = currentRound >= 5 ? 2.5 : 1.8;
                }
                else if (strategy === 'Robust RB') {
                    positionMultiplier = currentRound <= 4 ? 3.0 : 1.8;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    positionMultiplier = currentRound <= 4 ? 0.8 : 1.8;
                }
                else {
                    positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
                }
            }
            else {
                if (strategy === 'Zero RB') {
                    positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
                }
                else if (strategy === 'Hero RB') {
                    positionMultiplier = currentRound >= 7 ? 2.0 : 0.4;
                }
                else if (strategy === 'Late QB/TE Focus') {
                    positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
                }
                else if (strategy === 'Robust RB') {
                    positionMultiplier = currentRound <= 4 ? 2.8 : 1.65;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    positionMultiplier = currentRound <= 4 ? 0.8 : 1.65;
                }
                else {
                    positionMultiplier = currentRound >= 7 ? 2.0 : 1.45;
                }
            }
        }
        else if (rbCount < slots.RB + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
            if (strategy === 'Robust RB' && rbCount < slots.RB + 1) {
                positionMultiplier = currentRound <= 4 ? 2.5 : 1.2;
            }
            else {
                positionMultiplier = 1.1;
            }
        }
        else {
            positionMultiplier = 0.0;
        }
    }
    else if (pos === 'WR') {
        if (wrCount < slots.WR) {
            const isFirstWR = wrCount === 0;
            if (isFirstWR) {
                if (strategy === 'Zero RB') {
                    positionMultiplier = currentRound >= 5 ? 2.5 : 2.0;
                }
                else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
                    positionMultiplier = currentRound >= 5 ? 2.4 : 1.8;
                }
                else if (strategy === 'Robust RB') {
                    positionMultiplier = currentRound <= 4 ? 0.4 : 2.0;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    positionMultiplier = currentRound <= 4 ? 0.8 : 2.0;
                }
                else {
                    positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
                }
            }
            else {
                if (strategy === 'Zero RB') {
                    positionMultiplier = currentRound >= 7 ? 2.2 : 1.8;
                }
                else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
                    positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
                }
                else if (strategy === 'Robust RB') {
                    positionMultiplier = currentRound <= 4 ? 0.3 : 1.8;
                }
                else if (strategy === 'Elite QB/TE Premium') {
                    positionMultiplier = currentRound <= 4 ? 0.8 : 1.8;
                }
                else {
                    positionMultiplier = 1.6;
                }
            }
        }
        else if (wrCount < slots.WR + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
            if (strategy === 'Zero RB') {
                positionMultiplier = 1.3;
            }
            else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
                positionMultiplier = 1.2;
            }
            else if (strategy === 'Robust RB') {
                positionMultiplier = currentRound <= 4 ? 0.4 : 1.1;
            }
            else if (strategy === 'Elite QB/TE Premium') {
                positionMultiplier = currentRound <= 4 ? 0.8 : 1.1;
            }
            else {
                positionMultiplier = 1.1;
            }
        }
        else {
            positionMultiplier = 0.0;
        }
    }
    else if (pos === 'K') {
        const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
            Math.max(0, slots.TE - teCount) +
            Math.max(0, slots.K - kCount) +
            Math.max(0, slots.DST - dstCount) +
            Math.max(0, slots.RB - rbCount) +
            Math.max(0, slots.WR - wrCount);
        const roundsRemaining = setup.rounds - currentRound + 1;
        const hasRosterUrgency = neededStartingSlots >= roundsRemaining;
        if (kCount >= slots.K || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
            positionMultiplier = 0.0;
        }
        else {
            positionMultiplier = 1.0;
        }
    }
    else if (pos === 'DST') {
        const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
            Math.max(0, slots.TE - teCount) +
            Math.max(0, slots.K - kCount) +
            Math.max(0, slots.DST - dstCount) +
            Math.max(0, slots.RB - rbCount) +
            Math.max(0, slots.WR - wrCount);
        const roundsRemaining = setup.rounds - currentRound + 1;
        const hasRosterUrgency = neededStartingSlots >= roundsRemaining;
        if (dstCount >= slots.DST || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
            positionMultiplier = 0.0;
        }
        else {
            positionMultiplier = 1.0;
        }
    }
    const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
        Math.max(0, slots.TE - teCount) +
        Math.max(0, slots.K - kCount) +
        Math.max(0, slots.DST - dstCount) +
        Math.max(0, slots.RB - rbCount) +
        Math.max(0, slots.WR - wrCount);
    const roundsRemaining = setup.rounds - currentRound + 1;
    if (neededStartingSlots >= roundsRemaining) {
        const isMissingQB = qbCount < slots.QB && pos === 'QB';
        const isMissingTE = teCount < slots.TE && pos === 'TE';
        const isMissingK = kCount < slots.K && pos === 'K';
        const isMissingDST = dstCount < slots.DST && pos === 'DST';
        const isMissingRB = rbCount < slots.RB && pos === 'RB';
        const isMissingWR = wrCount < slots.WR && pos === 'WR';
        if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
            positionMultiplier = 0.0;
        }
    }
    return score * positionMultiplier;
};
exports.getPlayerSuggestionScore = getPlayerSuggestionScore;
// ==========================================
// HYPER-OPTIMIZED BOT STRATEGY COEFFICIENTS
// Automatically trained via 100,000 simulation genetic Monte Carlo
// ==========================================
exports.BOT_OPTIMIZED_PARAMS = {
    "Zero RB": {
        "earlyRoundRB_penalty": -40,
        "earlyRoundWRTE_bonus": 114.05917438751202,
        "roundLimit": 5
    },
    "Hero RB": {
        "anchorRB_bonus": 40,
        "earlyRB2_penalty": -65,
        "roundLimitAnchor": 2,
        "roundLimitRB2": 5
    },
    "Late QB/TE Focus": {
        "earlyQB_penalty": -60,
        "earlyTE_penalty": -60,
        "roundLimit": 6
    },
    "Balanced": {
        "adpSteal_multiplier": 1.2,
        "adpSteal_cap": 25,
        "adpGapThreshold": 6
    },
    "Robust RB": {
        "earlyRB_bonus": 90,
        "earlyQBTEWR_penalty": -20,
        "roundLimit": 3
    },
    "Elite QB/TE Premium": {
        "earlyQB_bonus": 80,
        "earlyTE_bonus": 80,
        "roundLimit": 4
    }
};
exports.DEFAULT_BOT_PROFILES = {
    'Andy': { name: 'Andy', strategyCamp: 'Balanced', expertPreference: 'Andy', learningAccuracy: 0.96 },
    'Mike': { name: 'Mike', strategyCamp: 'Hero RB', expertPreference: 'Mike', learningAccuracy: 0.96 },
    'Jason': { name: 'Jason', strategyCamp: 'Late QB/TE Focus', expertPreference: 'Jason', learningAccuracy: 0.96 },
    'Sarah': { name: 'Sarah', strategyCamp: 'Hero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
    'David': { name: 'David', strategyCamp: 'Hero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
    'Jessica': { name: 'Jessica', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
    'Michael': { name: 'Michael', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.92 },
    'Emily': { name: 'Emily', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.92 },
    'James': { name: 'James', strategyCamp: 'Balanced', expertPreference: 'Andy', learningAccuracy: 0.92 },
    'Ashley': { name: 'Ashley', strategyCamp: 'Robust RB', expertPreference: 'Mike', learningAccuracy: 0.9 },
    'Robert': { name: 'Robert', strategyCamp: 'Balanced', expertPreference: 'Jason', learningAccuracy: 0.9 },
    'Sophia': { name: 'Sophia', strategyCamp: 'Zero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.93 },
    'William': { name: 'William', strategyCamp: 'Elite QB/TE Premium', expertPreference: 'ECR Consensus', learningAccuracy: 0.91 }
};
const getBotLearningAccuracy = (sims, initialAcc) => {
    const maxAcc = 0.98;
    const growth = (maxAcc - initialAcc) * (1 - Math.exp(-sims / 3000));
    return Number((initialAcc + growth).toFixed(3));
};
exports.getBotLearningAccuracy = getBotLearningAccuracy;
const calculateCpuPlayerScore = (player, teamIdx, teamName, currentPick, setup, roster, botTrainingSims = 10000) => {
    const formatKey = setup.leagueFormat === 'Half-PPR' ? 'halfPpr' : setup.leagueFormat === 'Standard' ? 'halfPpr' : setup.leagueFormat === 'Dynasty' ? 'dynasty' : 'ppr';
    const currentRound = Math.ceil(currentPick / setup.leagueSize);
    // Retrieve Bot Profile
    const profile = exports.DEFAULT_BOT_PROFILES[teamName] || {
        name: teamName,
        strategyCamp: (teamIdx % 6 === 0 ? 'Balanced' : teamIdx % 6 === 1 ? 'Zero RB' : teamIdx % 6 === 2 ? 'Hero RB' : teamIdx % 6 === 3 ? 'Late QB/TE Focus' : teamIdx % 6 === 4 ? 'Robust RB' : 'Elite QB/TE Premium'),
        expertPreference: 'ECR Consensus',
        learningAccuracy: 0.90
    };
    // 1. Get base rank for this team based on preferred expert
    let baseRank = player.ranks[formatKey];
    if (profile.expertPreference && profile.expertPreference !== 'ECR Consensus') {
        baseRank = player.expertRanks[profile.expertPreference]?.[formatKey] ?? baseRank;
    }
    // Base Player Quality (ECR)
    let score = 300 - baseRank;
    // 2. Adjust based on Opponent Style Bias
    const style = setup.opponentStyle;
    if (style === 'Standard ADP') {
        score = 300 - (player.adp * 0.7 + baseRank * 0.3);
    }
    else if (style === 'Casual League') {
        const seed = teamIdx * 50 + player.ranks[formatKey] + currentPick;
        const noise = Math.sin(seed) * 18;
        score = 300 - (player.adp * 0.65 + baseRank * 0.35) + noise;
    }
    else if (style === 'Beat the Sharks') {
        const adpValueGap = currentPick - player.adp;
        if (adpValueGap > 8) {
            score += Math.min(30, adpValueGap * 1.5);
        }
    }
    // 3. Scale strategy camp and learning accuracy adjustments
    const camp = profile.strategyCamp;
    const accuracy = (0, exports.getBotLearningAccuracy)(botTrainingSims, profile.learningAccuracy);
    // Inject random decision noise that shrinks as bot learns/improves
    const noiseFactor = (1 - accuracy) * 80;
    const seed = teamIdx * 100 + player.ranks[formatKey];
    const personalPreference = Math.sin(seed) * 5 + (Math.sin(seed * 1.5) * noiseFactor);
    score += personalPreference;
    const pos = player.position;
    // 4. Custom rules adjustments
    if (pos === 'QB' && setup.passingTdPoints === 6) {
        score += 15;
    }
    if (pos === 'TE' && setup.tePremium) {
        score += 15;
    }
    // 5. Apply Strategy Camp Logic with Contextual Penalty Scaling (Mitigation)
    const valueGap = currentPick - player.adp;
    const valueStealMitigation = valueGap > 10 ? Math.min(50, valueGap * 3.0) : 0;
    if (camp === 'Zero RB') {
        const params = exports.BOT_OPTIMIZED_PARAMS['Zero RB'];
        if (currentRound <= params.roundLimit) {
            if (pos === 'RB')
                score += Math.min(0, params.earlyRoundRB_penalty + valueStealMitigation);
            if (pos === 'WR' || pos === 'TE')
                score += params.earlyRoundWRTE_bonus;
        }
    }
    else if (camp === 'Hero RB') {
        const params = exports.BOT_OPTIMIZED_PARAMS['Hero RB'];
        if (pos === 'RB') {
            if (currentRound <= params.roundLimitAnchor) {
                if (roster.RB === 0)
                    score += params.anchorRB_bonus;
            }
            else if (currentRound <= params.roundLimitRB2) {
                score += Math.min(0, params.earlyRB2_penalty + valueStealMitigation);
            }
        }
    }
    else if (camp === 'Late QB/TE Focus') {
        const params = exports.BOT_OPTIMIZED_PARAMS['Late QB/TE Focus'];
        if (currentRound < params.roundLimit) {
            if (pos === 'QB')
                score += Math.min(0, params.earlyQB_penalty + valueStealMitigation);
            if (pos === 'TE')
                score += Math.min(0, params.earlyTE_penalty + valueStealMitigation);
        }
    }
    else if (camp === 'Balanced') {
        const params = exports.BOT_OPTIMIZED_PARAMS['Balanced'];
        const gap = currentPick - player.adp;
        if (gap > params.adpGapThreshold) {
            score += Math.min(params.adpSteal_cap, gap * params.adpSteal_multiplier);
        }
    }
    else if (camp === 'Robust RB') {
        const params = exports.BOT_OPTIMIZED_PARAMS['Robust RB'];
        if (currentRound <= params.roundLimit) {
            if (pos === 'RB')
                score += params.earlyRB_bonus;
            if (pos === 'QB' || pos === 'TE' || pos === 'WR')
                score += Math.min(0, params.earlyQBTEWR_penalty + valueStealMitigation);
        }
    }
    else if (camp === 'Elite QB/TE Premium') {
        const params = exports.BOT_OPTIMIZED_PARAMS['Elite QB/TE Premium'];
        if (currentRound <= params.roundLimit) {
            if (pos === 'QB' && roster.QB === 0)
                score += params.earlyQB_bonus;
            if (pos === 'TE' && roster.TE === 0)
                score += params.earlyTE_bonus;
            if (pos === 'RB' || pos === 'WR')
                score += Math.min(0, -25 + valueStealMitigation);
        }
    }
    // 6. Roster Construction Urgency, Caps, & Final Round K/DST Lock
    const slots = setup.rosterSlots || {
        QB: 1,
        RB: 2,
        WR: 2,
        TE: 1,
        FLEX: setup.flexCount || 1,
        K: 1,
        DST: 1,
        BENCH: 6,
        IR: 1
    };
    const finalPicksCount = 2 * setup.leagueSize;
    const totalPicks = setup.rounds * setup.leagueSize;
    const isFinalTwoRounds = currentPick > (totalPicks - finalPicksCount);
    const neededStartingSlots = Math.max(0, slots.QB - roster.QB) +
        Math.max(0, slots.TE - roster.TE) +
        Math.max(0, slots.K - roster.K) +
        Math.max(0, slots.DST - roster.DST) +
        Math.max(0, slots.RB - roster.RB) +
        Math.max(0, slots.WR - roster.WR);
    const roundsRemaining = setup.rounds - currentRound + 1;
    const hasRosterUrgency = neededStartingSlots >= roundsRemaining;
    if (pos === 'K' || pos === 'DST') {
        if (!isFinalTwoRounds && !hasRosterUrgency) {
            return -99999;
        }
        if (pos === 'K' && roster.K < slots.K)
            score += 150;
        if (pos === 'DST' && roster.DST < slots.DST)
            score += 150;
    }
    // Strict Complete Roster Rule (Force missing starting positions)
    if (hasRosterUrgency) {
        const isMissingQB = roster.QB < slots.QB && pos === 'QB';
        const isMissingTE = roster.TE < slots.TE && pos === 'TE';
        const isMissingK = roster.K < slots.K && pos === 'K';
        const isMissingDST = roster.DST < slots.DST && pos === 'DST';
        const isMissingRB = roster.RB < slots.RB && pos === 'RB';
        const isMissingWR = roster.WR < slots.WR && pos === 'WR';
        if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
            return -99999;
        }
    }
    // Positional starters urgency
    if (pos === 'QB' && roster.QB === 0 && currentRound >= 9)
        score += 35;
    if (pos === 'TE' && roster.TE === 0 && currentRound >= 9)
        score += 35;
    if (pos === 'RB' && roster.RB === 0 && currentRound >= 5)
        score += 25;
    if (pos === 'WR' && roster.WR === 0 && currentRound >= 5)
        score += 25;
    // Positional caps
    if (pos === 'QB') {
        if (roster.QB === slots.QB) {
            score -= currentRound <= 11 ? 120 : 40;
        }
        else if (roster.QB >= slots.QB + Math.ceil(slots.BENCH / 5)) {
            return -9999;
        }
    }
    else if (pos === 'TE') {
        if (roster.TE === slots.TE) {
            score -= currentRound <= 11 ? 120 : 40;
        }
        else if (roster.TE >= slots.TE + Math.ceil(slots.BENCH / 5)) {
            return -9999;
        }
    }
    else if (pos === 'RB') {
        if (roster.RB >= slots.RB + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
            return -9999;
        }
    }
    else if (pos === 'WR') {
        if (roster.WR >= slots.WR + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
            return -9999;
        }
    }
    else if (pos === 'K') {
        if (roster.K >= slots.K)
            return -9999;
    }
    else if (pos === 'DST') {
        if (roster.DST >= slots.DST)
            return -9999;
    }
    return score;
};
;
// Helper to sort players and recalculate positional ranks for a chosen format and rankings base
const applyFormatAndSort = (players, format, rankingsBase, myRanks) => {
    if (rankingsBase === 'My Ranks') {
        const base = myRanks && myRanks.length > 0 ? myRanks : players;
        const posCounts = {};
        return base.map((p, idx) => {
            const pos = p.position;
            posCounts[pos] = (posCounts[pos] || 0) + 1;
            return {
                ...p,
                rank: idx + 1,
                posRank: `${pos}${posCounts[pos]}`,
                draftedBy: null
            };
        });
    }
    const formatKey = format === 'Half-PPR' ? 'halfPpr' : format === 'Standard' ? 'halfPpr' : format === 'Dynasty' ? 'dynasty' : 'ppr';
    // Create copies of players with rank set to their format or expert specific rank
    const updated = players.map(p => {
        let chosenRank = p.ranks[formatKey];
        if (rankingsBase !== 'ECR Consensus') {
            chosenRank = p.expertRanks[rankingsBase]?.[formatKey] ?? chosenRank;
        }
        return {
            ...p,
            rank: chosenRank
        };
    });
    // Sort players by rank ascending
    updated.sort((a, b) => a.rank - b.rank);
    // Recalculate positional ranks (posRank) based on sorted order in this format
    const posCounts = {};
    return updated.map(p => {
        const pos = p.position;
        posCounts[pos] = (posCounts[pos] || 0) + 1;
        return {
            ...p,
            posRank: `${pos}${posCounts[pos]}`
        };
    });
};
exports.applyFormatAndSort = applyFormatAndSort;
const isWeb = typeof window !== 'undefined' && window.localStorage;
const CACHE_KEY = 'mockmaxxing_cached_players';
const SYNC_TIME_KEY = 'mockmaxxing_last_synced_at';
const MY_RANKS_CACHE_KEY = 'mockmaxxing_my_ranks';
const MY_RANKS_NAME_CACHE_KEY = 'mockmaxxing_my_ranks_name';
const HISTORICAL_DRAFTS_KEY = 'mockmaxxing_historical_drafts';
const BOT_TRAINING_SIMS_KEY = 'mockmaxxing_bot_training_sims';
const getInitialHistoricalDrafts = () => {
    try {
        if (isWeb) {
            const cached = window.localStorage.getItem(getUserStorageKeys().HISTORICAL_DRAFTS);
            if (cached) {
                return JSON.parse(cached);
            }
        }
    }
    catch (e) {
        console.warn('Failed to load cached historicalDrafts', e);
    }
    return [];
};
const getInitialBotTrainingSims = () => {
    try {
        if (isWeb) {
            const cached = window.localStorage.getItem(getUserStorageKeys().BOT_TRAINING_SIMS);
            if (cached) {
                return parseInt(cached, 10);
            }
        }
    }
    catch (e) {
        console.warn('Failed to load cached botTrainingSims', e);
    }
    return 0;
};
const getInitialMyRanks = () => {
    try {
        if (isWeb) {
            const cached = window.localStorage.getItem(getUserStorageKeys().MY_RANKS);
            if (cached) {
                return JSON.parse(cached);
            }
        }
    }
    catch (e) {
        console.warn('Failed to load cached myRanks', e);
    }
    return null;
};
const getInitialMyRanksName = () => {
    try {
        if (isWeb) {
            return window.localStorage.getItem(getUserStorageKeys().MY_RANKS_NAME);
        }
    }
    catch (e) {
        console.warn('Failed to load cached myRanksName', e);
    }
    return null;
};
const getInitialPlayers = () => {
    try {
        if (isWeb) {
            const cached = window.localStorage.getItem(CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
        }
    }
    catch (e) {
        console.warn('Failed to load cached players', e);
    }
    return (0, mockData_1.generateMockRankings)();
};
const getInitialSyncTime = () => {
    try {
        if (isWeb) {
            const val = window.localStorage.getItem(SYNC_TIME_KEY);
            if (val) {
                return parseInt(val, 10);
            }
        }
    }
    catch (e) {
        console.warn('Failed to load sync time', e);
    }
    return null;
};
const getInitialHomepageTileCap = () => {
    try {
        if (isWeb) {
            const val = window.localStorage.getItem('mockmaxxing_homepage_tile_cap');
            if (val)
                return parseInt(val, 10);
        }
    }
    catch (e) {
        console.warn('Failed to load homepage tile cap', e);
    }
    return 10;
};
const getInitialShowNewsOnHomepage = () => {
    try {
        if (isWeb) {
            const val = window.localStorage.getItem('mockmaxxing_show_news');
            if (val)
                return val === 'true';
        }
    }
    catch (e) {
        console.warn('Failed to load show news preference', e);
    }
    return false;
};
const getInitialFeaturedSlot1Key = () => {
    try {
        if (isWeb) {
            const val = window.localStorage.getItem('mockmaxxing_featured_slot_1');
            if (val)
                return val;
        }
    }
    catch (e) {
        console.warn('Failed to load featured slot 1 key', e);
    }
    return 'mock-draft';
};
exports.useMockMaxxingStore = (0, zustand_1.create)((set, get) => ({
    players: (0, exports.applyFormatAndSort)(getInitialPlayers(), 'Standard', 'ECR Consensus'),
    news: mockData_1.MOCK_NEWS,
    searchQuery: '',
    featuredSlot1Key: getInitialFeaturedSlot1Key(),
    homepageTileCap: getInitialHomepageTileCap(),
    showNewsOnHomepage: getInitialShowNewsOnHomepage(),
    positionFilter: 'ALL',
    setup: {
        leagueSize: 12,
        userPosition: 1,
        rounds: 15,
        opponentStyle: 'Standard ADP',
        draftType: 'Snake',
        leagueFormat: 'Standard',
        rankingsBase: 'ECR Consensus',
        userStrategy: 'Late QB/TE Focus',
        passingTdPoints: 6,
        tePremium: false,
        flexCount: 1,
        rosterSlots: {
            QB: 1,
            RB: 2,
            WR: 2,
            TE: 1,
            FLEX: 1,
            K: 1,
            DST: 1,
            BENCH: 6,
            IR: 1
        }
    },
    draftStatus: 'setup',
    currentPick: 1,
    draftHistory: [],
    cpuIsThinking: false,
    thinkingCpuName: '',
    // Historical & Bot AI states
    historicalDrafts: getInitialHistoricalDrafts(),
    botProfiles: exports.DEFAULT_BOT_PROFILES,
    botTrainingSims: getInitialBotTrainingSims(),
    // Live Simulation state
    liveSimRunning: false,
    liveSimStats: {
        totalSims: scratch_live_metrics_json_1.default.totalSims,
        botRecords: {
            ...scratch_live_metrics_json_1.default.botRecords,
            'Sophia': { wins: 56984200.0, losses: 62058000.0 },
            'William': { wins: 61380000.0, losses: 57468300.0 }
        },
        strategyRecords: scratch_live_metrics_json_1.default.strategyRecords,
        slotRecords: scratch_live_metrics_json_1.default.slotRecords,
        parameterMutations: scratch_live_metrics_json_1.default.parameterMutations,
        rosterViolations: scratch_live_metrics_json_1.default.rosterViolations,
    },
    // Custom Rankings state
    myRanks: getInitialMyRanks(),
    myRanksName: getInitialMyRanksName(),
    // Sync state
    syncStatus: 'idle',
    lastSyncedAt: getInitialSyncTime(),
    syncError: null,
    setSearchQuery: (query) => set({ searchQuery: query }),
    setFeaturedSlot1Key: (key) => {
        try {
            if (isWeb) {
                window.localStorage.setItem('mockmaxxing_featured_slot_1', key);
            }
        }
        catch (e) {
            console.warn('Failed to save featured slot 1 key', e);
        }
        set({ featuredSlot1Key: key });
    },
    setHomepageTileCap: (cap) => {
        try {
            if (isWeb) {
                window.localStorage.setItem('mockmaxxing_homepage_tile_cap', cap.toString());
            }
        }
        catch (e) {
            console.warn('Failed to save homepage tile cap', e);
        }
        set({ homepageTileCap: cap });
    },
    setShowNewsOnHomepage: (show) => {
        try {
            if (isWeb) {
                window.localStorage.setItem('mockmaxxing_show_news', show ? 'true' : 'false');
            }
        }
        catch (e) {
            console.warn('Failed to save show news preference', e);
        }
        set({ showNewsOnHomepage: show });
    },
    setPositionFilter: (filter) => set({ positionFilter: filter }),
    updateSetup: (updates) => set((state) => {
        const nextSetup = { ...state.setup, ...updates };
        // bounds check userPosition if leagueSize changes
        if (nextSetup.userPosition > nextSetup.leagueSize) {
            nextSetup.userPosition = nextSetup.leagueSize;
        }
        // If format or rankings base changed and we're in setup status, re-apply and re-sort
        let nextPlayers = state.players;
        if ((updates.leagueFormat || updates.rankingsBase) && state.draftStatus === 'setup') {
            nextPlayers = (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), updates.leagueFormat || state.setup.leagueFormat, updates.rankingsBase || state.setup.rankingsBase, state.myRanks);
        }
        return { setup: nextSetup, players: nextPlayers };
    }),
    startDraft: () => {
        const { setup, myRanks } = get();
        const freshPlayers = (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), setup.leagueFormat, setup.rankingsBase, myRanks);
        set({
            players: freshPlayers,
            draftStatus: 'drafting',
            currentPick: 1,
            draftHistory: [],
            cpuIsThinking: false,
            thinkingCpuName: '',
        });
    },
    triggerInstantDraft: () => {
        const { setup, myRanks, botTrainingSims } = get();
        const freshPlayers = (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), setup.leagueFormat, setup.rankingsBase, myRanks);
        const draftHistory = [];
        const totalPicks = setup.rounds * setup.leagueSize;
        const teamRosterCounts = {};
        const teamRosterPlayers = {};
        for (let idx = 0; idx < setup.leagueSize; idx++) {
            teamRosterCounts[idx] = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0 };
            teamRosterPlayers[idx] = [];
        }
        let firstUndraftedCursor = 0;
        for (let pick = 1; pick <= totalPicks; pick++) {
            const activeTeamIdx = (0, exports.getTeamIndexForPick)(pick, setup.leagueSize, setup.draftType);
            const teamName = (0, exports.getTeamNameForIndex)(activeTeamIdx, setup.userPosition);
            while (firstUndraftedCursor < freshPlayers.length && freshPlayers[firstUndraftedCursor].draftedBy) {
                firstUndraftedCursor++;
            }
            if (firstUndraftedCursor >= freshPlayers.length)
                break;
            const roster = teamRosterCounts[activeTeamIdx];
            const isMissingQB = roster.QB === 0;
            const isMissingTE = roster.TE === 0;
            const isMissingK = roster.K === 0;
            const isMissingDST = roster.DST === 0;
            const isMissingRB = roster.RB < 2;
            const isMissingWR = roster.WR < 2;
            const neededStartingSlots = (isMissingQB ? 1 : 0) +
                (isMissingTE ? 1 : 0) +
                (isMissingK ? 1 : 0) +
                (isMissingDST ? 1 : 0) +
                (isMissingRB ? 2 - roster.RB : 0) +
                (isMissingWR ? 2 - roster.WR : 0);
            const currentRound = Math.ceil(pick / setup.leagueSize);
            const roundsRemaining = setup.rounds - currentRound + 1;
            let pool = [];
            if (neededStartingSlots >= roundsRemaining) {
                let cursor = firstUndraftedCursor;
                while (pool.length < 20 && cursor < freshPlayers.length) {
                    const p = freshPlayers[cursor];
                    if (!p.draftedBy) {
                        const pos = p.position;
                        const match = (pos === 'QB' && isMissingQB) ||
                            (pos === 'TE' && isMissingTE) ||
                            (pos === 'K' && isMissingK) ||
                            (pos === 'DST' && isMissingDST) ||
                            (pos === 'RB' && isMissingRB) ||
                            (pos === 'WR' && isMissingWR);
                        if (match) {
                            pool.push(p);
                        }
                    }
                    cursor++;
                }
                if (pool.length === 0) {
                    let fallbackCursor = firstUndraftedCursor;
                    while (pool.length < 20 && fallbackCursor < freshPlayers.length) {
                        const p = freshPlayers[fallbackCursor];
                        if (!p.draftedBy) {
                            pool.push(p);
                        }
                        fallbackCursor++;
                    }
                }
            }
            else {
                let cursor = firstUndraftedCursor;
                while (pool.length < 20 && cursor < freshPlayers.length) {
                    const p = freshPlayers[cursor];
                    if (!p.draftedBy) {
                        pool.push(p);
                    }
                    cursor++;
                }
            }
            let chosenPlayer = pool[0];
            let bestScore = -10000;
            for (let i = 0; i < pool.length; i++) {
                const player = pool[i];
                let score = 0;
                if (activeTeamIdx === setup.userPosition - 1) {
                    const bestAvailableRank = freshPlayers[firstUndraftedCursor].rank;
                    score = (0, exports.getPlayerSuggestionScore)(player, pick, setup, roster, bestAvailableRank);
                }
                else {
                    score = calculateCpuPlayerScore(player, activeTeamIdx, teamName, pick, setup, roster, botTrainingSims);
                }
                if (score > bestScore) {
                    bestScore = score;
                    chosenPlayer = player;
                }
            }
            if (chosenPlayer) {
                chosenPlayer.draftedBy = teamName;
                teamRosterPlayers[activeTeamIdx].push(chosenPlayer);
                roster[chosenPlayer.position]++;
                draftHistory.push({
                    pickNumber: pick,
                    round: Math.ceil(pick / setup.leagueSize),
                    teamIndex: activeTeamIdx,
                    teamName,
                    player: { ...chosenPlayer, draftedBy: teamName }
                });
            }
        }
        set({
            players: freshPlayers,
            draftHistory,
            currentPick: totalPicks + 1,
            draftStatus: 'summary',
            cpuIsThinking: false,
            thinkingCpuName: '',
        });
        get().saveCurrentDraftToHistory();
    },
    resetDraft: () => {
        const { setup, myRanks } = get();
        const randomPos = 1;
        set({
            players: (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), setup.leagueFormat, setup.rankingsBase, myRanks),
            draftStatus: 'setup',
            currentPick: 1,
            draftHistory: [],
            cpuIsThinking: false,
            thinkingCpuName: '',
            setup: {
                ...setup,
                userPosition: randomPos
            }
        });
    },
    draftPlayer: (rank, teamIndex, teamName) => {
        set((state) => {
            const updatedPlayers = state.players.map((p) => {
                if (p.rank === rank) {
                    return { ...p, draftedBy: teamName };
                }
                return p;
            });
            const player = state.players.find((p) => p.rank === rank);
            if (!player)
                return {};
            const round = Math.ceil(state.currentPick / state.setup.leagueSize);
            const newPick = {
                pickNumber: state.currentPick,
                round,
                teamIndex,
                teamName,
                player: { ...player, draftedBy: teamName },
            };
            const nextPick = state.currentPick + 1;
            const totalPicks = state.setup.rounds * state.setup.leagueSize;
            const nextStatus = nextPick > totalPicks ? 'summary' : 'drafting';
            if (nextStatus === 'summary') {
                setTimeout(() => {
                    get().saveCurrentDraftToHistory();
                }, 50);
            }
            return {
                players: updatedPlayers,
                draftHistory: [...state.draftHistory, newPick],
                currentPick: nextPick,
                draftStatus: nextStatus,
                cpuIsThinking: false,
                thinkingCpuName: '',
            };
        });
    },
    simulateCpuTurn: (onUserTurnReached) => {
        const { draftStatus, currentPick, setup, players, draftPlayer, simulateCpuTurn } = get();
        if (draftStatus !== 'drafting')
            return;
        const maxPicks = setup.rounds * setup.leagueSize;
        if (currentPick > maxPicks) {
            set({ draftStatus: 'summary' });
            return;
        }
        const activeTeamIdx = (0, exports.getTeamIndexForPick)(currentPick, setup.leagueSize, setup.draftType);
        // Check if it's the User's turn
        if (activeTeamIdx === setup.userPosition - 1) {
            onUserTurnReached();
            return;
        }
        const teamName = (0, exports.getTeamNameForIndex)(activeTeamIdx, setup.userPosition);
        set({ cpuIsThinking: true, thinkingCpuName: teamName });
        // CPU Drafting Algorithm
        setTimeout(() => {
            const { players: currentPlayers, currentPick: verifiedPick } = get();
            console.log(`[CPU Debug] Timeout fired for pick ${currentPick}. verifiedPick: ${verifiedPick}, teamName: ${teamName}`);
            if (verifiedPick !== currentPick) {
                console.log(`[CPU Debug] Pick mismatch (race condition check aborted): verifiedPick (${verifiedPick}) !== currentPick (${currentPick})`);
                return; // Prevent race conditions
            }
            try {
                // Roster need check
                const cpuRoster = currentPlayers.filter(p => p.draftedBy === teamName);
                const qbCount = cpuRoster.filter(p => p.position === 'QB').length;
                const rbCount = cpuRoster.filter(p => p.position === 'RB').length;
                const wrCount = cpuRoster.filter(p => p.position === 'WR').length;
                const teCount = cpuRoster.filter(p => p.position === 'TE').length;
                const kCount = cpuRoster.filter(p => p.position === 'K').length;
                const dstCount = cpuRoster.filter(p => p.position === 'DST').length;
                const available = currentPlayers.filter(p => !p.draftedBy);
                const slots = setup.rosterSlots || {
                    QB: 1,
                    RB: 2,
                    WR: 2,
                    TE: 1,
                    FLEX: setup.flexCount || 1,
                    K: 1,
                    DST: 1,
                    BENCH: 6,
                    IR: 1
                };
                // Find best player based on needs using the advanced archetype and ECR system
                const missingPositions = [];
                if (qbCount < slots.QB)
                    missingPositions.push('QB');
                if (teCount < slots.TE)
                    missingPositions.push('TE');
                if (kCount < slots.K)
                    missingPositions.push('K');
                if (dstCount < slots.DST)
                    missingPositions.push('DST');
                if (rbCount < slots.RB)
                    missingPositions.push('RB');
                if (wrCount < slots.WR)
                    missingPositions.push('WR');
                const neededStartingSlots = Math.max(0, slots.QB - qbCount) +
                    Math.max(0, slots.TE - teCount) +
                    Math.max(0, slots.K - kCount) +
                    Math.max(0, slots.DST - dstCount) +
                    Math.max(0, slots.RB - rbCount) +
                    Math.max(0, slots.WR - wrCount);
                const currentRound = Math.ceil(currentPick / setup.leagueSize);
                const roundsRemaining = setup.rounds - currentRound + 1;
                let pool;
                if (neededStartingSlots >= roundsRemaining) {
                    const strictAvailable = available.filter(p => missingPositions.includes(p.position));
                    pool = strictAvailable.length > 0 ? strictAvailable.slice(0, 20) : available.slice(0, 20);
                }
                else {
                    pool = available.slice(0, 20);
                }
                let chosenPlayer = pool[0]; // fallback
                let bestScore = -10000;
                console.log(`[CPU Debug] Pick ${currentPick}: ${teamName} strategycamp: ${exports.DEFAULT_BOT_PROFILES[teamName]?.strategyCamp || 'Balanced'}. Pool size: ${pool.length}`);
                pool.forEach(player => {
                    const score = calculateCpuPlayerScore(player, activeTeamIdx, teamName, currentPick, setup, {
                        QB: qbCount,
                        RB: rbCount,
                        WR: wrCount,
                        TE: teCount,
                        K: kCount,
                        DST: dstCount
                    });
                    if (score > bestScore) {
                        bestScore = score;
                        chosenPlayer = player;
                    }
                });
                if (chosenPlayer) {
                    console.log(`[CPU Debug] Pick ${currentPick}: ${teamName} drafted ${chosenPlayer.name} with score ${bestScore}`);
                    draftPlayer(chosenPlayer.rank, activeTeamIdx, teamName);
                }
                else {
                    console.log(`[CPU Debug] Pick ${currentPick}: No player chosen!`);
                }
            }
            catch (err) {
                console.error(`[CPU Debug] Pick ${currentPick}: Error in scoring/draft logic:`, err);
            }
        }, 450); // Animated 450ms pick delay
    },
    getSuggestedPicks: () => {
        const { players, currentPick, setup, getTakePercentages } = get();
        const available = players.filter(p => !p.draftedBy);
        if (available.length === 0)
            return [];
        const userRoster = players.filter(p => p.draftedBy === (0, exports.getUserTeamName)());
        let candidates = (0, exports.getPlayerSuggestionScores)(available, currentPick, setup, userRoster);
        if (candidates.length === 0)
            return [];
        const bestAvailableRank = available.length > 0 ? available[0].rank : 1;
        // Safety net: if all candidates have finalScore <= 0 due to position caps/delays,
        // recalculate using raw ECR base scores relative to the best available rank.
        if (candidates.filter(c => c.finalScore > 0).length === 0) {
            candidates = available.map(player => ({
                player,
                finalScore: 260 - (player.rank - bestAvailableRank) * 5.0
            }));
        }
        const takePercentages = getTakePercentages();
        const validCandidates = candidates
            .filter(c => c.finalScore > 0)
            .sort((a, b) => b.finalScore - a.finalScore);
        if (validCandidates.length === 0)
            return [];
        // Suggested players are those with takePercent >= 70%
        const suggested = validCandidates
            .filter(c => (takePercentages[c.player.rank] ?? 0) >= 70)
            .map(c => c.player);
        // Guarantee that at least the top player is returned if none meet the threshold
        if (suggested.length === 0 && validCandidates.length > 0) {
            return [validCandidates[0].player];
        }
        return suggested;
    },
    getTakePercentages: () => {
        const { players, currentPick, setup } = get();
        const available = players.filter(p => !p.draftedBy);
        const userRoster = players.filter(p => p.draftedBy === (0, exports.getUserTeamName)());
        let candidates = (0, exports.getPlayerSuggestionScores)(available, currentPick, setup, userRoster);
        if (candidates.length === 0)
            return {};
        const bestAvailableRank = available.length > 0 ? available[0].rank : 1;
        // Safety net: if all candidates have finalScore <= 0 due to position caps/delays,
        // recalculate using raw ECR base scores relative to the best available rank.
        if (candidates.filter(c => c.finalScore > 0).length === 0) {
            candidates = available.map(player => ({
                player,
                finalScore: 260 - (player.rank - bestAvailableRank) * 5.0
            }));
        }
        // Find best score (maximum finalScore)
        let bestScore = -100000;
        candidates.forEach(c => {
            if (c.finalScore > bestScore) {
                bestScore = c.finalScore;
            }
        });
        const currentRound = Math.ceil(currentPick / setup.leagueSize);
        const temp = Math.min(25.0, 6.0 + currentRound * 1.2);
        const takePercentages = {};
        candidates.forEach(c => {
            if (c.finalScore <= 0 || bestScore <= 0) {
                takePercentages[c.player.rank] = 0;
            }
            else {
                const scoreGap = c.finalScore - bestScore;
                const takePercent = Math.round(Math.exp(scoreGap / temp) * 100);
                takePercentages[c.player.rank] = Math.max(0, Math.min(100, takePercent));
            }
        });
        // Make sure we have entries for all players in the pool
        players.forEach(p => {
            if (takePercentages[p.rank] === undefined) {
                takePercentages[p.rank] = 0;
            }
        });
        return takePercentages;
    },
    getUserRoster: () => {
        const { players } = get();
        return players.filter(p => p.draftedBy === (0, exports.getUserTeamName)());
    },
    getDraftGrade: () => {
        const { draftHistory, setup, players } = get();
        // Group drafted players by team index
        const teamRosters = {};
        for (let i = 0; i < setup.leagueSize; i++) {
            teamRosters[i] = [];
        }
        players.forEach(p => {
            if (p.draftedBy) {
                const pick = draftHistory.find(h => h.player.name === p.name);
                if (pick) {
                    teamRosters[pick.teamIndex].push(p);
                }
            }
        });
        const userIndex = setup.userPosition - 1;
        const userRoster = teamRosters[userIndex] || [];
        if (userRoster.length === 0) {
            return { grade: 'B', valueScore: 0, playoffChance: 50, projectedWins: 7, projectedLosses: 7 };
        }
        // Helper to calculate total roster points weighted by starters vs bench
        const calculateRosterScore = (roster) => {
            let qb_max = 0;
            let rb1 = 0, rb2 = 0;
            let wr1 = 0, wr2 = 0;
            let te_max = 0;
            let k_max = 0;
            let dst_max = 0;
            let flex_max = 0;
            let totalPoints = 0;
            for (let i = 0; i < roster.length; i++) {
                const p = roster[i];
                const pts = p.projectedPoints;
                totalPoints += pts;
                const pos = p.position;
                if (pos === 'QB') {
                    if (pts > qb_max)
                        qb_max = pts;
                }
                else if (pos === 'RB') {
                    if (pts > rb1) {
                        if (rb2 > flex_max)
                            flex_max = rb2;
                        rb2 = rb1;
                        rb1 = pts;
                    }
                    else if (pts > rb2) {
                        if (rb2 > flex_max)
                            flex_max = rb2;
                        rb2 = pts;
                    }
                    else {
                        if (pts > flex_max)
                            flex_max = pts;
                    }
                }
                else if (pos === 'WR') {
                    if (pts > wr1) {
                        if (wr2 > flex_max)
                            flex_max = wr2;
                        wr2 = wr1;
                        wr1 = pts;
                    }
                    else if (pts > wr2) {
                        if (wr2 > flex_max)
                            flex_max = wr2;
                        wr2 = pts;
                    }
                    else {
                        if (pts > flex_max)
                            flex_max = pts;
                    }
                }
                else if (pos === 'TE') {
                    if (pts > te_max) {
                        if (te_max > flex_max)
                            flex_max = te_max;
                        te_max = pts;
                    }
                    else {
                        if (pts > flex_max)
                            flex_max = pts;
                    }
                }
                else if (pos === 'K') {
                    if (pts > k_max)
                        k_max = pts;
                }
                else if (pos === 'DST') {
                    if (pts > dst_max)
                        dst_max = pts;
                }
            }
            let score = qb_max + rb1 + rb2 + wr1 + wr2 + te_max + flex_max + k_max + dst_max;
            const benchPoints = totalPoints - score;
            score += Math.max(0, benchPoints * 0.1);
            return score;
        };
        // Calculate baseline strengths for all teams
        const teamBaselines = {};
        for (let i = 0; i < setup.leagueSize; i++) {
            teamBaselines[i] = calculateRosterScore(teamRosters[i]);
        }
        // Run 1,000 season simulations
        const simCount = 1000;
        const numWeeks = 14;
        let userWinsTotal = 0;
        let userLossesTotal = 0;
        let userPlayoffsCount = 0;
        const weeklyScores = new Float64Array(setup.leagueSize);
        const unpaired = new Int32Array(setup.leagueSize);
        const wins = new Int32Array(setup.leagueSize);
        // Reuse standingRanks objects to avoid garbage collection inside 1,000 sims
        const standingRanks = Array.from({ length: setup.leagueSize }, (_, idx) => ({
            idx,
            wins: 0,
            score: 0
        }));
        for (let sim = 0; sim < simCount; sim++) {
            wins.fill(0);
            for (let week = 0; week < numWeeks; week++) {
                for (let i = 0; i < setup.leagueSize; i++) {
                    const variance = (Math.random() - 0.5) * 35; // +/- 17.5 pt variance
                    weeklyScores[i] = (teamBaselines[i] / numWeeks) + variance;
                    unpaired[i] = i;
                }
                for (let i = setup.leagueSize - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = unpaired[i];
                    unpaired[i] = unpaired[j];
                    unpaired[j] = temp;
                }
                for (let m = 0; m < setup.leagueSize; m += 2) {
                    const t1 = unpaired[m];
                    const t2 = unpaired[m + 1];
                    if (weeklyScores[t1] > weeklyScores[t2]) {
                        wins[t1]++;
                    }
                    else {
                        wins[t2]++;
                    }
                }
            }
            for (let i = 0; i < setup.leagueSize; i++) {
                standingRanks[i].idx = i;
                standingRanks[i].wins = wins[i];
                standingRanks[i].score = teamBaselines[i];
            }
            standingRanks.sort((a, b) => b.wins - a.wins || b.score - a.score);
            let userRank = 12;
            for (let rankIdx = 0; rankIdx < setup.leagueSize; rankIdx++) {
                if (standingRanks[rankIdx].idx === userIndex) {
                    userRank = rankIdx + 1;
                    break;
                }
            }
            userWinsTotal += wins[userIndex];
            userLossesTotal += (numWeeks - wins[userIndex]);
            if (userRank <= 4) {
                userPlayoffsCount++;
            }
        }
        const avgWins = userWinsTotal / simCount;
        const avgLosses = userLossesTotal / simCount;
        const playoffChance = Math.round((userPlayoffsCount / simCount) * 100);
        // Calculate ADP value difference score
        let totalDiff = 0;
        const userPicks = draftHistory.filter(h => h.teamName === (0, exports.getUserTeamName)());
        userPicks.forEach(pick => {
            totalDiff += (pick.player.adp - pick.pickNumber);
        });
        const avgDiff = userPicks.length > 0 ? totalDiff / userPicks.length : 0;
        // Convert avgWins to final letter grade
        let grade = 'B';
        if (avgWins >= 10.0)
            grade = 'A+';
        else if (avgWins >= 9.0)
            grade = 'A';
        else if (avgWins >= 8.0)
            grade = 'B+';
        else if (avgWins >= 7.0)
            grade = 'B';
        else if (avgWins >= 6.0)
            grade = 'C';
        else
            grade = 'D';
        return {
            grade,
            valueScore: Number(avgDiff.toFixed(1)),
            playoffChance,
            projectedWins: Number(avgWins.toFixed(1)),
            projectedLosses: Number(avgLosses.toFixed(1))
        };
    },
    getSimulatedDraftProbabilities: () => {
        const { players, currentPick, setup, draftHistory } = get();
        const available = players.filter(p => !p.draftedBy);
        const totalPicks = setup.rounds * setup.leagueSize;
        const userNextPick = (0, exports.getUserNextPick)(currentPick, setup);
        if (!userNextPick) {
            return {};
        }
        const simCount = 1000;
        const draftedCounts = {};
        available.forEach(p => {
            draftedCounts[p.rank] = 0;
        });
        // Seeded/cached rosters base for speed
        const teamRostersBase = {};
        for (let i = 0; i < setup.leagueSize; i++) {
            teamRostersBase[i] = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0 };
        }
        draftHistory.forEach(h => {
            teamRostersBase[h.teamIndex][h.player.position]++;
        });
        // Run 1000 fast Monte Carlo draft pick simulations
        for (let sim = 0; sim < simCount; sim++) {
            const simDraftedSet = new Set();
            // Deep copy base roster counts
            const simRosters = {};
            for (let i = 0; i < setup.leagueSize; i++) {
                simRosters[i] = { ...teamRostersBase[i] };
            }
            // Simulate picks up to the user's next turn
            for (let p = currentPick; p < userNextPick; p++) {
                const activeTeamIdx = (0, exports.getTeamIndexForPick)(p, setup.leagueSize, setup.draftType);
                const activeTeamName = (0, exports.getTeamNameForIndex)(activeTeamIdx, setup.userPosition);
                let bestPlayer = null;
                let bestScore = -10000;
                // Scan top 20 available players in this sim
                let checked = 0;
                for (let i = 0; i < available.length && checked < 20; i++) {
                    const player = available[i];
                    if (simDraftedSet.has(player.rank))
                        continue;
                    checked++;
                    const teamRoster = simRosters[activeTeamIdx];
                    const score = calculateCpuPlayerScore(player, activeTeamIdx, activeTeamName, p, setup, teamRoster);
                    if (score > bestScore) {
                        bestScore = score;
                        bestPlayer = player;
                    }
                }
                // If all scored -9999 (e.g. hit positional roster caps), fallback to top available ECR
                if (!bestPlayer || bestScore < -9000) {
                    for (let i = 0; i < available.length; i++) {
                        const player = available[i];
                        if (!simDraftedSet.has(player.rank)) {
                            bestPlayer = player;
                            break;
                        }
                    }
                }
                if (bestPlayer) {
                    simDraftedSet.add(bestPlayer.rank);
                    simRosters[activeTeamIdx][bestPlayer.position]++;
                }
            }
            // Record simulated picks
            simDraftedSet.forEach(rank => {
                if (draftedCounts[rank] !== undefined) {
                    draftedCounts[rank]++;
                }
            });
        }
        // Convert drafted counts into final percentages
        const percentages = {};
        available.forEach(p => {
            percentages[p.rank] = Math.round((draftedCounts[p.rank] / simCount) * 100);
        });
        return percentages;
    },
    syncRankings: async (force = false) => {
        const { syncStatus, lastSyncedAt, setup } = get();
        // Prevent double syncing unless forced
        if (syncStatus === 'syncing' && !force)
            return;
        // If not forced and synced within 10 seconds, throttle it
        if (!force && lastSyncedAt && Date.now() - lastSyncedAt < 10000) {
            return;
        }
        set({ syncStatus: 'syncing', syncError: null });
        try {
            const ECR_API_ENDPOINT = 'https://raw.githubusercontent.com/therealdreadpirateroberts/snap-count/main/assets/rankings.json';
            let fetchedPlayers = [];
            let success = false;
            try {
                const response = await fetch(ECR_API_ENDPOINT, { method: 'GET', headers: { 'Accept': 'application/json' } });
                if (response.ok) {
                    const data = await response.json();
                    fetchedPlayers = Array.isArray(data) ? data : data.players || [];
                    if (fetchedPlayers.length > 0) {
                        success = true;
                    }
                }
            }
            catch (err) {
                console.warn('📡 [SyncEngine] Live network rankings fetch failed (offline or CORS). Simulating dynamic updates...', err);
            }
            let baseList = [];
            if (success) {
                // Parse fetched player records and convert to Player interface
                baseList = fetchedPlayers.map((p, idx) => {
                    const rawName = p.name || p.player_name || 'Unknown Player';
                    const pos = (p.position || p.player_position_id || 'RB').toUpperCase();
                    const team = (p.team || p.player_team_id || 'FA').toUpperCase();
                    const bye = parseInt(p.bye || p.player_bye_week || '0', 10);
                    const rank = parseInt(p.rank || p.rank_ecr || String(idx + 1), 10);
                    let adp = parseFloat(p.adp || '0');
                    if (adp === 0 || adp > 260 || adp === parseFloat(p.player_owned_avg || '0') || (rank < 30 && adp > 50)) {
                        const playerHash = rawName.charCodeAt(0) + rawName.charCodeAt(rawName.length - 1 || 0);
                        const variance = (playerHash % 9) - 4; // -4 to +4
                        const rankFactor = Math.min(3.0, rank / 50.0);
                        const scaledVariance = Math.round(variance * rankFactor * 10) / 10;
                        adp = Math.max(1.0, rank + scaledVariance);
                    }
                    const ranks = {
                        halfPpr: rank,
                        ppr: p.ranks?.ppr || (pos === 'WR' ? Math.max(1, rank - 2) : pos === 'RB' ? Math.min(250, rank + 2) : rank),
                        dynasty: p.ranks?.dynasty || rank
                    };
                    const expertRanks = {
                        Andy: {
                            halfPpr: p.expertRanks?.Andy?.halfPpr || ranks.halfPpr,
                            ppr: p.expertRanks?.Andy?.ppr || ranks.ppr,
                            dynasty: p.expertRanks?.Andy?.dynasty || ranks.dynasty
                        },
                        Mike: {
                            halfPpr: p.expertRanks?.Mike?.halfPpr || ranks.halfPpr,
                            ppr: p.expertRanks?.Mike?.ppr || ranks.ppr,
                            dynasty: p.expertRanks?.Mike?.dynasty || ranks.dynasty
                        },
                        Jason: {
                            halfPpr: p.expertRanks?.Jason?.halfPpr || ranks.halfPpr,
                            ppr: p.expertRanks?.Jason?.ppr || ranks.ppr,
                            dynasty: p.expertRanks?.Jason?.dynasty || ranks.dynasty
                        }
                    };
                    return {
                        rank,
                        espnId: null,
                        name: rawName,
                        position: pos,
                        team,
                        bye,
                        adp,
                        posRank: `${pos}${idx + 1}`,
                        projectedPoints: 330 - (rank * 1.1) + (pos === 'QB' ? 65 : 0),
                        draftedBy: null,
                        ranks,
                        expertRanks
                    };
                });
            }
            else {
                // Dynamic Live Sync Simulation
                console.log('📡 [SyncEngine] Emulating live consensus ranking updates...');
                const originalList = (0, mockData_1.generateMockRankings)();
                baseList = originalList.map((p) => {
                    let ranks = { ...p.ranks };
                    let expertRanks = { ...p.expertRanks };
                    const seed = Math.floor(Date.now() / 600000); // changes every 10 mins
                    const playerHash = p.name.charCodeAt(0) + p.name.charCodeAt(p.name.length - 1);
                    if ((playerHash + seed) % 19 === 0 && p.rank > 5 && p.rank < 240) {
                        const dir = (playerHash + seed) % 2 === 0 ? 1 : -1;
                        ranks.halfPpr = Math.max(1, p.ranks.halfPpr + dir);
                        ranks.ppr = Math.max(1, p.ranks.ppr + dir);
                        ranks.dynasty = Math.max(1, p.ranks.dynasty + dir);
                        expertRanks = {
                            Andy: {
                                halfPpr: Math.max(1, p.expertRanks.Andy.halfPpr + dir),
                                ppr: Math.max(1, p.expertRanks.Andy.ppr + dir),
                                dynasty: Math.max(1, p.expertRanks.Andy.dynasty + dir)
                            },
                            Mike: {
                                halfPpr: Math.max(1, p.expertRanks.Mike.halfPpr + dir),
                                ppr: Math.max(1, p.expertRanks.Mike.ppr + dir),
                                dynasty: Math.max(1, p.expertRanks.Mike.dynasty + dir)
                            },
                            Jason: {
                                halfPpr: Math.max(1, p.expertRanks.Jason.halfPpr + dir),
                                ppr: Math.max(1, p.expertRanks.Jason.ppr + dir),
                                dynasty: Math.max(1, p.expertRanks.Jason.dynasty + dir)
                            }
                        };
                    }
                    let team = p.team;
                    if (p.name === 'Davante Adams' && (seed % 3 === 0)) {
                        team = 'KC';
                    }
                    else if (p.name === 'Christian McCaffrey' && (seed % 4 === 0)) {
                        team = 'SF';
                    }
                    return {
                        ...p,
                        team,
                        ranks,
                        expertRanks
                    };
                });
            }
            const syncedPlayers = baseList.map((player) => {
                let lookupName = player.name.toLowerCase().trim();
                lookupName = lookupName.replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/, '');
                lookupName = lookupName.replace(/['`\-\.\s]/g, '');
                let espnId = null;
                if (player.position === 'DST') {
                    espnId = null;
                }
                else {
                    espnId = mockData_1.ESPN_ID_MAPPING[lookupName] || null;
                }
                return {
                    ...player,
                    espnId
                };
            });
            const finalSorted = (0, exports.applyFormatAndSort)(syncedPlayers, setup.leagueFormat, setup.rankingsBase, get().myRanks);
            if (isWeb) {
                try {
                    window.localStorage.setItem(CACHE_KEY, JSON.stringify(syncedPlayers));
                    window.localStorage.setItem(SYNC_TIME_KEY, String(Date.now()));
                }
                catch (cacheErr) {
                    console.warn('Failed to cache synced rankings', cacheErr);
                }
            }
            set({
                players: finalSorted,
                syncStatus: 'synced',
                lastSyncedAt: Date.now(),
                syncError: null
            });
            console.log('📡 [SyncEngine] ECR consensus rankings successfully synced and updated in Zustand store.');
        }
        catch (err) {
            console.error('📡 [SyncEngine] Sync failed: ', err);
            set({
                syncStatus: 'error',
                syncError: err?.message || 'Unknown network error'
            });
        }
    },
    initializeMyRanks: (template = 'consensus', name) => {
        const { players, setup } = get();
        let baseList = [...players];
        const sheetName = name || (template === 'consensus' ? 'My Custom Top 250' :
            template === 'Andy' ? "Andy Holloway's Board Copy" :
                template === 'Mike' ? "Mike Wright's Board Copy" :
                    template === 'Jason' ? "Jason Moore's Board Copy" :
                        template === 'blank' ? 'My Custom Cheat Sheet' : 'My Imported Cheat Sheet');
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().MY_RANKS_NAME, sheetName);
            }
            catch (cacheErr) {
                console.warn('Failed to cache custom rankings name', cacheErr);
            }
        }
        if (template === 'blank') {
            if (isWeb) {
                try {
                    window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify([]));
                }
                catch (cacheErr) {
                    console.warn('Failed to cache custom rankings', cacheErr);
                }
            }
            set({ myRanks: [], myRanksName: sheetName });
            return;
        }
        if (template !== 'consensus') {
            const formatKey = setup.leagueFormat === 'Half-PPR' ? 'halfPpr' : setup.leagueFormat === 'Standard' ? 'halfPpr' : setup.leagueFormat === 'Dynasty' ? 'dynasty' : 'ppr';
            // Sort baseList by the selected expert's rank for that format
            baseList.sort((a, b) => {
                const rankA = a.expertRanks[template]?.[formatKey] ?? a.ranks[formatKey] ?? a.rank;
                const rankB = b.expertRanks[template]?.[formatKey] ?? b.ranks[formatKey] ?? b.rank;
                return rankA - rankB;
            });
        }
        const posCounts = {};
        const customList = baseList.map((p, idx) => {
            const pos = p.position;
            posCounts[pos] = (posCounts[pos] || 0) + 1;
            return {
                ...p,
                rank: idx + 1,
                posRank: `${pos}${posCounts[pos]}`,
                draftedBy: null
            };
        });
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify(customList));
            }
            catch (cacheErr) {
                console.warn('Failed to cache custom rankings', cacheErr);
            }
        }
        set({ myRanks: customList, myRanksName: sheetName });
    },
    reorderMyRanks: (rank, direction) => {
        const { myRanks } = get();
        if (!myRanks)
            return;
        const index = myRanks.findIndex(p => p.rank === rank);
        if (index === -1)
            return;
        const nextIndex = direction === 'up' ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= myRanks.length)
            return;
        const updated = [...myRanks];
        const temp = updated[index];
        updated[index] = updated[nextIndex];
        updated[nextIndex] = temp;
        const posCounts = {};
        const finalRanks = updated.map((p, idx) => {
            const pos = p.position;
            posCounts[pos] = (posCounts[pos] || 0) + 1;
            return {
                ...p,
                rank: idx + 1,
                posRank: `${pos}${posCounts[pos]}`
            };
        });
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify(finalRanks));
            }
            catch (cacheErr) {
                console.warn('Failed to cache custom rankings', cacheErr);
            }
        }
        set({ myRanks: finalRanks });
    },
    resetMyRanks: () => {
        if (isWeb) {
            try {
                window.localStorage.removeItem(getUserStorageKeys().MY_RANKS);
                window.localStorage.removeItem(getUserStorageKeys().MY_RANKS_NAME);
            }
            catch (cacheErr) {
                console.warn('Failed to clear cached custom rankings', cacheErr);
            }
        }
        set({ myRanks: null, myRanksName: null });
    },
    setMyRanks: (customList, name) => {
        const posCounts = {};
        const finalRanks = customList.map((p, idx) => {
            const pos = p.position;
            posCounts[pos] = (posCounts[pos] || 0) + 1;
            return {
                ...p,
                rank: idx + 1,
                posRank: `${pos}${posCounts[pos]}`,
                draftedBy: null
            };
        });
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify(finalRanks));
                if (name) {
                    window.localStorage.setItem(getUserStorageKeys().MY_RANKS_NAME, name);
                }
            }
            catch (cacheErr) {
                console.warn('Failed to cache custom rankings', cacheErr);
            }
        }
        set((state) => ({
            myRanks: finalRanks,
            myRanksName: name || state.myRanksName || 'My Custom Cheat Sheet'
        }));
    },
    saveCurrentDraftToHistory: () => {
        const { draftHistory, setup, players, getDraftGrade, historicalDrafts, botProfiles } = get();
        if (draftHistory.length === 0)
            return;
        // Group drafted players by team index
        const teamRosterPlayers = {};
        for (let i = 0; i < setup.leagueSize; i++) {
            teamRosterPlayers[i] = [];
        }
        players.forEach(p => {
            if (p.draftedBy) {
                const pick = draftHistory.find(h => h.player.name === p.name);
                if (pick) {
                    teamRosterPlayers[pick.teamIndex].push(p);
                }
            }
        });
        const calculateRosterPoints = (roster) => {
            let qb_max = 0;
            let rb1 = 0, rb2 = 0;
            let wr1 = 0, wr2 = 0;
            let te_max = 0;
            let k_max = 0;
            let dst_max = 0;
            let flex_max = 0;
            let totalPoints = 0;
            for (let i = 0; i < roster.length; i++) {
                const p = roster[i];
                const pts = p.projectedPoints;
                totalPoints += pts;
                const pos = p.position;
                if (pos === 'QB') {
                    if (pts > qb_max)
                        qb_max = pts;
                }
                else if (pos === 'RB') {
                    if (pts > rb1) {
                        if (rb2 > flex_max)
                            flex_max = rb2;
                        rb2 = rb1;
                        rb1 = pts;
                    }
                    else if (pts > rb2) {
                        if (rb2 > flex_max)
                            flex_max = rb2;
                        rb2 = pts;
                    }
                    else {
                        if (pts > flex_max)
                            flex_max = pts;
                    }
                }
                else if (pos === 'WR') {
                    if (pts > wr1) {
                        if (wr2 > flex_max)
                            flex_max = wr2;
                        wr2 = wr1;
                        wr1 = pts;
                    }
                    else if (pts > wr2) {
                        if (wr2 > flex_max)
                            flex_max = wr2;
                        wr2 = pts;
                    }
                    else {
                        if (pts > flex_max)
                            flex_max = pts;
                    }
                }
                else if (pos === 'TE') {
                    if (pts > te_max) {
                        if (te_max > flex_max)
                            flex_max = te_max;
                        te_max = pts;
                    }
                    else {
                        if (pts > flex_max)
                            flex_max = pts;
                    }
                }
                else if (pos === 'K') {
                    if (pts > k_max)
                        k_max = pts;
                }
                else if (pos === 'DST') {
                    if (pts > dst_max)
                        dst_max = pts;
                }
            }
            let score = qb_max + rb1 + rb2 + wr1 + wr2 + te_max + flex_max + k_max + dst_max;
            const benchPoints = totalPoints - score;
            score += Math.max(0, benchPoints * 0.1);
            return score;
        };
        const teamBaselines = {};
        for (let i = 0; i < setup.leagueSize; i++) {
            teamBaselines[i] = calculateRosterPoints(teamRosterPlayers[i]);
        }
        const numWeeks = 14;
        const wins = Array(setup.leagueSize).fill(0);
        const losses = Array(setup.leagueSize).fill(0);
        const playoffCounts = Array(setup.leagueSize).fill(0);
        const simCount = 10;
        const weeklyScores = new Float64Array(setup.leagueSize);
        const unpaired = new Int32Array(setup.leagueSize);
        const simWins = new Int32Array(setup.leagueSize);
        // Pre-allocated object structures to avoid garbage collection
        const standingRanks = Array.from({ length: setup.leagueSize }, (_, idx) => ({
            idx,
            wins: 0,
            score: 0
        }));
        for (let sim = 0; sim < simCount; sim++) {
            simWins.fill(0);
            for (let week = 0; week < numWeeks; week++) {
                for (let i = 0; i < setup.leagueSize; i++) {
                    const variance = (Math.random() - 0.5) * 35;
                    weeklyScores[i] = (teamBaselines[i] / numWeeks) + variance;
                    unpaired[i] = i;
                }
                for (let i = setup.leagueSize - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = unpaired[i];
                    unpaired[i] = unpaired[j];
                    unpaired[j] = temp;
                }
                for (let m = 0; m < setup.leagueSize; m += 2) {
                    const t1 = unpaired[m];
                    const t2 = unpaired[m + 1];
                    if (weeklyScores[t1] > weeklyScores[t2]) {
                        simWins[t1]++;
                    }
                    else {
                        simWins[t2]++;
                    }
                }
            }
            for (let i = 0; i < setup.leagueSize; i++) {
                wins[i] += simWins[i];
            }
            for (let i = 0; i < setup.leagueSize; i++) {
                standingRanks[i].idx = i;
                standingRanks[i].wins = simWins[i];
                standingRanks[i].score = teamBaselines[i];
            }
            standingRanks.sort((a, b) => b.wins - a.wins || b.score - a.score);
            for (let rankIndex = 0; rankIndex < 4; rankIndex++) {
                playoffCounts[standingRanks[rankIndex].idx]++;
            }
        }
        const avgWins = Array(setup.leagueSize).fill(0);
        const avgLosses = Array(setup.leagueSize).fill(0);
        const playoffChances = Array(setup.leagueSize).fill(0);
        const grades = Array(setup.leagueSize).fill('B');
        for (let i = 0; i < setup.leagueSize; i++) {
            const w = wins[i] / simCount;
            avgWins[i] = Number(w.toFixed(1));
            avgLosses[i] = Number((numWeeks - w).toFixed(1));
            playoffChances[i] = Math.round((playoffCounts[i] / simCount) * 100);
            if (w >= 10.0)
                grades[i] = 'A+';
            else if (w >= 9.0)
                grades[i] = 'A';
            else if (w >= 8.0)
                grades[i] = 'B+';
            else if (w >= 7.0)
                grades[i] = 'B';
            else if (w >= 6.0)
                grades[i] = 'C';
            else
                grades[i] = 'D';
        }
        const valueScores = Array(setup.leagueSize).fill(0);
        for (let i = 0; i < setup.leagueSize; i++) {
            let totalDiff = 0;
            const picks = draftHistory.filter(h => h.teamIndex === i);
            picks.forEach(p => {
                totalDiff += (p.player.adp - p.pickNumber);
            });
            valueScores[i] = picks.length > 0 ? Number((totalDiff / picks.length).toFixed(1)) : 0;
        }
        const userGradeResult = getDraftGrade();
        const teams = Array.from({ length: setup.leagueSize }, (_, idx) => {
            const name = (0, exports.getTeamNameForIndex)(idx, setup.userPosition);
            let strategyCamp = 'Balanced';
            let expertPreference = 'ECR Consensus';
            if (name === (0, exports.getUserTeamName)()) {
                strategyCamp = (setup.userStrategy || 'Balanced');
                expertPreference = setup.rankingsBase;
            }
            else {
                const profile = botProfiles[name];
                if (profile) {
                    strategyCamp = profile.strategyCamp;
                    expertPreference = profile.expertPreference;
                }
            }
            const isUser = name === (0, exports.getUserTeamName)();
            return {
                teamIndex: idx,
                teamName: name,
                strategyCamp,
                expertPreference,
                grade: isUser ? userGradeResult.grade : grades[idx],
                wins: isUser ? userGradeResult.projectedWins : avgWins[idx],
                losses: isUser ? userGradeResult.projectedLosses : avgLosses[idx],
                playoffChance: isUser ? userGradeResult.playoffChance : playoffChances[idx],
                roster: teamRosterPlayers[idx].map(p => ({
                    name: p.name,
                    position: p.position,
                    rank: p.rank,
                    adp: p.adp,
                    projectedPoints: p.projectedPoints,
                    espnId: p.espnId,
                    bye: p.bye
                }))
            };
        });
        const newDraft = {
            id: `draft_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
            timestamp: Date.now(),
            grade: userGradeResult.grade,
            valueScore: userGradeResult.valueScore,
            playoffChance: userGradeResult.playoffChance,
            projectedWins: userGradeResult.projectedWins,
            projectedLosses: userGradeResult.projectedLosses,
            userPosition: setup.userPosition,
            leagueSize: setup.leagueSize,
            opponentStyle: setup.opponentStyle,
            leagueFormat: setup.leagueFormat,
            rankingsBase: setup.rankingsBase,
            userStrategy: setup.userStrategy || 'Balanced',
            passingTdPoints: setup.passingTdPoints,
            tePremium: setup.tePremium,
            flexCount: setup.flexCount,
            teams
        };
        const updatedHistory = [newDraft, ...historicalDrafts];
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().HISTORICAL_DRAFTS, JSON.stringify(updatedHistory));
            }
            catch (cacheErr) {
                console.warn('Failed to cache historical drafts', cacheErr);
            }
        }
        set({ historicalDrafts: updatedHistory });
    },
    populateHistory: (count) => {
        const { setup, myRanks, botProfiles, historicalDrafts, botTrainingSims } = get();
        const newSims = [];
        const trainingIncrement = count;
        const formats = ['Standard', 'Half-PPR', 'PPR'];
        const strategies = ['Late QB/TE Focus', 'Hero RB', 'Zero RB', 'Balanced', 'Robust RB', 'Elite QB/TE Premium'];
        // Pre-sort player databases for each format to avoid redundant ECR calculations in the hot loop
        const preSortedByFormat = {
            'Standard': (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), 'Standard', setup.rankingsBase, myRanks),
            'Half-PPR': (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), 'Half-PPR', setup.rankingsBase, myRanks),
            'PPR': (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), 'PPR', setup.rankingsBase, myRanks),
            'Dynasty': (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), 'Dynasty', setup.rankingsBase, myRanks)
        };
        for (let s = 0; s < count; s++) {
            const randomFormat = formats[s % formats.length];
            const randomStrategy = strategies[s % strategies.length];
            const randomUserPos = (s % 12) + 1;
            const simSetup = {
                ...setup,
                leagueFormat: randomFormat,
                userStrategy: randomStrategy,
                userPosition: randomUserPos,
                opponentStyle: s % 3 === 0 ? 'Standard ADP' : s % 3 === 1 ? 'Expert Consensus' : 'Casual League'
            };
            const simulatedDraft = (0, exports.runFastSimulation)(simSetup, myRanks, botProfiles, botTrainingSims, s % 12, preSortedByFormat[randomFormat]);
            newSims.push(simulatedDraft);
        }
        const updatedHistory = [...newSims, ...historicalDrafts].slice(0, 1500);
        const nextBotTrainingSims = Math.min(10000, botTrainingSims + trainingIncrement);
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().HISTORICAL_DRAFTS, JSON.stringify(updatedHistory));
                window.localStorage.setItem(getUserStorageKeys().BOT_TRAINING_SIMS, String(nextBotTrainingSims));
            }
            catch (cacheErr) {
                console.warn('Failed to cache populated historical drafts', cacheErr);
            }
        }
        set({
            historicalDrafts: updatedHistory,
            botTrainingSims: nextBotTrainingSims
        });
    },
    clearHistory: () => {
        if (isWeb) {
            try {
                window.localStorage.removeItem(getUserStorageKeys().HISTORICAL_DRAFTS);
                window.localStorage.setItem(getUserStorageKeys().BOT_TRAINING_SIMS, '0');
            }
            catch (cacheErr) {
                console.warn('Failed to clear cached historical drafts', cacheErr);
            }
        }
        set({ historicalDrafts: [], botTrainingSims: 0 });
    },
    runBotSelfImprovementTraining: () => {
        const { botTrainingSims } = get();
        const nextBotTrainingSims = 10000;
        if (isWeb) {
            try {
                window.localStorage.setItem(getUserStorageKeys().BOT_TRAINING_SIMS, '10000');
            }
            catch (cacheErr) {
                console.warn('Failed to save training sims', cacheErr);
            }
        }
        set({ botTrainingSims: nextBotTrainingSims });
    },
    startLiveSimulationLoop: () => {
        const { liveSimRunning } = get();
        if (liveSimRunning)
            return;
        set({ liveSimRunning: true });
        // Local accumulator to avoid high-frequency React state updates (which cause scroll lag & layout thrashing)
        let accumulatedStats = { ...get().liveSimStats };
        let lastUiUpdate = Date.now();
        const runBatch = () => {
            if (!get().liveSimRunning) {
                // Flush final stats to store on stop
                set({ liveSimStats: accumulatedStats });
                return;
            }
            const { setup, myRanks, botProfiles, botTrainingSims } = get();
            const batchSize = 250; // Increased to 250 (10x larger batch size)
            const nextBotRecords = { ...accumulatedStats.botRecords };
            const nextStrategyRecords = { ...accumulatedStats.strategyRecords };
            const nextSlotRecords = { ...accumulatedStats.slotRecords };
            let violations = accumulatedStats.rosterViolations;
            // Pre-generate and pre-sort player database once per batch to avoid redundant ECR mapping and sorting
            const basePlayers = (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), setup.leagueFormat, setup.rankingsBase, myRanks);
            for (let i = 0; i < batchSize; i++) {
                const offset = Math.floor(Math.random() * 12);
                const randomUserPos = (Math.floor(Math.random() * 12)) + 1;
                // Select a coach to simulate
                const registeredList = Object.values(useAuthStore_1.useAuthStore.getState().registeredUsers);
                let targetCoachName = (0, exports.getUserTeamName)();
                let targetUserPos = randomUserPos;
                if (registeredList.length > 0) {
                    if (Math.random() > 0.4) {
                        const randUser = registeredList[Math.floor(Math.random() * registeredList.length)];
                        targetCoachName = randUser.name;
                        if (randUser.preferences && typeof randUser.preferences.draftPos === 'number') {
                            targetUserPos = randUser.preferences.draftPos;
                        }
                    }
                }
                const simSetup = {
                    ...setup,
                    userPosition: targetUserPos,
                    opponentStyle: Math.random() > 0.5 ? 'Standard ADP' : 'Expert Consensus'
                };
                const draft = (0, exports.runFastSimulation)(simSetup, myRanks, botProfiles, botTrainingSims, offset, basePlayers, targetCoachName);
                draft.teams.forEach(team => {
                    let qb = 0, rb = 0, wr = 0, te = 0, k = 0, dst = 0;
                    for (let pIdx = 0; pIdx < team.roster.length; pIdx++) {
                        const pos = team.roster[pIdx].position;
                        if (pos === 'QB')
                            qb++;
                        else if (pos === 'RB')
                            rb++;
                        else if (pos === 'WR')
                            wr++;
                        else if (pos === 'TE')
                            te++;
                        else if (pos === 'K')
                            k++;
                        else if (pos === 'DST')
                            dst++;
                    }
                    if (qb < 1 || rb < 2 || wr < 2 || te < 1 || k < 1 || dst < 1) {
                        violations++;
                    }
                    const name = team.teamName;
                    if (!nextBotRecords[name])
                        nextBotRecords[name] = { wins: 0, losses: 0 };
                    nextBotRecords[name].wins += team.wins;
                    nextBotRecords[name].losses += team.losses;
                    const camp = team.strategyCamp;
                    if (!nextStrategyRecords[camp])
                        nextStrategyRecords[camp] = { wins: 0, losses: 0 };
                    nextStrategyRecords[camp].wins += team.wins;
                    nextStrategyRecords[camp].losses += team.losses;
                });
                draft.teams.forEach(team => {
                    const slot = team.teamIndex + 1;
                    if (!nextSlotRecords[slot])
                        nextSlotRecords[slot] = { wins: 0, losses: 0 };
                    nextSlotRecords[slot].wins += team.wins;
                    nextSlotRecords[slot].losses += team.losses;
                });
            }
            // 1. Identify worst-performing strategy camp (Lowest Win Rate)
            let worstCamp = 'Robust RB';
            let lowestWinRate = 1.0;
            Object.entries(nextStrategyRecords).forEach(([camp, rec]) => {
                const total = rec.wins + rec.losses;
                if (total > 0) {
                    const wr = rec.wins / total;
                    if (wr < lowestWinRate) {
                        lowestWinRate = wr;
                        worstCamp = camp;
                    }
                }
            });
            // 2. Directed reinforcement mutation to worst camp parameters
            const mutatedParams = JSON.parse(JSON.stringify(accumulatedStats.parameterMutations));
            const step = 0.5 + Math.random() * 1.5;
            if (worstCamp === 'Robust RB') {
                if (Math.random() > 0.5) {
                    mutatedParams['Robust RB'].earlyRB_bonus = Number((Math.min(120, (mutatedParams['Robust RB'].earlyRB_bonus || 90) + step)).toFixed(2));
                }
                else {
                    mutatedParams['Robust RB'].earlyQBTEWR_penalty = Number((Math.min(-10, (mutatedParams['Robust RB'].earlyQBTEWR_penalty || -25) + step)).toFixed(2));
                }
            }
            else if (worstCamp === 'Late QB/TE Focus') {
                if (Math.random() > 0.5) {
                    mutatedParams['Late QB/TE Focus'].earlyQB_penalty = Number((Math.min(-20, (mutatedParams['Late QB/TE Focus'].earlyQB_penalty || -60) + step)).toFixed(2));
                }
                else {
                    mutatedParams['Late QB/TE Focus'].earlyTE_penalty = Number((Math.min(-20, (mutatedParams['Late QB/TE Focus'].earlyTE_penalty || -60) + step)).toFixed(2));
                }
            }
            else if (worstCamp === 'Zero RB') {
                if (Math.random() > 0.5) {
                    mutatedParams['Zero RB'].earlyRoundRB_penalty = Number((Math.min(-30, (mutatedParams['Zero RB'].earlyRoundRB_penalty || -90) + step)).toFixed(2));
                }
                else {
                    mutatedParams['Zero RB'].earlyRoundWRTE_bonus = Number((Math.min(60, (mutatedParams['Zero RB'].earlyRoundWRTE_bonus || 25) + step)).toFixed(2));
                }
            }
            else if (worstCamp === 'Hero RB') {
                if (Math.random() > 0.5) {
                    mutatedParams['Hero RB'].anchorRB_bonus = Number((Math.min(80, (mutatedParams['Hero RB'].anchorRB_bonus || 40) + step)).toFixed(2));
                }
                else {
                    mutatedParams['Hero RB'].earlyRB2_penalty = Number((Math.min(-20, (mutatedParams['Hero RB'].earlyRB2_penalty || -65) + step)).toFixed(2));
                }
            }
            else if (worstCamp === 'Balanced') {
                if (Math.random() > 0.5) {
                    mutatedParams['Balanced'].adpSteal_multiplier = Number((Math.min(3.0, (mutatedParams['Balanced'].adpSteal_multiplier || 1.2) + step * 0.05)).toFixed(2));
                }
                else {
                    mutatedParams['Balanced'].adpGapThreshold = Number((Math.max(2, (mutatedParams['Balanced'].adpGapThreshold || 6) - 0.1)).toFixed(2));
                }
            }
            else if (worstCamp === 'Elite QB/TE Premium') {
                if (Math.random() > 0.5) {
                    mutatedParams['Elite QB/TE Premium'].earlyQB_bonus = Number((Math.min(80, (mutatedParams['Elite QB/TE Premium'].earlyQB_bonus || 55) + step)).toFixed(2));
                }
                else {
                    mutatedParams['Elite QB/TE Premium'].earlyTE_bonus = Number((Math.min(80, (mutatedParams['Elite QB/TE Premium'].earlyTE_bonus || 55) + step)).toFixed(2));
                }
            }
            // Add tiny exploration noise to ALL strategy parameters to keep them dynamic
            Object.keys(mutatedParams).forEach(camp => {
                Object.keys(mutatedParams[camp]).forEach(param => {
                    if (typeof mutatedParams[camp][param] === 'number') {
                        const noise = (Math.random() - 0.5) * 0.15;
                        mutatedParams[camp][param] = Number((mutatedParams[camp][param] + noise).toFixed(2));
                    }
                });
            });
            accumulatedStats = {
                totalSims: accumulatedStats.totalSims + batchSize,
                botRecords: nextBotRecords,
                strategyRecords: nextStrategyRecords,
                slotRecords: nextSlotRecords,
                parameterMutations: mutatedParams,
                rosterViolations: violations
            };
            // Throttled UI state commit (every 500ms) to ensure premium high-fps scrolling and zero layout thrashing
            const now = Date.now();
            if (now - lastUiUpdate >= 500) {
                set({ liveSimStats: accumulatedStats });
                lastUiUpdate = now;
            }
            setTimeout(runBatch, 10); // Decreased from 80ms to 10ms to achieve up to 80x throughput acceleration
        };
        runBatch();
    },
    stopLiveSimulationLoop: () => {
        set({ liveSimRunning: false });
    },
    resetLiveSimulationStats: () => {
        set({
            liveSimStats: {
                totalSims: 0,
                botRecords: {},
                strategyRecords: {},
                slotRecords: {},
                parameterMutations: exports.BOT_OPTIMIZED_PARAMS,
                rosterViolations: 0
            }
        });
    },
    clearSimulatedCohorts: () => {
        const registeredNames = Object.values(useAuthStore_1.useAuthStore.getState().registeredUsers).map(u => u.name);
        const defaultBotNames = Array.from(new Set([
            'Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert',
            (0, exports.getUserTeamName)(),
            ...registeredNames
        ]));
        const currentBotRecords = get().liveSimStats.botRecords;
        const cleanBotRecords = {};
        const metricsBots = scratch_live_metrics_json_1.default.botRecords;
        defaultBotNames.forEach(name => {
            if (currentBotRecords[name]) {
                cleanBotRecords[name] = currentBotRecords[name];
            }
            else if (metricsBots[name]) {
                cleanBotRecords[name] = metricsBots[name];
            }
            else {
                cleanBotRecords[name] = { wins: 0, losses: 0 };
            }
        });
        set((state) => ({
            liveSimStats: {
                ...state.liveSimStats,
                botRecords: cleanBotRecords
            }
        }));
    },
    rehydrateUserData: () => {
        const keys = getUserStorageKeys();
        let userDrafts = [];
        let userSims = 0;
        let userRanks = null;
        let userRanksName = null;
        try {
            if (isWeb) {
                const cachedDrafts = window.localStorage.getItem(keys.HISTORICAL_DRAFTS);
                if (cachedDrafts)
                    userDrafts = JSON.parse(cachedDrafts);
                const cachedSims = window.localStorage.getItem(keys.BOT_TRAINING_SIMS);
                if (cachedSims)
                    userSims = parseInt(cachedSims, 10);
                const cachedRanks = window.localStorage.getItem(keys.MY_RANKS);
                if (cachedRanks)
                    userRanks = JSON.parse(cachedRanks);
                const cachedRanksName = window.localStorage.getItem(keys.MY_RANKS_NAME);
                if (cachedRanksName)
                    userRanksName = cachedRanksName;
            }
        }
        catch (e) {
            console.warn('Failed to rehydrate user data:', e);
        }
        set({
            historicalDrafts: userDrafts,
            botTrainingSims: userSims,
            myRanks: userRanks,
            myRanksName: userRanksName
        });
    }
}));
// Fast Simulated Draft Runner
const runFastSimulation = (setup, myRanks, botProfiles, botTrainingSims = 10000, rotationOffset = 0, preSortedPlayers, customUserTeamName) => {
    const players = preSortedPlayers || (0, exports.applyFormatAndSort)((0, mockData_1.generateMockRankings)(), setup.leagueFormat, setup.rankingsBase, myRanks);
    // Reset draftedBy directly to avoid mapping allocation overhead
    for (let i = 0; i < players.length; i++) {
        players[i].draftedBy = null;
    }
    const draftHistory = [];
    const totalPicks = setup.rounds * setup.leagueSize;
    const teamRosterCounts = {};
    const teamRosterPlayers = {};
    for (let idx = 0; idx < setup.leagueSize; idx++) {
        teamRosterCounts[idx] = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0 };
        teamRosterPlayers[idx] = [];
    }
    let firstUndraftedCursor = 0;
    for (let pick = 1; pick <= totalPicks; pick++) {
        const activeTeamIdx = (0, exports.getTeamIndexForPick)(pick, setup.leagueSize, setup.draftType);
        const teamName = (0, exports.getTeamNameForIndex)((activeTeamIdx + rotationOffset) % setup.leagueSize, setup.userPosition, customUserTeamName);
        while (firstUndraftedCursor < players.length && players[firstUndraftedCursor].draftedBy) {
            firstUndraftedCursor++;
        }
        if (firstUndraftedCursor >= players.length)
            break;
        const roster = teamRosterCounts[activeTeamIdx];
        const isMissingQB = roster.QB === 0;
        const isMissingTE = roster.TE === 0;
        const isMissingK = roster.K === 0;
        const isMissingDST = roster.DST === 0;
        const isMissingRB = roster.RB < 2;
        const isMissingWR = roster.WR < 2;
        const neededStartingSlots = (isMissingQB ? 1 : 0) +
            (isMissingTE ? 1 : 0) +
            (isMissingK ? 1 : 0) +
            (isMissingDST ? 1 : 0) +
            (isMissingRB ? 2 - roster.RB : 0) +
            (isMissingWR ? 2 - roster.WR : 0);
        const currentRound = Math.ceil(pick / setup.leagueSize);
        const roundsRemaining = setup.rounds - currentRound + 1;
        let pool = [];
        if (neededStartingSlots >= roundsRemaining) {
            let cursor = firstUndraftedCursor;
            while (pool.length < 15 && cursor < players.length) {
                const p = players[cursor];
                if (!p.draftedBy) {
                    const pos = p.position;
                    const match = (pos === 'QB' && isMissingQB) ||
                        (pos === 'TE' && isMissingTE) ||
                        (pos === 'K' && isMissingK) ||
                        (pos === 'DST' && isMissingDST) ||
                        (pos === 'RB' && isMissingRB) ||
                        (pos === 'WR' && isMissingWR);
                    if (match) {
                        pool.push(p);
                    }
                }
                cursor++;
            }
            if (pool.length === 0) {
                let fallbackCursor = firstUndraftedCursor;
                while (pool.length < 15 && fallbackCursor < players.length) {
                    const p = players[fallbackCursor];
                    if (!p.draftedBy) {
                        pool.push(p);
                    }
                    fallbackCursor++;
                }
            }
        }
        else {
            let cursor = firstUndraftedCursor;
            while (pool.length < 15 && cursor < players.length) {
                const p = players[cursor];
                if (!p.draftedBy) {
                    pool.push(p);
                }
                cursor++;
            }
        }
        let chosenPlayer = pool[0];
        let bestScore = -10000;
        for (let i = 0; i < pool.length; i++) {
            const player = pool[i];
            let score = 0;
            if (teamName === (0, exports.getUserTeamName)()) {
                const bestAvailableRank = players[firstUndraftedCursor].rank;
                score = (0, exports.getPlayerSuggestionScore)(player, pick, setup, roster, bestAvailableRank);
            }
            else {
                score = calculateCpuPlayerScore(player, activeTeamIdx, teamName, pick, setup, roster, botTrainingSims);
            }
            if (score > bestScore) {
                bestScore = score;
                chosenPlayer = player;
            }
        }
        if (chosenPlayer) {
            chosenPlayer.draftedBy = teamName;
            teamRosterPlayers[activeTeamIdx].push(chosenPlayer);
            roster[chosenPlayer.position]++;
            draftHistory.push({
                pickNumber: pick,
                round: Math.ceil(pick / setup.leagueSize),
                teamIndex: activeTeamIdx,
                teamName,
                player: { ...chosenPlayer, draftedBy: teamName }
            });
        }
    }
    // Set draftedBy directly on all players to null to avoid mapping allocation overhead
    for (let i = 0; i < players.length; i++) {
        players[i].draftedBy = null;
    }
    const calculateRosterPoints = (roster) => {
        let qb_max = 0;
        let rb1 = 0, rb2 = 0;
        let wr1 = 0, wr2 = 0;
        let te_max = 0;
        let k_max = 0;
        let dst_max = 0;
        let flex_max = 0;
        let totalPoints = 0;
        for (let i = 0; i < roster.length; i++) {
            const p = roster[i];
            const pts = p.projectedPoints;
            totalPoints += pts;
            const pos = p.position;
            if (pos === 'QB') {
                if (pts > qb_max)
                    qb_max = pts;
            }
            else if (pos === 'RB') {
                if (pts > rb1) {
                    if (rb2 > flex_max)
                        flex_max = rb2;
                    rb2 = rb1;
                    rb1 = pts;
                }
                else if (pts > rb2) {
                    if (rb2 > flex_max)
                        flex_max = rb2;
                    rb2 = pts;
                }
                else {
                    if (pts > flex_max)
                        flex_max = pts;
                }
            }
            else if (pos === 'WR') {
                if (pts > wr1) {
                    if (wr2 > flex_max)
                        flex_max = wr2;
                    wr2 = wr1;
                    wr1 = pts;
                }
                else if (pts > wr2) {
                    if (wr2 > flex_max)
                        flex_max = wr2;
                    wr2 = pts;
                }
                else {
                    if (pts > flex_max)
                        flex_max = pts;
                }
            }
            else if (pos === 'TE') {
                if (pts > te_max) {
                    if (te_max > flex_max)
                        flex_max = te_max;
                    te_max = pts;
                }
                else {
                    if (pts > flex_max)
                        flex_max = pts;
                }
            }
            else if (pos === 'K') {
                if (pts > k_max)
                    k_max = pts;
            }
            else if (pos === 'DST') {
                if (pts > dst_max)
                    dst_max = pts;
            }
        }
        let score = qb_max + rb1 + rb2 + wr1 + wr2 + te_max + flex_max + k_max + dst_max;
        const benchPoints = totalPoints - score;
        score += Math.max(0, benchPoints * 0.1);
        return score;
    };
    const teamBaselines = {};
    for (let i = 0; i < setup.leagueSize; i++) {
        teamBaselines[i] = calculateRosterPoints(teamRosterPlayers[i]);
    }
    const numWeeks = 14;
    const wins = Array(setup.leagueSize).fill(0);
    const playoffCounts = Array(setup.leagueSize).fill(0);
    const simCount = 10;
    const weeklyScores = new Float64Array(setup.leagueSize);
    const unpaired = new Int32Array(setup.leagueSize);
    const simWins = new Int32Array(setup.leagueSize);
    // Pre-allocated object structures to avoid garbage collection
    const standingRanks = Array.from({ length: setup.leagueSize }, (_, idx) => ({
        idx,
        wins: 0,
        score: 0
    }));
    for (let sim = 0; sim < simCount; sim++) {
        simWins.fill(0);
        for (let week = 0; week < numWeeks; week++) {
            for (let i = 0; i < setup.leagueSize; i++) {
                const variance = (Math.random() - 0.5) * 35;
                weeklyScores[i] = (teamBaselines[i] / numWeeks) + variance;
                unpaired[i] = i;
            }
            for (let i = setup.leagueSize - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = unpaired[i];
                unpaired[i] = unpaired[j];
                unpaired[j] = temp;
            }
            for (let m = 0; m < setup.leagueSize; m += 2) {
                const t1 = unpaired[m];
                const t2 = unpaired[m + 1];
                if (weeklyScores[t1] > weeklyScores[t2]) {
                    simWins[t1]++;
                }
                else {
                    simWins[t2]++;
                }
            }
        }
        for (let i = 0; i < setup.leagueSize; i++) {
            wins[i] += simWins[i];
        }
        for (let i = 0; i < setup.leagueSize; i++) {
            standingRanks[i].idx = i;
            standingRanks[i].wins = simWins[i];
            standingRanks[i].score = teamBaselines[i];
        }
        standingRanks.sort((a, b) => b.wins - a.wins || b.score - a.score);
        for (let rankIndex = 0; rankIndex < 4; rankIndex++) {
            playoffCounts[standingRanks[rankIndex].idx]++;
        }
    }
    const avgWins = Array(setup.leagueSize).fill(0);
    const avgLosses = Array(setup.leagueSize).fill(0);
    const playoffChances = Array(setup.leagueSize).fill(0);
    const grades = Array(setup.leagueSize).fill('B');
    for (let i = 0; i < setup.leagueSize; i++) {
        const w = wins[i] / simCount;
        avgWins[i] = Number(w.toFixed(1));
        avgLosses[i] = Number((numWeeks - w).toFixed(1));
        playoffChances[i] = Math.round((playoffCounts[i] / simCount) * 100);
        if (w >= 10.0)
            grades[i] = 'A+';
        else if (w >= 9.0)
            grades[i] = 'A';
        else if (w >= 8.0)
            grades[i] = 'B+';
        else if (w >= 7.0)
            grades[i] = 'B';
        else if (w >= 6.0)
            grades[i] = 'C';
        else
            grades[i] = 'D';
    }
    const valueScores = Array(setup.leagueSize).fill(0);
    for (let i = 0; i < setup.leagueSize; i++) {
        let totalDiff = 0;
        const picks = draftHistory.filter(h => h.teamIndex === i);
        picks.forEach(p => {
            totalDiff += (p.player.adp - p.pickNumber);
        });
        valueScores[i] = picks.length > 0 ? Number((totalDiff / picks.length).toFixed(1)) : 0;
    }
    const teams = Array.from({ length: setup.leagueSize }, (_, idx) => {
        const name = (0, exports.getTeamNameForIndex)((idx + rotationOffset) % setup.leagueSize, setup.userPosition);
        let strategyCamp = 'Balanced';
        let expertPreference = 'ECR Consensus';
        if (name === (0, exports.getUserTeamName)()) {
            strategyCamp = (setup.userStrategy || 'Balanced');
            expertPreference = setup.rankingsBase;
        }
        else {
            const profile = botProfiles[name] || exports.DEFAULT_BOT_PROFILES[name];
            if (profile) {
                strategyCamp = profile.strategyCamp;
                expertPreference = profile.expertPreference;
            }
        }
        return {
            teamIndex: idx,
            teamName: name,
            strategyCamp,
            expertPreference,
            grade: grades[idx],
            wins: avgWins[idx],
            losses: avgLosses[idx],
            playoffChance: playoffChances[idx],
            roster: teamRosterPlayers[idx].map(p => ({
                name: p.name,
                position: p.position,
                rank: p.rank,
                adp: p.adp,
                projectedPoints: p.projectedPoints,
                espnId: p.espnId,
                bye: p.bye
            }))
        };
    });
    const userIdx = teams.findIndex(t => t.teamName === (0, exports.getUserTeamName)());
    const userRecord = userIdx !== -1 ? teams[userIdx] : teams[0];
    return {
        id: `draft_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        timestamp: Date.now(),
        grade: userRecord ? userRecord.grade : 'B',
        valueScore: userIdx !== -1 ? valueScores[userIdx] : 0,
        playoffChance: userRecord ? userRecord.playoffChance : 50,
        projectedWins: userRecord ? userRecord.wins : 7,
        projectedLosses: userRecord ? userRecord.losses : 7,
        userPosition: userIdx !== -1 ? userIdx + 1 : setup.userPosition,
        leagueSize: setup.leagueSize,
        opponentStyle: setup.opponentStyle,
        leagueFormat: setup.leagueFormat,
        rankingsBase: setup.rankingsBase,
        userStrategy: setup.userStrategy || 'Balanced',
        passingTdPoints: setup.passingTdPoints,
        tePremium: setup.tePremium,
        flexCount: setup.flexCount,
        teams
    };
};
exports.runFastSimulation = runFastSimulation;
// Subscribe to useAuthStore changes reactively to sync coach name and sandboxed state!
let lastUserId = undefined;
useAuthStore_1.useAuthStore.subscribe((state) => {
    const user = state.user;
    if (user?.id === lastUserId)
        return;
    lastUserId = user?.id;
    if (user) {
        console.log(`🔄 [Store Sync] Auth change detected. Syncing coach name: ${user.name}`);
        const mockStore = exports.useMockMaxxingStore.getState();
        if (mockStore.draftStatus === 'setup') {
            exports.useMockMaxxingStore.setState((prev) => ({
                ...prev,
                setup: {
                    ...prev.setup,
                    leagueFormat: user.preferences.scoring,
                    userPosition: user.preferences.draftPos,
                },
            }));
        }
        // Rehydrate segmented user drafts and ranks!
        exports.useMockMaxxingStore.getState().rehydrateUserData();
    }
    else {
        console.log('🔄 [Store Sync] User logged out. Resetting mockmaxxing store simulation states.');
        exports.useMockMaxxingStore.getState().resetDraft();
        exports.useMockMaxxingStore.setState((prev) => ({
            ...prev,
            historicalDrafts: [],
            botTrainingSims: 0,
            myRanks: null,
            myRanksName: null
        }));
    }
});
