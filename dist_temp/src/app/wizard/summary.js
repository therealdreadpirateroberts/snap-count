"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DraftSummaryScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const mockData_1 = require("@/store/mockData");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const Haptics = __importStar(require("expo-haptics"));
const SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
// Helper to format player names cleanly to First Initial + Last Name
const getDisplayName = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
        const suffixes = ['jr', 'sr', 'ii', 'iii', 'iv', 'v', 'jr.', 'sr.'];
        const lastPart = parts[parts.length - 1].toLowerCase();
        if (suffixes.includes(lastPart) && parts.length > 2) {
            return `${parts[0][0]}. ${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
        }
        return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
    }
    return name;
};
// Map players to direct ESPN player IDs for premium headshots
const getPlayerHeadshotUrl = (espnId, position, team) => {
    if (position === 'DST' && team) {
        return (0, mockData_1.getTeamLogoUrl)(team);
    }
    if (espnId) {
        return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
    }
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};
// Format number with commas
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// Generate highly realistic season projections based on position and projected points
const getPlayerProjections = (player) => {
    const pts = player.projectedPoints || 0;
    const ppg = Math.round(pts / 17);
    if (player.position === 'QB') {
        const yds = Math.round(pts * 12.5);
        const tds = Math.round(pts * 0.085);
        return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
    }
    if (player.position === 'RB') {
        const yds = Math.round(pts * 4.2 + 200);
        const tds = Math.round(pts * 0.038);
        return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
    }
    if (player.position === 'WR') {
        const yds = Math.round(pts * 4.5 + 100);
        const tds = Math.round(pts * 0.032);
        return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
    }
    if (player.position === 'TE') {
        const yds = Math.round(pts * 4.8);
        const tds = Math.round(pts * 0.042);
        return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
    }
    if (player.position === 'K') {
        const fg = Math.round(pts * 0.22);
        const xp = Math.round(pts * 0.26);
        return `${fg} FG · ${xp} XP · ${ppg} PPG`;
    }
    if (player.position === 'DST' || player.position === 'DEF') {
        const sck = Math.round(pts * 0.35);
        const ints = Math.round(pts * 0.12);
        return `${sck} Sck · ${ints} Int · ${ppg} PPG`;
    }
    return `${pts} Pts · ${ppg} PPG`;
};
const getSlotBgColor = (label) => {
    if (label === 'W/R/T')
        return '#334155';
    if (label === 'DEF')
        return theme_1.Colors.positions.DST;
    if (label === 'BN')
        return '#27272a';
    if (label === 'IR')
        return '#18181b';
    return theme_1.Colors.positions[label] || '#475569';
};
const getSlotTextColor = (label) => {
    if (label === 'BN' || label === 'IR' || label === 'W/R/T')
        return '#e2e8f0';
    return '#000000';
};
const getGradeLetterFromPoints = (pts) => {
    if (pts >= 11.5)
        return 'A+';
    if (pts >= 10.5)
        return 'A';
    if (pts >= 9.5)
        return 'A-';
    if (pts >= 8.5)
        return 'B+';
    if (pts >= 7.5)
        return 'B';
    if (pts >= 6.5)
        return 'B-';
    if (pts >= 5.5)
        return 'C+';
    if (pts >= 4.5)
        return 'C';
    if (pts >= 3.5)
        return 'C-';
    if (pts >= 2.5)
        return 'D+';
    if (pts >= 1.5)
        return 'D';
    return 'F';
};
const getGradePoints = (grade) => {
    switch (grade) {
        case 'A+': return 12;
        case 'A': return 11;
        case 'A-': return 10;
        case 'B+': return 9;
        case 'B': return 8;
        case 'B-': return 7;
        case 'C+': return 6;
        case 'C': return 5;
        case 'C-': return 4;
        case 'D+': return 3;
        case 'D': return 2;
        default: return 0;
    }
};
function DraftSummaryScreen() {
    const Colors = (0, theme_1.useColors)();
    const router = (0, expo_router_1.useRouter)();
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) {
                console.warn('Haptics failed:', err);
            }
        }
    };
    const setup = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.setup);
    const resetDraft = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.resetDraft);
    const getDraftGrade = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.getDraftGrade);
    const getUserRoster = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.getUserRoster);
    const draftHistory = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.draftHistory);
    const historicalDrafts = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.historicalDrafts || []);
    const botTrainingSims = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.botTrainingSims || 0);
    const populateHistory = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.populateHistory);
    const clearHistory = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.clearHistory);
    const runBotSelfImprovementTraining = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.runBotSelfImprovementTraining);
    const [activeTab, setActiveTab] = (0, react_1.useState)('roster');
    const [showAdvanced, setShowAdvanced] = (0, react_1.useState)(false);
    const [isSimulating, setIsSimulating] = (0, react_1.useState)(false);
    const [simProgress, setSimProgress] = (0, react_1.useState)(0);
    const [exploreIdx, setExploreIdx] = (0, react_1.useState)(null);
    // Auto-reset explore state back to standard after two seconds of idle
    (0, react_1.useEffect)(() => {
        if (exploreIdx !== null) {
            const timer = setTimeout(() => {
                setExploreIdx(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [exploreIdx]);
    const runSimulationBatches = (0, react_1.useCallback)((totalCount) => {
        setIsSimulating(true);
        setSimProgress(0);
        let currentCount = 0;
        const batchSize = 250;
        const runBatch = () => {
            if (currentCount >= totalCount) {
                setIsSimulating(false);
                setSimProgress(100);
                return;
            }
            populateHistory(batchSize);
            currentCount += batchSize;
            setSimProgress(Math.min(100, Math.round((currentCount / totalCount) * 100)));
            setTimeout(runBatch, 16);
        };
        setTimeout(runBatch, 50);
    }, [populateHistory]);
    // Trigger auto prepopulate of 5,000 simulations if history is empty
    (0, react_1.useEffect)(() => {
        if (historicalDrafts.length === 0 && !isSimulating) {
            runSimulationBatches(5000);
        }
    }, [historicalDrafts.length, isSimulating, runSimulationBatches]);
    const roster = (0, react_1.useMemo)(() => {
        return getUserRoster();
    }, [getUserRoster]);
    const { grade, valueScore, playoffChance, projectedWins, projectedLosses } = (0, react_1.useMemo)(() => {
        return getDraftGrade();
    }, [getDraftGrade]);
    const isHOF = grade === 'A+';
    const handleRestart = () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        resetDraft();
        router.replace('/wizard/setup');
    };
    const handleHome = () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        resetDraft();
        router.replace('/');
    };
    // Helper to extract exact draft pick number for active draft
    const getUserPickNumber = (playerName) => {
        const pickObj = draftHistory.find(h => h.player.name === playerName);
        return pickObj ? pickObj.pickNumber : '-';
    };
    // Group active roster into slots mirroring active.tsx layout
    const rosterSlots = (0, react_1.useMemo)(() => {
        const slots = [
            { id: 'QB', label: 'QB', allowedPositions: ['QB'], player: null },
            { id: 'WR1', label: 'WR', allowedPositions: ['WR'], player: null },
            { id: 'WR2', label: 'WR', allowedPositions: ['WR'], player: null },
            { id: 'RB1', label: 'RB', allowedPositions: ['RB'], player: null },
            { id: 'RB2', label: 'RB', allowedPositions: ['RB'], player: null },
            { id: 'TE', label: 'TE', allowedPositions: ['TE'], player: null },
        ];
        const maxFlex = setup.flexCount ?? 1;
        for (let f = 1; f <= maxFlex; f++) {
            slots.push({ id: `FLEX${f}`, label: 'W/R/T', allowedPositions: ['WR', 'RB', 'TE'], player: null });
        }
        slots.push({ id: 'K', label: 'K', allowedPositions: ['K'], player: null }, { id: 'DEF', label: 'DEF', allowedPositions: ['DST'], player: null }, { id: 'BN1', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null }, { id: 'BN2', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null }, { id: 'BN3', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null }, { id: 'BN4', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null }, { id: 'BN5', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null }, { id: 'BN6', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null });
        const pool = [...roster];
        // Pass 1: Starters (QB, WR1/2, RB1/2, TE, K, DEF)
        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            let assigned = false;
            if (p.position === 'QB') {
                const slot = slots.find(s => s.id === 'QB' && !s.player);
                if (slot) {
                    slot.player = p;
                    assigned = true;
                }
            }
            else if (p.position === 'WR') {
                const slot = slots.find(s => (s.id === 'WR1' || s.id === 'WR2') && !s.player);
                if (slot) {
                    slot.player = p;
                    assigned = true;
                }
            }
            else if (p.position === 'RB') {
                const slot = slots.find(s => (s.id === 'RB1' || s.id === 'RB2') && !s.player);
                if (slot) {
                    slot.player = p;
                    assigned = true;
                }
            }
            else if (p.position === 'TE') {
                const slot = slots.find(s => s.id === 'TE' && !s.player);
                if (slot) {
                    slot.player = p;
                    assigned = true;
                }
            }
            else if (p.position === 'K') {
                const slot = slots.find(s => s.id === 'K' && !s.player);
                if (slot) {
                    slot.player = p;
                    assigned = true;
                }
            }
            else if (p.position === 'DST' || p.position === 'DEF') {
                const slot = slots.find(s => s.id === 'DEF' && !s.player);
                if (slot) {
                    slot.player = p;
                    assigned = true;
                }
            }
            if (assigned) {
                pool.splice(i, 1);
                i--;
            }
        }
        // Pass 2: FLEX slots (W/R/T)
        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            if (p.position === 'WR' || p.position === 'RB' || p.position === 'TE') {
                const slot = slots.find(s => s.id.startsWith('FLEX') && !s.player);
                if (slot) {
                    slot.player = p;
                    pool.splice(i, 1);
                    i--;
                }
            }
        }
        // Pass 3: Bench (BN1-BN6)
        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            const slot = slots.find(s => s.id.startsWith('BN') && !s.player);
            if (slot) {
                slot.player = p;
                pool.splice(i, 1);
                i--;
            }
        }
        return slots;
    }, [roster, setup.flexCount]);
    const starters = (0, react_1.useMemo)(() => rosterSlots.filter(s => !s.id.startsWith('BN')), [rosterSlots]);
    const bench = (0, react_1.useMemo)(() => rosterSlots.filter(s => s.id.startsWith('BN')), [rosterSlots]);
    // Positional bye conflicts
    const positionByeCounts = (0, react_1.useMemo)(() => {
        const counts = {};
        roster.forEach(player => {
            const pos = player.position;
            const bye = player.bye;
            if (!counts[pos])
                counts[pos] = {};
            counts[pos][bye] = (counts[pos][bye] || 0) + 1;
        });
        return counts;
    }, [roster]);
    // ADVANCED METRICS CALCULATIONS
    const getPositionGrade = (pos) => {
        const totalPts = roster.filter(p => p.position === pos).reduce((sum, p) => sum + p.projectedPoints, 0);
        if (pos === 'QB') {
            if (totalPts > 320)
                return 'A+';
            if (totalPts > 295)
                return 'A';
            if (totalPts > 270)
                return 'B+';
            if (totalPts > 245)
                return 'B';
            return 'C';
        }
        if (pos === 'RB') {
            if (totalPts > 470)
                return 'A+';
            if (totalPts > 390)
                return 'A';
            if (totalPts > 310)
                return 'B+';
            if (totalPts > 240)
                return 'B';
            return 'C';
        }
        if (pos === 'WR') {
            if (totalPts > 500)
                return 'A+';
            if (totalPts > 410)
                return 'A';
            if (totalPts > 330)
                return 'B+';
            if (totalPts > 250)
                return 'B';
            return 'C';
        }
        if (pos === 'TE') {
            if (totalPts > 175)
                return 'A+';
            if (totalPts > 145)
                return 'A';
            if (totalPts > 115)
                return 'B+';
            if (totalPts > 90)
                return 'B';
            return 'C';
        }
        return 'B';
    };
    const getPositionPPG = (pos) => {
        const totalPts = roster.filter(p => p.position === pos).reduce((sum, p) => sum + p.projectedPoints, 0);
        return Math.round(totalPts / 17);
    };
    const byeConflictCount = (0, react_1.useMemo)(() => {
        let conflicts = 0;
        Object.keys(positionByeCounts).forEach(pos => {
            Object.keys(positionByeCounts[pos]).forEach(bye => {
                if (positionByeCounts[pos][Number(bye)] >= 2) {
                    conflicts++;
                }
            });
        });
        return conflicts;
    }, [positionByeCounts]);
    const getByeScore = () => {
        if (byeConflictCount === 0)
            return 100;
        if (byeConflictCount === 1)
            return 85;
        if (byeConflictCount === 2)
            return 65;
        return 45;
    };
    const getStarterBenchRatio = () => {
        const starterPts = starters.reduce((sum, s) => sum + (s.player ? s.player.projectedPoints : 0), 0);
        const benchPts = bench.reduce((sum, b) => sum + (b.player ? b.player.projectedPoints : 0), 0);
        return benchPts > 0 ? `${Math.round(starterPts / benchPts)}x` : 'N/A';
    };
    // DRAFT COACH STRATEGY INSIGHTS & ALTERATIONS
    const coachStrategyAnalysis = (0, react_1.useMemo)(() => {
        const selectedStrat = setup.userStrategy || 'Balanced';
        const firstFivePicks = draftHistory.filter(h => h.teamName === (0, useMockMaxxingStore_1.getUserTeamName)() || h.teamName === 'Your Team').slice(0, 5);
        const firstFiveRBs = firstFivePicks.filter(p => p.player.position === 'RB');
        const firstFiveWRs = firstFivePicks.filter(p => p.player.position === 'WR');
        const qbPickedEarly = firstFivePicks.find(p => p.player.position === 'QB');
        const tePickedEarly = firstFivePicks.find(p => p.player.position === 'TE');
        let feedback = '';
        let success = false;
        let suggestions = [];
        if (selectedStrat === 'Zero RB') {
            const rbCount = firstFiveRBs.length;
            if (rbCount > 0) {
                success = false;
                feedback = `You declared a "Zero RB" draft strategy but drafted ${rbCount} RB(s) in your first 5 picks. This violates the core design of Zero RB, which demands hoarding elite receivers early to build an insurmountable weekly advantage at WR/TE.`;
                suggestions = [
                    "Avoid any running backs in rounds 1 through 5, even if they slip past ADP.",
                    "Target three high-ceiling starting WRs and an elite TE in the initial 4 rounds.",
                    "Stack late-round RBs (Round 6+) who have high injury-contingent upside to secure starting jobs later."
                ];
            }
            else {
                success = true;
                feedback = `Masterful Zero RB execution! You passed on early running backs entirely and drafted 0 RBs in the first 5 rounds. By locking in dominant, reliable high-end receivers, you secured a massive baseline advantage in passing volume.`;
                suggestions = [
                    "Continue exploiting this strategy in high-volume passing environments.",
                    "Keep an eye on premium backups during pre-season to grab cheap handcuffs.",
                    "Maintain a waiver-wire bias towards high-value backup running backs."
                ];
            }
        }
        else if (selectedStrat === 'Hero RB') {
            const rbCount = firstFiveRBs.length;
            const earlyRB = firstFivePicks.slice(0, 2).filter(p => p.player.position === 'RB').length;
            if (earlyRB === 1 && rbCount === 1) {
                success = true;
                feedback = `Perfect Hero RB execution! You drafted exactly one elite anchor RB in your first 2 picks, and zero RBs in rounds 3-5. This allows your superstar anchor to carry the running back floor while you load up on high-value WRs.`;
                suggestions = [
                    "Look to fill your RB2 slot with a robust committee in rounds 7-10.",
                    "Use your strong WR capital to dominate Flex slots and bye week coverages."
                ];
            }
            else if (earlyRB === 0) {
                success = false;
                feedback = `Hero RB strategy requires securing a single elite anchor RB in Round 1 or Round 2. Since you did not draft an RB early, your roster misses the reliable superstar foundation needed to anchor the position.`;
                suggestions = [
                    "Lock in one Tier 1/2 running back inside the first 2 rounds.",
                    "Strictly avoid drafting any additional RBs until Round 6 or 7.",
                    "Hoard elite pass catchers once your anchor RB is secured."
                ];
            }
            else {
                success = false;
                feedback = `You selected Hero RB but hoarded ${rbCount} early running backs. Drafting multiple RBs in the first 5 rounds dilutes your ability to build an elite WR room, turning your roster into a standard balanced build instead.`;
                suggestions = [
                    "Draft only ONE running back in your first 5 picks.",
                    "Trust your single anchor RB to carry the load, and focus heavily on receivers.",
                    "Add positional depth RBs much later (Rounds 8+)."
                ];
            }
        }
        else if (selectedStrat === 'Late QB/TE Focus') {
            if (qbPickedEarly || tePickedEarly) {
                success = false;
                const earlyPos = qbPickedEarly && tePickedEarly ? 'QB and TE' : qbPickedEarly ? 'QB' : 'TE';
                const earlyRound = qbPickedEarly ? qbPickedEarly.round : tePickedEarly?.round;
                feedback = `You declared a "Late QB/TE" strategy but reached for a ${earlyPos} in Round ${earlyRound}. Waiting on single-starter positions is crucial for packing your starting lineup and bench with high-volume RBs and WRs.`;
                suggestions = [
                    "Strictly ignore quarterbacks and tight ends during the first 8 rounds.",
                    "Value premium WR/RB depth over minor positional tier jumps at QB/TE.",
                    "Target high-upside late-round dual-threat QBs (e.g. rushing floor QBs) in Round 9+."
                ];
            }
            else {
                success = true;
                feedback = `Disciplined execution of Late QB/TE! You avoided early single-starter selections, hoarding prime running backs and wide receivers instead. You successfully maximized your flex scoring potential.`;
                suggestions = [
                    "Exploit late-round rushing QBs and athletic developmental tight ends.",
                    "Stream matchups at QB/TE weekly to optimize positional efficiency."
                ];
            }
        }
        else {
            // Balanced
            const positionalConcentration = roster.filter(p => p.position === 'WR').length >= 4 && roster.filter(p => p.position === 'RB').length >= 4;
            if (positionalConcentration) {
                success = true;
                feedback = `Excellent Balanced draft! You navigated value boards efficiently, spreading capital across RBs and WRs. This robust structure eliminates catastrophic single-injury vulnerabilities.`;
                suggestions = [
                    "Let ECR and ADP value drops dictate your picks rather than forcing roster slots.",
                    "Optimize starting grids based on weekly matchups rather than positional loyalty."
                ];
            }
            else {
                success = true;
                feedback = `Solid value-based draft. You stayed highly adaptable, tracking ADP slippage to secure quality assets. Your draft grade reflects an efficient capitalization on opponent reaches.`;
                suggestions = [
                    "In future drafts, try specializing in a concentrated strategy (like Hero RB) if draft spot allows.",
                    "Monitor pre-season target shares to adjust your bench value."
                ];
            }
        }
        return { success, feedback, suggestions, selectedStrat };
    }, [setup.userStrategy, draftHistory, roster]);
    // EXPECTED PERFORMANCE GAME-BY-GAME & QUARTER-BY-QUARTER
    const performanceTelemetry = (0, react_1.useMemo)(() => {
        // Generate a game-by-game projected schedule with floor, median, and ceiling
        const avgScore = 100 + (valueScore * 0.8) + (grade === 'A+' ? 15 : grade === 'A' ? 10 : grade.startsWith('B') ? 5 : 0);
        const weeklyProjections = Array.from({ length: 14 }, (_, idx) => {
            const week = idx + 1;
            const seed = week * 17 + projectedWins;
            const randNoise = ((seed % 19) - 9) * 1.5; // realistic pseudo-randomness
            const median = Math.round(avgScore + randNoise);
            const floor = Math.round(median - 15 - (seed % 5));
            const ceiling = Math.round(median + 18 + (seed % 7));
            // Simulate match outcome
            const oppAvg = 105 + ((seed % 13) - 6);
            const isWin = median > oppAvg;
            const botNames = ['Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert'];
            const opponentName = botNames[(idx + setup.userPosition) % botNames.length];
            return {
                week,
                floor,
                median,
                ceiling,
                opponent: opponentName,
                isWin,
                oppScore: Math.round(oppAvg)
            };
        });
        const ptsScored = Number((avgScore * 14).toFixed(0));
        const ptsAllowed = Number((105 * 14 - valueScore * 5).toFixed(0));
        return {
            avgScore,
            weeklyProjections,
            ptsScored,
            ptsAllowed
        };
    }, [valueScore, grade, projectedWins, setup.userPosition]);
    // HISTORICAL STANDINGS LEADERBOARD REAL-TIME AGGREGATION
    const leaderboardData = (0, react_1.useMemo)(() => {
        const acc = {};
        // Initialize standings with the human and all 11 default bots
        const botNames = ['Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert'];
        const userTeamName = (0, useMockMaxxingStore_1.getUserTeamName)();
        acc[userTeamName] = {
            name: userTeamName,
            isHuman: true,
            strategyCamp: setup.userStrategy || 'Balanced',
            expertPreference: setup.rankingsBase || 'ECR Consensus',
            totalWins: 0,
            totalLosses: 0,
            playoffChanceSum: 0,
            playoffCount: 0,
            gradePointsSum: 0,
            draftCount: 0
        };
        botNames.forEach(name => {
            const profile = useMockMaxxingStore_1.useMockMaxxingStore.getState().botProfiles[name] || { strategyCamp: 'Balanced', expertPreference: 'ECR Consensus' };
            acc[name] = {
                name,
                isHuman: false,
                strategyCamp: profile.strategyCamp,
                expertPreference: profile.expertPreference,
                totalWins: 0,
                totalLosses: 0,
                playoffChanceSum: 0,
                playoffCount: 0,
                gradePointsSum: 0,
                draftCount: 0
            };
        });
        // Aggregate from historicalDrafts list
        historicalDrafts.forEach(draft => {
            draft.teams.forEach(team => {
                const teamName = team.teamName;
                // Handle name mapping for user
                const key = (teamName === userTeamName || teamName === 'Your Team') ? userTeamName : teamName;
                if (!acc[key]) {
                    acc[key] = {
                        name: key,
                        isHuman: key === userTeamName,
                        strategyCamp: team.strategyCamp,
                        expertPreference: team.expertPreference,
                        totalWins: 0,
                        totalLosses: 0,
                        playoffChanceSum: 0,
                        playoffCount: 0,
                        gradePointsSum: 0,
                        draftCount: 0
                    };
                }
                acc[key].totalWins += team.wins;
                acc[key].totalLosses += team.losses;
                acc[key].playoffChanceSum += team.playoffChance;
                if (team.playoffChance >= 50)
                    acc[key].playoffCount++;
                acc[key].gradePointsSum += getGradePoints(team.grade);
                acc[key].draftCount++;
            });
        });
        const rows = Object.values(acc).map(item => {
            const totalGames = item.totalWins + item.totalLosses;
            const winRate = totalGames > 0 ? (item.totalWins / totalGames) : 0;
            const avgPlayoff = item.draftCount > 0 ? (item.playoffChanceSum / item.draftCount) : 0;
            const avgGradePoints = item.draftCount > 0 ? (item.gradePointsSum / item.draftCount) : 8.0; // B default
            const avgGrade = getGradeLetterFromPoints(avgGradePoints);
            return {
                ...item,
                winRate,
                avgPlayoff: Math.round(avgPlayoff),
                avgGrade
            };
        });
        // Sort by win rate descending, then average playoff chance
        return rows.sort((a, b) => b.winRate - a.winRate || b.avgPlayoff - a.avgPlayoff);
    }, [historicalDrafts, setup.userStrategy, setup.rankingsBase]);
    // Interactive 5,000 simulations button handler
    const handlePopulateSims = () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
        runSimulationBatches(5000);
    };
    const handleClearHistory = () => {
        if (react_native_1.Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => { });
        }
        clearHistory();
    };
    // Bot Self-Improvement curve coordinates helper
    const drawBotLearningCurve = (width, height) => {
        const points = [];
        const maxSims = 10000;
        for (let i = 0; i <= 10; i++) {
            const simulatedPoints = i * 1000;
            // botLearningAccuracy curve function: accuracy = initial + (0.98 - initial) * (1 - exp(-sims/3000))
            const growth = (0.98 - 0.50) * (1 - Math.exp(-simulatedPoints / 3000));
            const accuracy = 0.50 + growth;
            const x = 25 + (i * (width - 50)) / 10;
            // Map accuracy (0.50 - 1.00) to height coordinates (Y climbs upwards, so invert it)
            const y = height - 20 - ((accuracy - 0.50) / 0.50) * (height - 40);
            points.push({ x, y });
        }
        let pathString = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathString += ` L ${points[i].x} ${points[i].y}`;
        }
        // Coordinates for current learning state dot
        const curGrowth = (0.98 - 0.50) * (1 - Math.exp(-botTrainingSims / 3000));
        const curAccuracy = 0.50 + curGrowth;
        const curX = 25 + (botTrainingSims / maxSims) * (width - 50);
        const curY = height - 20 - ((curAccuracy - 0.50) / 0.50) * (height - 40);
        return { pathString, curX, curY, curAccuracy, points };
    };
    const { pathString, curX, curY, curAccuracy, points } = (0, react_1.useMemo)(() => {
        return drawBotLearningCurve(320, 100);
    }, [botTrainingSims]);
    // Dynamic selector for touch coordinate lookup
    const exploredPoints = (0, react_1.useMemo)(() => {
        if (exploreIdx === null)
            return null;
        const simulatedPoints = exploreIdx * 1000;
        const growth = (0.98 - 0.50) * (1 - Math.exp(-simulatedPoints / 3000));
        const accuracy = 0.50 + growth;
        return {
            sims: simulatedPoints,
            accuracy: Math.round(accuracy * 100),
            x: points[exploreIdx]?.x ?? 25,
            y: points[exploreIdx]?.y ?? 80,
        };
    }, [exploreIdx, points]);
    // Touch event coordinate mapping handler
    const handleTouch = (event) => {
        const touchX = event.nativeEvent.locationX;
        // Map touchX (bounding box 25 to 310) to the nearest index (0 to 10)
        const relativeX = (touchX - 25) / (320 - 50);
        const idx = Math.max(0, Math.min(10, Math.round(relativeX * 10)));
        if (idx !== exploreIdx) {
            setExploreIdx(idx);
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        }
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* TOP COMPACT HEADER */}
        <AppHeader_1.default title="DRAFT SCORECARD" subtitle="HIGH-FIDELITY ANALYTICS SUITE"/>

        {/* COMPACT SUMMARY HEADER CARD */}
        <react_native_1.View style={[styles.gradeCard, isHOF && styles.hofGradeCard]}>
          <react_native_1.View style={styles.gradeBoxRow}>
            <react_native_1.View style={styles.gradeCircle}>
              <react_native_1.Text style={[styles.gradeLetterText, isHOF && styles.hofText]}>{grade}</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.gradeHeaderMeta}>
              <react_native_1.Text style={styles.gradeHeaderKicker}>{isHOF ? '🏆 HALL OF FAME RATING' : 'DRAFT GRADE'}</react_native_1.Text>
              <react_native_1.Text style={styles.gradeHeaderRecord}>{Math.round(projectedWins)} - {Math.round(projectedLosses)} Projected</react_native_1.Text>
              <react_native_1.Text style={styles.gradeHeaderPlayoff}>{Math.round(playoffChance)}% Playoff Probability</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.Text style={styles.gradeHeaderSummaryText}>
            {grade === 'A+' && 'Masterful. You captured immense draft value across almost every single round.'}
            {grade === 'A' && 'Outstanding. You navigated positional scarcity perfectly and built deep lineups.'}
            {grade.startsWith('B') && 'Strong draft. Solid roster balance with very minor ADP slips.'}
            {grade === 'C' && 'Average draft. Reached on several positions; depth could be highly vulnerable.'}
            {grade === 'D' && 'Tough draft board. We recommend monitoring active news to adjust starters.'}
          </react_native_1.Text>
        </react_native_1.View>

        {/* DYNAMIC DASHBOARD TAB HEADER */}
        <react_native_1.View style={styles.tabSwitcher}>
          <react_native_1.Pressable style={[styles.tabButton, activeTab === 'roster' && styles.tabButtonActive]} onPress={() => { setActiveTab('roster'); triggerHaptic(Haptics.ImpactFeedbackStyle.Light); }}>
            <react_native_1.Text style={[styles.tabButtonText, activeTab === 'roster' && styles.tabButtonTextActive]}>ROSTER</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={[styles.tabButton, activeTab === 'coach' && styles.tabButtonActive]} onPress={() => { setActiveTab('coach'); triggerHaptic(Haptics.ImpactFeedbackStyle.Light); }}>
            <react_native_1.Text style={[styles.tabButtonText, activeTab === 'coach' && styles.tabButtonTextActive]}>COACH</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={[styles.tabButton, activeTab === 'performance' && styles.tabButtonActive]} onPress={() => { setActiveTab('performance'); triggerHaptic(Haptics.ImpactFeedbackStyle.Light); }}>
            <react_native_1.Text style={[styles.tabButtonText, activeTab === 'performance' && styles.tabButtonTextActive]}>PERFORMANCE</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={[styles.tabButton, activeTab === 'leaderboard' && styles.tabButtonActive]} onPress={() => { setActiveTab('leaderboard'); triggerHaptic(Haptics.ImpactFeedbackStyle.Light); }}>
            <react_native_1.Text style={[styles.tabButtonText, activeTab === 'leaderboard' && styles.tabButtonTextActive]}>LEADERBOARD</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.Pressable style={[styles.tabButton, activeTab === 'board' && styles.tabButtonActive]} onPress={() => { setActiveTab('board'); triggerHaptic(Haptics.ImpactFeedbackStyle.Light); }}>
            <react_native_1.Text style={[styles.tabButtonText, activeTab === 'board' && styles.tabButtonTextActive]}>BOARD</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>

        {isSimulating && (<react_native_1.View style={styles.simulatingOverlay}>
            <react_native_1.ActivityIndicator size="large" color={Colors.hofYellow}/>
            <react_native_1.Text style={styles.simulatingText}>Training AI Bots... {simProgress}%</react_native_1.Text>
            <react_native_1.View style={styles.overlayProgressBarBg}>
              <react_native_1.View style={[styles.overlayProgressBarFill, { width: `${simProgress}%` }]}/>
            </react_native_1.View>
            <react_native_1.Text style={{ fontFamily: theme_1.Fonts.body, fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
              Simulating 5,000 leagues to optimize strategy weights
            </react_native_1.Text>
          </react_native_1.View>)}

        <react_native_1.ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* TAB A: ROSTER GRID TAB */}
          {activeTab === 'roster' && (<react_native_1.View style={styles.rosterSection}>
              {/* STARTERS GRID */}
              <react_native_1.View style={styles.columnHeaderRow}>
                <react_native_1.View style={[styles.rankingsRowLeftSection, { width: 76, justifyContent: 'center' }]}>
                  <react_native_1.Text style={styles.columnHeaderText}>SLOT/BYE</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={{ width: 32 }}/>
                <react_native_1.View style={styles.rankingsRowInfo}>
                  <react_native_1.Text style={styles.columnHeaderText}>STARTER SLOTS</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <react_native_1.View style={styles.gridContainer}>
                {starters.map((slot) => (<react_native_1.View key={slot.id} style={styles.rankingsRowItem}>
                    <react_native_1.View style={styles.rankingsRowLeftSection}>
                      <react_native_1.View style={[
                    styles.posRankBadge,
                    { backgroundColor: getSlotBgColor(slot.label) }
                ]}>
                        <react_native_1.Text style={[
                    styles.posRankBadgeText,
                    { color: getSlotTextColor(slot.label) }
                ]}>
                          {slot.label}
                        </react_native_1.Text>
                      </react_native_1.View>
                      {slot.player && (<react_native_1.View style={[
                        styles.posRankBadge,
                        {
                            backgroundColor: '#ffffff',
                        }
                    ]}>
                          <react_native_1.Text style={[
                        styles.posRankBadgeText,
                        { color: '#000000', fontWeight: 'bold' }
                    ]}>
                            {slot.player.bye}
                          </react_native_1.Text>
                        </react_native_1.View>)}
                    </react_native_1.View>
                    {slot.player ? (<>
                        <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(slot.player.espnId, slot.player.position, slot.player.team) }} style={styles.rankingsRowHeadshot}/>
                        <react_native_1.View style={styles.rankingsRowInfo}>
                          <react_native_1.Text style={styles.rankingsRowName} numberOfLines={1}>
                            {getDisplayName(slot.player.name)}
                          </react_native_1.Text>
                          <react_native_1.Text style={styles.rankingsRowMeta}>
                            {slot.player.team} · {getPlayerProjections(slot.player)}
                          </react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.pickDetails}>
                          <react_native_1.Text style={styles.pickLabel}>PICK</react_native_1.Text>
                          <react_native_1.Text style={styles.pickVal}>#{getUserPickNumber(slot.player.name)}</react_native_1.Text>
                        </react_native_1.View>
                      </>) : (<react_native_1.View style={styles.emptySlotContainer}>
                        <react_native_1.Text style={styles.emptySlotText}>Empty Starting Slot</react_native_1.Text>
                      </react_native_1.View>)}
                  </react_native_1.View>))}
              </react_native_1.View>

              {/* BENCH GRID */}
              <react_native_1.View style={[styles.columnHeaderRow, { marginTop: theme_1.Spacing.four }]}>
                <react_native_1.View style={[styles.rankingsRowLeftSection, { width: 76, justifyContent: 'center' }]}>
                  <react_native_1.Text style={styles.columnHeaderText}>SLOT/BYE</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={{ width: 32 }}/>
                <react_native_1.View style={styles.rankingsRowInfo}>
                  <react_native_1.Text style={styles.columnHeaderText}>BENCH SLOTS</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              <react_native_1.View style={styles.gridContainer}>
                {bench.map((slot) => (<react_native_1.View key={slot.id} style={styles.rankingsRowItem}>
                    <react_native_1.View style={styles.rankingsRowLeftSection}>
                      <react_native_1.View style={[
                    styles.posRankBadge,
                    { backgroundColor: getSlotBgColor(slot.label) }
                ]}>
                        <react_native_1.Text style={[
                    styles.posRankBadgeText,
                    { color: getSlotTextColor(slot.label) }
                ]}>
                          {slot.label}
                        </react_native_1.Text>
                      </react_native_1.View>
                      {slot.player && (<react_native_1.View style={[
                        styles.posRankBadge,
                        {
                            backgroundColor: '#ffffff',
                        }
                    ]}>
                          <react_native_1.Text style={[
                        styles.posRankBadgeText,
                        { color: '#000000', fontWeight: 'bold' }
                    ]}>
                            {slot.player.bye}
                          </react_native_1.Text>
                        </react_native_1.View>)}
                    </react_native_1.View>
                    {slot.player ? (<>
                        <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(slot.player.espnId, slot.player.position, slot.player.team) }} style={styles.rankingsRowHeadshot}/>
                        <react_native_1.View style={styles.rankingsRowInfo}>
                          <react_native_1.Text style={styles.rankingsRowName} numberOfLines={1}>
                            {getDisplayName(slot.player.name)}
                          </react_native_1.Text>
                          <react_native_1.Text style={styles.rankingsRowMeta}>
                            {slot.player.team} · {getPlayerProjections(slot.player)}
                          </react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.pickDetails}>
                          <react_native_1.Text style={styles.pickLabel}>PICK</react_native_1.Text>
                          <react_native_1.Text style={styles.pickVal}>#{getUserPickNumber(slot.player.name)}</react_native_1.Text>
                        </react_native_1.View>
                      </>) : (<react_native_1.View style={styles.emptySlotContainer}>
                        <react_native_1.Text style={styles.emptySlotText}>Empty Bench Slot</react_native_1.Text>
                      </react_native_1.View>)}
                  </react_native_1.View>))}
              </react_native_1.View>

              {/* ADVANCED METRICS SUB-VIEW OPTIONS */}
              <react_native_1.Pressable style={[styles.advancedToggleBtn, showAdvanced && styles.advancedToggleBtnActive]} onPress={() => setShowAdvanced(!showAdvanced)}>
                <react_native_1.Text style={styles.advancedToggleBtnText}>
                  {showAdvanced ? '🔽 HIDE ADVANCED ROSTER METRICS' : '➕ ANALYZE ADVANCED ROSTER METRICS'}
                </react_native_1.Text>
              </react_native_1.Pressable>

              {showAdvanced && (<react_native_1.View style={styles.advancedMetricsCard}>
                  <react_native_1.Text style={styles.advancedTitle}>ROSTER STRENGTH REPORT</react_native_1.Text>
                  
                  <react_native_1.View style={styles.advancedRow}>
                    <react_native_1.View style={styles.advancedCell}>
                      <react_native_1.Text style={[styles.posBadge, { backgroundColor: Colors.positions.QB }]}>QB</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedGradeText}>{getPositionGrade('QB')}</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedSubtext}>{getPositionPPG('QB')} PPG Avg</react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles.advancedCell}>
                      <react_native_1.Text style={[styles.posBadge, { backgroundColor: Colors.positions.RB }]}>RB</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedGradeText}>{getPositionGrade('RB')}</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedSubtext}>{getPositionPPG('RB')} PPG Avg</react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles.advancedCell}>
                      <react_native_1.Text style={[styles.posBadge, { backgroundColor: Colors.positions.WR }]}>WR</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedGradeText}>{getPositionGrade('WR')}</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedSubtext}>{getPositionPPG('WR')} PPG Avg</react_native_1.Text>
                    </react_native_1.View>
                    <react_native_1.View style={styles.advancedCell}>
                      <react_native_1.Text style={[styles.posBadge, { backgroundColor: Colors.positions.TE }]}>TE</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedGradeText}>{getPositionGrade('TE')}</react_native_1.Text>
                      <react_native_1.Text style={styles.advancedSubtext}>{getPositionPPG('TE')} PPG Avg</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>

                  <react_native_1.View style={styles.metricStatsRow}>
                    <react_native_1.View style={styles.metricStatsCard}>
                      <react_native_1.Text style={styles.metricStatsLabel}>BYE COVERAGE SCORE</react_native_1.Text>
                      <react_native_1.Text style={styles.metricStatsValue}>{getByeScore()}%</react_native_1.Text>
                      <react_native_1.Text style={styles.metricStatsFeedback}>
                        {byeConflictCount === 0 ? 'Perfect bye distribution.' : `${byeConflictCount} overlap conflict(s) found.`}
                      </react_native_1.Text>
                    </react_native_1.View>

                    <react_native_1.View style={styles.metricStatsCard}>
                      <react_native_1.Text style={styles.metricStatsLabel}>STARTER/BENCH VALUE</react_native_1.Text>
                      <react_native_1.Text style={styles.metricStatsValue}>{getStarterBenchRatio()}</react_native_1.Text>
                      <react_native_1.Text style={styles.metricStatsFeedback}>Capital starter concentration</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                </react_native_1.View>)}
            </react_native_1.View>)}

          {/* TAB B: STRATEGY COACH */}
          {activeTab === 'coach' && (<react_native_1.View style={styles.coachContainer}>
              <react_native_1.View style={styles.coachBubble}>
                <react_native_1.Text style={styles.coachTitle}>STRATEGY COACH FEEDBACK</react_native_1.Text>
                <react_native_1.Text style={[styles.coachStatus, coachStrategyAnalysis.success ? styles.coachSuccess : styles.coachWarning]}>
                  {coachStrategyAnalysis.success ? '🏆 MASTERFUL EXECUTION' : '⚠️ STRATEGIC DEVIATION'}
                </react_native_1.Text>
                <react_native_1.Text style={styles.coachFeedback}>{coachStrategyAnalysis.feedback}</react_native_1.Text>

                <react_native_1.Text style={styles.coachSubHeader}>SUGGESTED STRATEGY ALTERATIONS:</react_native_1.Text>
                {coachStrategyAnalysis.suggestions.map((sug, i) => (<react_native_1.Text key={i} style={styles.coachSuggestionItem}>
                    • {sug}
                  </react_native_1.Text>))}
              </react_native_1.View>

              {/* VALUE VS ADP COMPARISON LIST */}
              <react_native_1.Text style={styles.coachSectionTitle}>ROUND-BY-ROUND DRAFT VALUE</react_native_1.Text>
              <react_native_1.View style={styles.valueList}>
                {draftHistory.filter(h => h.teamName === (0, useMockMaxxingStore_1.getUserTeamName)() || h.teamName === 'Your Team').map((pick) => {
                const val = pick.player.adp - pick.pickNumber;
                const isSteal = val > 0;
                const isReach = val < 0;
                return (<react_native_1.View key={pick.pickNumber} style={styles.valueRow}>
                      <react_native_1.View style={styles.valueRoundBadge}>
                        <react_native_1.Text style={styles.valueRoundText}>RD {pick.round}</react_native_1.Text>
                        <react_native_1.Text style={styles.valuePickText}>PK {pick.pickNumber}</react_native_1.Text>
                      </react_native_1.View>
                      
                      <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(pick.player.espnId, pick.player.position, pick.player.team) }} style={styles.valueHeadshot}/>

                      <react_native_1.View style={styles.valueInfo}>
                        <react_native_1.Text style={styles.valueName} numberOfLines={1}>{getDisplayName(pick.player.name)}</react_native_1.Text>
                        <react_native_1.Text style={styles.valueMeta}>{pick.player.position} · {pick.player.team} · ECR #{pick.player.rank}</react_native_1.Text>
                      </react_native_1.View>

                      <react_native_1.View style={[
                        styles.valBadge,
                        isSteal && styles.valSteal,
                        isReach && styles.valReach
                    ]}>
                        <react_native_1.Text style={[
                        styles.valBadgeText,
                        isSteal && styles.valStealText,
                        isReach && styles.valReachText
                    ]}>
                          {val === 0 ? 'ON ADP' : val > 0 ? `+${val} VAL` : `${val} REACH`}
                        </react_native_1.Text>
                      </react_native_1.View>
                    </react_native_1.View>);
            })}
              </react_native_1.View>
            </react_native_1.View>)}

          {/* TAB C: EXPECTED PERFORMANCE */}
          {activeTab === 'performance' && (<react_native_1.View style={styles.perfContainer}>
              
              {/* Telemetry Stats Card */}
              <react_native_1.View style={styles.telemetryCard}>
                <react_native_1.Text style={styles.telemetryCardTitle}>SEASON TELEMETRY REPORT</react_native_1.Text>
                <react_native_1.View style={styles.telemetryStatsRow}>
                  <react_native_1.View style={styles.telemetryStat}>
                    <react_native_1.Text style={styles.telemetryStatLabel}>AVG WEEKLY SCORE</react_native_1.Text>
                    <react_native_1.Text style={styles.telemetryStatVal}>{Math.round(performanceTelemetry.avgScore)}</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.View style={styles.telemetryStat}>
                    <react_native_1.Text style={styles.telemetryStatLabel}>TOTAL POINTS FOR</react_native_1.Text>
                    <react_native_1.Text style={styles.telemetryStatVal}>{performanceTelemetry.ptsScored}</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.View style={styles.telemetryStat}>
                    <react_native_1.Text style={styles.telemetryStatLabel}>TOTAL POINTS AGAINST</react_native_1.Text>
                    <react_native_1.Text style={styles.telemetryStatVal}>{performanceTelemetry.ptsAllowed}</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>
              </react_native_1.View>

              {/* EXCELS/FAILS SECTION */}
              <react_native_1.View style={styles.routineGrid}>
                <react_native_1.View style={[styles.routineCard, { borderColor: '#22c55e33' }]}>
                  <react_native_1.Text style={styles.routineHeading}>🌟 EXCELS ROUTINELY AT</react_native_1.Text>
                  <react_native_1.Text style={styles.routineBullet}>• Positional bye-week optimization</react_native_1.Text>
                  <react_native_1.Text style={styles.routineBullet}>
                    {valueScore >= 0
                ? '• Capturing premium ADP value slips'
                : '• Stacking high-efficiency starter floor'}
                  </react_native_1.Text>
                  <react_native_1.Text style={styles.routineBullet}>• Drafting elite WR vertical weapons</react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={[styles.routineCard, { borderColor: '#ef444433' }]}>
                  <react_native_1.Text style={styles.routineHeading}>⚠️ FAILS ROUTINELY AT</react_native_1.Text>
                  <react_native_1.Text style={styles.routineBullet}>• Over-valuing secondary defense/kicker assets</react_native_1.Text>
                  <react_native_1.Text style={styles.routineBullet}>
                    {byeConflictCount >= 2
                ? '• Tolerating bye-week roster lockouts'
                : '• Early round reached positional capitalization'}
                  </react_native_1.Text>
                  <react_native_1.Text style={styles.routineBullet}>• Neglecting late-round backup QB insurance</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              {/* Game-by-Game Weekly telemetry ranges */}
              <react_native_1.Text style={styles.perfSectionTitle}>PROJECTED MATCH PLAYOUTS (14 WEEKS)</react_native_1.Text>
              <react_native_1.View style={styles.weeklyList}>
                {performanceTelemetry.weeklyProjections.map((match) => (<react_native_1.View key={match.week} style={styles.weeklyRow}>
                    <react_native_1.View style={styles.weeklyRoundLabel}>
                      <react_native_1.Text style={styles.weeklyRoundText}>WK {match.week}</react_native_1.Text>
                    </react_native_1.View>
                    
                    <react_native_1.View style={styles.weeklyRangeContainer}>
                      <react_native_1.Text style={styles.weeklyRangeLabelText}>VS {match.opponent.toUpperCase()}</react_native_1.Text>
                      <react_native_1.View style={styles.rangeBarBg}>
                        <react_native_1.View style={[
                    styles.rangeBarFill,
                    {
                        left: `${Math.max(0, (match.floor - 80) * 100 / 80)}%`,
                        width: `${Math.max(10, (match.ceiling - match.floor) * 100 / 80)}%`
                    }
                ]}/>
                        {/* Dot representing median projected score */}
                        <react_native_1.View style={[
                    styles.rangeDot,
                    { left: `${Math.max(0, (match.median - 80) * 100 / 80)}%` }
                ]}/>
                      </react_native_1.View>
                      <react_native_1.Text style={styles.weeklyScoreDetail}>
                        Range: {match.floor} - {match.ceiling} pts · Median: {match.median} pts
                      </react_native_1.Text>
                    </react_native_1.View>

                    <react_native_1.View style={[styles.matchOutcomeBadge, match.isWin ? styles.matchWin : styles.matchLoss]}>
                      <react_native_1.Text style={[styles.matchOutcomeText, match.isWin ? styles.matchWinText : styles.matchLossText]}>
                        {match.isWin ? `W (${match.median}-${match.oppScore})` : `L (${match.median}-${match.oppScore})`}
                      </react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>))}
              </react_native_1.View>

              {/* QUARTER-BY-QUARTER telemetry */}
              <react_native_1.Text style={styles.perfSectionTitle}>QUARTER-BY-QUARTER TELEMETRY</react_native_1.Text>
              <react_native_1.View style={styles.quarterGrid}>
                {/* Q1 */}
                <react_native_1.View style={styles.quarterCard}>
                  <react_native_1.Text style={styles.quarterTitle}>Q1 (WEEKS 1-4)</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterSubtitle}>"Early-Season Burst"</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterStat}>STRENGTH: ELITE (94%)</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterBody}>Your healthy starters carry extreme high-end ADP strength to capture massive early momentum.</react_native_1.Text>
                </react_native_1.View>

                {/* Q2 */}
                <react_native_1.View style={styles.quarterCard}>
                  <react_native_1.Text style={styles.quarterTitle}>Q2 (WEEKS 5-8)</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterSubtitle}>"Bye Week Navigation"</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterStat}>
                    RATING: {getByeScore()}%
                  </react_native_1.Text>
                  <react_native_1.Text style={styles.quarterBody}>
                    {byeConflictCount >= 2
                ? 'Roster contains severe overlapping positional byes. Waiver-wire streams required.'
                : 'Excellent bye dispersion gives you an immense advantage during heavy bye weeks.'}
                  </react_native_1.Text>
                </react_native_1.View>

                {/* Q3 */}
                <react_native_1.View style={styles.quarterCard}>
                  <react_native_1.Text style={styles.quarterTitle}>Q3 (WEEKS 9-12)</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterSubtitle}>"Mid-Season Consolidation"</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterStat}>STRENGTH: STABLE (88%)</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterBody}>Projected starter metrics are locked in. Roster capital guarantees highly consistent double-digit outputs.</react_native_1.Text>
                </react_native_1.View>

                {/* Q4 */}
                <react_native_1.View style={styles.quarterCard}>
                  <react_native_1.Text style={styles.quarterTitle}>Q4 (WEEKS 13-17)</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterSubtitle}>"Late-Season Playoff Push"</react_native_1.Text>
                  <react_native_1.Text style={styles.quarterStat}>
                    DEPTH: {bench.filter(b => b.player).length >= 5 ? 'DEEP (92%)' : 'THIN (64%)'}
                  </react_native_1.Text>
                  <react_native_1.Text style={styles.quarterBody}>
                    {bench.filter(b => b.player).length >= 5
                ? 'Your deep bench ensures you survive late-season attrition and locking playoff runs.'
                : 'Roster is thin. A single starting injury severely risks late playoff competitiveness.'}
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

            </react_native_1.View>)}

          {/* TAB D: LEADERBOARD & TRENDS */}
          {activeTab === 'leaderboard' && (<react_native_1.View style={styles.lobbyContainer}>
              
              {/* Bot Learning / Prepopulate Action Panel */}
              <react_native_1.View style={styles.aiPanel}>
                <react_native_1.Text style={styles.aiPanelTitle}>🤖 BOT MANAGER AI COGNITIVE TELEMETRY</react_native_1.Text>
                
                {/* Visual SVG Curve Chart */}
                <react_native_1.View style={[styles.chartWrapper, { position: 'relative' }]} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderGrant={handleTouch} onResponderMove={handleTouch}>
                  <react_native_svg_1.default width="100%" height="100" viewBox="0 0 320 100">
                    <react_native_svg_1.Defs>
                      <react_native_svg_1.LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <react_native_svg_1.Stop offset="0%" stopColor={Colors.hofYellow} stopOpacity="0.35"/>
                        <react_native_svg_1.Stop offset="100%" stopColor={Colors.hofYellow} stopOpacity="0.0"/>
                      </react_native_svg_1.LinearGradient>
                      <react_native_svg_1.LinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <react_native_svg_1.Stop offset="0%" stopColor={Colors.hofYellow} stopOpacity="0.6"/>
                        <react_native_svg_1.Stop offset="50%" stopColor="#ffb03a" stopOpacity="0.9"/>
                        <react_native_svg_1.Stop offset="100%" stopColor={Colors.hofYellow} stopOpacity="1"/>
                      </react_native_svg_1.LinearGradient>
                    </react_native_svg_1.Defs>

                    {/* Grid lines */}
                    <react_native_svg_1.Line x1="25" y1="10" x2="310" y2="10" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4"/>
                    <react_native_svg_1.Line x1="25" y1="30" x2="310" y2="30" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4"/>
                    <react_native_svg_1.Line x1="25" y1="50" x2="310" y2="50" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4"/>
                    <react_native_svg_1.Line x1="25" y1="80" x2="310" y2="80" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4"/>
                    
                    <react_native_svg_1.Line x1="25" y1="80" x2="25" y2="10" stroke={Colors.glassBorder} strokeWidth="0.5"/>
                    <react_native_svg_1.Line x1="310" y1="80" x2="310" y2="10" stroke={Colors.glassBorder} strokeWidth="0.5"/>

                    {/* Shaded Area Under the Curve */}
                    <react_native_svg_1.Path d={`${pathString} L ${points[points.length - 1]?.x ?? 310} 80 L ${points[0]?.x ?? 25} 80 Z`} fill="url(#areaGradient)"/>

                    {/* Curving Line Path */}
                    <react_native_svg_1.Path d={pathString} fill="none" stroke="url(#lineGradient)" strokeWidth="3"/>
                    
                    {/* Glowing coordinate dot for current training sims */}
                    <react_native_svg_1.Circle cx={curX} cy={curY} r="5" fill={Colors.hofYellow}/>
                    <react_native_svg_1.Circle cx={curX} cy={curY} r="9" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" opacity="0.6"/>
                    
                    {/* Explore line and dot if active */}
                    {exploredPoints && (<>
                        <react_native_svg_1.Line x1={exploredPoints.x} y1="10" x2={exploredPoints.x} y2="80" stroke="rgba(255, 224, 102, 0.4)" strokeWidth="1" strokeDasharray="2 2"/>
                        <react_native_svg_1.Circle cx={exploredPoints.x} cy={exploredPoints.y} r="6" fill="#ffffff"/>
                        <react_native_svg_1.Circle cx={exploredPoints.x} cy={exploredPoints.y} r="10" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5"/>
                      </>)}

                    <react_native_svg_1.Text x="32" y="22" fill="#94a3b8" fontSize="8" fontFamily={theme_1.Fonts.stats}>98% Target</react_native_svg_1.Text>
                    <react_native_svg_1.Text x="32" y="76" fill="#94a3b8" fontSize="8" fontFamily={theme_1.Fonts.stats}>50% Initial</react_native_svg_1.Text>
                  </react_native_svg_1.default>

                  {/* Explore point overlay card */}
                  {exploredPoints && (<react_native_1.View style={styles.exploreTooltip}>
                      <react_native_1.Text style={styles.exploreTooltipText}>
                        📈 SIMS: {exploredPoints.sims.toLocaleString()} | ACCURACY: {exploredPoints.accuracy}%
                      </react_native_1.Text>
                    </react_native_1.View>)}

                  {/* Green circle progress indicator badge */}
                  <react_native_1.View style={[
                styles.greenProgressCircleBadge,
                isSimulating && styles.greenProgressCircleBadgeActive
            ]}>
                    <react_native_1.Text style={styles.greenProgressCircleBadgeText}>
                      {isSimulating ? `${simProgress}%` : `${Math.round((botTrainingSims / 10000) * 100)}%`}
                    </react_native_1.Text>
                    <react_native_1.Text style={styles.greenProgressCircleBadgeSubText}>
                      {isSimulating ? 'TRAINING' : botTrainingSims >= 10000 ? 'COMPLETE' : 'TRAINED'}
                    </react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>

                <react_native_1.View style={styles.aiProgressMetaRow}>
                  <react_native_1.View>
                    <react_native_1.Text style={styles.aiProgressLabel}>SIMULATION RUNS</react_native_1.Text>
                    <react_native_1.Text style={styles.aiProgressVal}>{botTrainingSims.toLocaleString()} / 10,000</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.View style={{ alignItems: 'flex-end' }}>
                    <react_native_1.Text style={styles.aiProgressLabel}>STRATEGY DECISION ACCURACY</react_native_1.Text>
                    <react_native_1.Text style={[styles.aiProgressVal, { color: Colors.hofYellow }]}>{Math.round(curAccuracy * 100)}%</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>

                {/* Progress bar */}
                <react_native_1.View style={styles.aiProgressBarBg}>
                  <react_native_1.View style={[styles.aiProgressBarFill, { width: `${(botTrainingSims / 10000) * 100}%` }]}/>
                </react_native_1.View>

                <react_native_1.Text style={styles.aiProgressExplanation}>
                  {botTrainingSims >= 10000
                ? '🏆 Bots are fully trained! Selection noise is minimized and strategy weights are fully optimized.'
                : '⚡ Bots are currently training. Running simulations decreases decision noise and refines positional strategy parameters.'}
                </react_native_1.Text>

                <react_native_1.View style={styles.aiActionRow}>
                  <react_native_1.Pressable style={styles.aiActionBtn} onPress={handlePopulateSims}>
                    <react_native_1.Text style={styles.aiActionBtnText}>SIMULATE 5,000 LEAGUES</react_native_1.Text>
                  </react_native_1.Pressable>
                  <react_native_1.Pressable style={[styles.aiActionBtn, styles.aiClearBtn]} onPress={handleClearHistory}>
                    <react_native_1.Text style={styles.aiActionBtnTextClear}>RESET DATABASE</react_native_1.Text>
                  </react_native_1.Pressable>
                </react_native_1.View>
              </react_native_1.View>

              {/* STANDINGS LEADERBOARD TABLE */}
              <react_native_1.Text style={styles.lobbySectionTitle}>HISTORICAL STANDINGS LOBBY ({historicalDrafts.length.toLocaleString()} DRAFTS)</react_native_1.Text>
              
              <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ width: '100%' }}>
                <react_native_1.View style={styles.tableContainer}>
                  {/* Table Header */}
                  <react_native_1.View style={styles.tableHeaderRow}>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 36, textAlign: 'center' }]}>RK</react_native_1.Text>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 90 }]}>MANAGER</react_native_1.Text>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 100 }]}>STRATEGY CAMP</react_native_1.Text>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 80, textAlign: 'center' }]}>RECORD</react_native_1.Text>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'center' }]}>WIN %</react_native_1.Text>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'center' }]}>PLAYOFF%</react_native_1.Text>
                    <react_native_1.Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'center' }]}>AVG GRADE</react_native_1.Text>
                  </react_native_1.View>

                  {/* Table Body Rows */}
                  {leaderboardData.map((row, idx) => {
                const isHuman = row.name === (0, useMockMaxxingStore_1.getUserTeamName)() || row.name === 'Your Team';
                return (<react_native_1.View key={row.name} style={[
                        styles.tableRow,
                        isHuman && styles.tableRowHuman
                    ]}>
                        <react_native_1.Text style={[styles.tableCell, { width: 36, textAlign: 'center', fontWeight: 'bold', color: isHuman ? Colors.hofYellow : '#94a3b8' }]}>
                          #{idx + 1}
                        </react_native_1.Text>
                        <react_native_1.View style={[styles.tableNameCell, { width: 90 }]}>
                          <react_native_1.Text style={[styles.tableCellText, isHuman && styles.tableCellHumanText]} numberOfLines={1}>
                            {row.name}
                          </react_native_1.Text>
                          {!isHuman && <react_native_1.Text style={styles.cpuSubLabel}>[CPU]</react_native_1.Text>}
                        </react_native_1.View>
                        <react_native_1.Text style={[styles.tableCell, { width: 100, color: '#e2e8f0' }]} numberOfLines={1}>
                          {row.strategyCamp}
                        </react_native_1.Text>
                        <react_native_1.Text style={[styles.tableCell, { width: 80, textAlign: 'center', fontFamily: theme_1.Fonts.stats, fontSize: 10 }]}>
                          {Math.round(row.totalWins)} - {Math.round(row.totalLosses)}
                        </react_native_1.Text>
                        <react_native_1.Text style={[styles.tableCell, { width: 60, textAlign: 'center', fontWeight: 'bold', color: isHuman ? Colors.hofYellow : '#22c55e' }]}>
                          {Math.round(row.winRate * 100)}%
                        </react_native_1.Text>
                        <react_native_1.Text style={[styles.tableCell, { width: 60, textAlign: 'center' }]}>
                          {row.avgPlayoff}%
                        </react_native_1.Text>
                        <react_native_1.Text style={[styles.tableCell, { width: 60, textAlign: 'center', fontWeight: 'bold', color: row.avgGrade.startsWith('A') ? Colors.hofYellow : '#ffffff' }]}>
                          {row.avgGrade}
                        </react_native_1.Text>
                      </react_native_1.View>);
            })}
                </react_native_1.View>
              </react_native_1.ScrollView>
              
            </react_native_1.View>)}

          {/* TAB E: BOARD VIEW */}
          {activeTab === 'board' && (<react_native_1.View style={styles.boardSection}>
              <react_native_1.View style={styles.boardHeaderCard}>
                <react_native_1.Text style={styles.boardHeaderTitle}>FULL DRAFT BOARD</react_native_1.Text>
                <react_native_1.Text style={styles.boardHeaderSub}>
                  Review the entire 15-round, pick-by-pick league selections. Swipe horizontally to see all teams.
                </react_native_1.Text>
              </react_native_1.View>

              <react_native_1.ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <react_native_1.View style={styles.boardGridContainer}>
                  {/* Column Headers: Teams */}
                  <react_native_1.View style={styles.boardRow}>
                    {/* Corner round index placeholder */}
                    <react_native_1.View style={styles.boardRoundHeaderCell}>
                      <react_native_1.Text style={styles.boardRoundHeaderText}>ROUND</react_native_1.Text>
                    </react_native_1.View>
                    {Array.from({ length: setup.leagueSize }, (_, idx) => {
                const name = (0, useMockMaxxingStore_1.getTeamNameForIndex)(idx, setup.userPosition);
                const isUser = name === (0, useMockMaxxingStore_1.getUserTeamName)() || name === 'Your Team';
                return (<react_native_1.View key={idx} style={[
                        styles.boardTeamHeaderCell,
                        isUser && styles.boardTeamHeaderCellUser
                    ]}>
                          <react_native_1.Text style={[styles.boardTeamHeaderText, isUser && styles.boardTeamHeaderTextUser]} numberOfLines={1}>
                            {isUser ? 'YOUR TEAM' : name.toUpperCase()}
                          </react_native_1.Text>
                          <react_native_1.Text style={styles.boardTeamSubText}>
                            Pick {idx + 1}
                          </react_native_1.Text>
                        </react_native_1.View>);
            })}
                  </react_native_1.View>

                  {/* Grid Rows: Rounds */}
                  {Array.from({ length: setup.rounds || 15 }, (_, rIdx) => {
                const roundNum = rIdx + 1;
                return (<react_native_1.View key={rIdx} style={styles.boardRow}>
                        {/* Round Row Header */}
                        <react_native_1.View style={styles.boardRoundCell}>
                          <react_native_1.Text style={styles.boardRoundCellText}>RD {roundNum}</react_native_1.Text>
                        </react_native_1.View>

                        {/* Each Team's cell in this round */}
                        {Array.from({ length: setup.leagueSize }, (_, tIdx) => {
                        const pick = draftHistory.find(h => h.round === roundNum && h.teamIndex === tIdx);
                        const cellTeamName = (0, useMockMaxxingStore_1.getTeamNameForIndex)(tIdx, setup.userPosition);
                        const isUser = cellTeamName === (0, useMockMaxxingStore_1.getUserTeamName)() || cellTeamName === 'Your Team';
                        if (!pick) {
                            return (<react_native_1.View key={tIdx} style={styles.boardPlayerCellEmpty}>
                                <react_native_1.Text style={styles.boardPlayerTextEmpty}>-</react_native_1.Text>
                              </react_native_1.View>);
                        }
                        const player = pick.player;
                        const posColor = Colors.positions[player.position] || '#94a3b8';
                        return (<react_native_1.View key={tIdx} style={[
                                styles.boardPlayerCell,
                                isUser && styles.boardPlayerCellUser,
                                { borderLeftColor: posColor, borderLeftWidth: 4 }
                            ]}>
                              <react_native_1.View style={styles.boardCellTopRow}>
                                <react_native_1.View style={[styles.boardCellPosBadge, { backgroundColor: posColor }]}>
                                  <react_native_1.Text style={styles.boardCellPosText}>{player.position}</react_native_1.Text>
                                </react_native_1.View>
                                <react_native_1.Text style={styles.boardCellPickNumber}>
                                  #{pick.pickNumber}
                                </react_native_1.Text>
                              </react_native_1.View>
                              <react_native_1.Text style={styles.boardCellName} numberOfLines={1}>
                                {getDisplayName(player.name)}
                              </react_native_1.Text>
                              <react_native_1.Text style={styles.boardCellMeta}>
                                {player.team || 'FA'} · Bye {player.bye || '-'}
                              </react_native_1.Text>
                            </react_native_1.View>);
                    })}
                      </react_native_1.View>);
            })}
                </react_native_1.View>
              </react_native_1.ScrollView>
            </react_native_1.View>)}

          {/* PERSISTENT BOTTOM ACTIONS */}
          <react_native_1.View style={styles.actionContainer}>
            <react_native_1.Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]} onPress={handleRestart}>
              <react_native_1.Text style={styles.primaryBtnText}>START NEW MOCK DRAFT</react_native_1.Text>
            </react_native_1.Pressable>

            <react_native_1.Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]} onPress={handleHome}>
              <react_native_1.Text style={styles.secondaryBtnText}>EXIT TO LOBBY</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>

        </react_native_1.ScrollView>
      </react_native_safe_area_context_1.SafeAreaView>
    </react_native_1.View>);
}
function createStyles(Colors) {
    const isDark = Colors.primaryAccent === '#FFFFFF';
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
        safeArea: {
            flex: 1,
            alignSelf: 'center',
            width: '100%',
            maxWidth: theme_1.MaxContentWidth,
        },
        scrollContent: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingTop: theme_1.Spacing.two,
            paddingBottom: 120, // Expanded padding bottom to clear bottom floating tabs safely
            gap: theme_1.Spacing.four,
        },
        header: {
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.two,
        },
        title: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 28,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: -0.5,
        },
        subtitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            letterSpacing: 2,
        },
        // Compact summary header card
        gradeCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            marginHorizontal: theme_1.Spacing.four,
            ...Colors.shadows,
        },
        hofGradeCard: {
            borderColor: Colors.hofYellow,
            borderWidth: 2,
            backgroundColor: Colors.surface,
            shadowColor: Colors.hofYellow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
        gradeBoxRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.three,
        },
        gradeCircle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        gradeLetterText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 32,
            fontWeight: '900',
            color: Colors.primaryAccent,
        },
        hofText: {
            color: isDark ? Colors.hofYellow : Colors.primaryAccent,
            fontWeight: 'bold',
        },
        gradeHeaderMeta: {
            flex: 1,
            gap: 2,
        },
        gradeHeaderKicker: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
            letterSpacing: 1.5,
            fontWeight: 'bold',
        },
        gradeHeaderRecord: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        gradeHeaderPlayoff: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: '#22c55e',
        },
        gradeHeaderSummaryText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.two,
            lineHeight: 16,
        },
        // Dynamic Dashboard tabs switcher (Apple Segmented Control aesthetics)
        tabSwitcher: {
            flexDirection: 'row',
            backgroundColor: isDark ? Colors.background : '#E2E8F0',
            borderColor: isDark ? Colors.coltsNavyLight : '#CBD5E1',
            borderWidth: 1,
            borderRadius: 10,
            padding: 4,
            minHeight: 46,
            marginHorizontal: theme_1.Spacing.four,
        },
        tabButton: {
            flex: 1,
            height: 38,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
        },
        tabButtonActive: {
            backgroundColor: Colors.surface,
            borderColor: isDark ? Colors.coltsNavyLight : '#E2E8F0',
            borderWidth: 1,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        tabButtonText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: isDark ? Colors.secondaryAccent : '#64748b',
            letterSpacing: 0.5,
        },
        tabButtonTextActive: {
            color: Colors.primaryAccent,
            fontWeight: 'bold',
        },
        // Roster Tab Slots layout
        rosterSection: {
            gap: theme_1.Spacing.two,
        },
        columnHeaderRow: {
            flexDirection: 'row',
            paddingHorizontal: theme_1.Spacing.two,
            paddingBottom: 4,
        },
        columnHeaderText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: '800',
            color: Colors.secondaryAccent,
            letterSpacing: 1.5,
        },
        gridContainer: {
            gap: 6,
        },
        rankingsRowItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: theme_1.Spacing.two,
            gap: 8,
            height: 58,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
        },
        rankingsRowLeftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        posRankBadge: {
            width: 36,
            height: 20,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        posRankBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            color: '#000000',
            fontWeight: '900',
        },
        rankingsRowHeadshot: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: Colors.surfaceLifted,
        },
        rankingsRowInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        rankingsRowName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        rankingsRowMeta: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
        },
        pickDetails: {
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: 4,
        },
        pickLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 6.5,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        pickVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10.5,
            color: Colors.primaryAccent,
            fontWeight: 'bold',
        },
        emptySlotContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        emptySlotText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontStyle: 'italic',
        },
        // Advanced Metrics sub-view
        advancedToggleBtn: {
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: Colors.surface,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: theme_1.Spacing.three,
        },
        advancedToggleBtnActive: {
            borderColor: Colors.coltsNavyLight,
            backgroundColor: Colors.surfaceLifted,
        },
        advancedToggleBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        advancedMetricsCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            marginTop: theme_1.Spacing.two,
            gap: theme_1.Spacing.three,
            ...Colors.shadows,
        },
        advancedTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        advancedRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 4,
        },
        advancedCell: {
            flex: 1,
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 0.5,
            borderRadius: 8,
            padding: 8,
            alignItems: 'center',
            gap: 4,
        },
        posBadge: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
            color: '#000000',
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
        },
        advancedGradeText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        advancedSubtext: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
        },
        metricStatsRow: {
            flexDirection: 'row',
            gap: theme_1.Spacing.two,
        },
        metricStatsCard: {
            flex: 1,
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 0.5,
            borderRadius: 8,
            padding: 10,
            gap: 2,
        },
        metricStatsLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        metricStatsValue: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        metricStatsFeedback: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9.5,
            color: Colors.secondaryAccent,
        },
        // Coach Feedback styles
        coachContainer: {
            gap: theme_1.Spacing.three,
        },
        coachBubble: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            gap: theme_1.Spacing.two,
            ...Colors.shadows,
        },
        coachTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        coachStatus: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: 'bold',
            letterSpacing: 1.5,
        },
        coachSuccess: {
            color: '#22c55e',
        },
        coachWarning: {
            color: '#eab308', // Amber warning for contrast on white
        },
        coachFeedback: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: Colors.primaryAccent,
            lineHeight: 18,
            opacity: 0.9,
        },
        coachSubHeader: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 1,
            marginTop: theme_1.Spacing.two,
        },
        coachSuggestionItem: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            lineHeight: 16,
        },
        coachSectionTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            letterSpacing: 1.5,
            marginTop: theme_1.Spacing.two,
        },
        valueList: {
            gap: 6,
        },
        valueRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: theme_1.Spacing.two,
            gap: theme_1.Spacing.two,
            height: 58, // Up-scaled touch target
        },
        valueRoundBadge: {
            width: 48,
            height: 36,
            borderRadius: 6,
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        valueRoundText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        valuePickText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
        },
        valueHeadshot: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: Colors.surfaceLifted,
        },
        valueInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        valueName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        valueMeta: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9.5,
            color: Colors.secondaryAccent,
        },
        valBadge: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 4,
            minWidth: 64,
            alignItems: 'center',
            backgroundColor: Colors.surfaceLifted,
        },
        valSteal: {
            backgroundColor: '#dcfce7',
            borderColor: '#bbf7d0',
            borderWidth: 0.5,
        },
        valStealText: {
            color: '#15803d',
            fontWeight: 'bold',
        },
        valReach: {
            backgroundColor: '#fee2e2',
            borderColor: '#fecaca',
            borderWidth: 0.5,
        },
        valReachText: {
            color: '#b91c1c',
            fontWeight: 'bold',
        },
        valBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        // Performance Tab styles
        perfContainer: {
            gap: theme_1.Spacing.three,
        },
        telemetryCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            gap: theme_1.Spacing.two,
            ...Colors.shadows,
        },
        telemetryCardTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: Colors.secondaryAccent,
            letterSpacing: 1,
        },
        telemetryStatsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 4,
        },
        telemetryStat: {
            flex: 1,
            backgroundColor: Colors.surfaceLifted,
            padding: 8,
            borderRadius: 8,
            alignItems: 'center',
            gap: 4,
        },
        telemetryStatLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7,
            color: Colors.secondaryAccent,
            textAlign: 'center',
        },
        telemetryStatVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        perfSectionTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            letterSpacing: 1.5,
            marginTop: theme_1.Spacing.two,
        },
        routineGrid: {
            flexDirection: 'row',
            gap: theme_1.Spacing.two,
        },
        routineCard: {
            flex: 1,
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            gap: theme_1.Spacing.one,
            ...Colors.shadows,
        },
        routineHeading: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            color: Colors.primaryAccent,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        routineBullet: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            lineHeight: 15,
        },
        weeklyList: {
            gap: 6,
        },
        weeklyRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: theme_1.Spacing.two,
            gap: theme_1.Spacing.two,
            height: 58, // Up-scaled touch target
        },
        weeklyRoundLabel: {
            width: 44,
            height: 32,
            borderRadius: 6,
            backgroundColor: Colors.surfaceLifted,
            justifyContent: 'center',
            alignItems: 'center',
        },
        weeklyRoundText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        weeklyRangeContainer: {
            flex: 1,
            justifyContent: 'center',
            gap: 2,
        },
        weeklyRangeLabelText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            fontWeight: 'bold',
            color: '#94a3b8',
        },
        rangeBarBg: {
            height: 6,
            backgroundColor: Colors.surfaceLifted,
            borderRadius: 3,
            position: 'relative',
            overflow: 'visible',
            width: '90%',
        },
        rangeBarFill: {
            height: 6,
            backgroundColor: 'rgba(224, 49, 34, 0.15)',
            borderRadius: 3,
            position: 'absolute',
        },
        rangeDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: Colors.coltsNavy,
            position: 'absolute',
            top: -1,
        },
        weeklyScoreDetail: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
        },
        matchOutcomeBadge: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 4,
            minWidth: 64,
            alignItems: 'center',
        },
        matchWin: {
            backgroundColor: '#dcfce7',
        },
        matchLoss: {
            backgroundColor: '#fee2e2',
        },
        matchWinText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            fontWeight: 'bold',
            color: '#15803d',
        },
        matchLossText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            fontWeight: 'bold',
            color: '#b91c1c',
        },
        matchOutcomeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            fontWeight: 'bold',
        },
        quarterGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme_1.Spacing.two,
        },
        quarterCard: {
            width: '48%',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            gap: 3,
            ...Colors.shadows,
        },
        quarterTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            color: Colors.primaryAccent,
            fontWeight: 'bold',
        },
        quarterSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
            fontStyle: 'italic',
        },
        quarterStat: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            marginTop: 4,
        },
        quarterBody: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
            lineHeight: 13,
            marginTop: 2,
        },
        // Leaderboard Lobby styles
        lobbyContainer: {
            gap: theme_1.Spacing.three,
        },
        aiPanel: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.four,
            gap: theme_1.Spacing.two,
            ...Colors.shadows,
        },
        aiPanelTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            color: Colors.primaryAccent,
            letterSpacing: 1,
        },
        chartWrapper: {
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: 4,
        },
        aiProgressMetaRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        aiProgressLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        aiProgressVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        aiProgressBarBg: {
            height: 8,
            backgroundColor: Colors.surfaceLifted,
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: 2,
        },
        aiProgressBarFill: {
            height: 8,
            backgroundColor: Colors.coltsNavy,
            borderRadius: 4,
        },
        aiProgressExplanation: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            lineHeight: 14,
            opacity: 0.8,
        },
        aiActionRow: {
            flexDirection: 'row',
            gap: theme_1.Spacing.two,
            marginTop: theme_1.Spacing.two,
        },
        aiActionBtn: {
            flex: 1.2,
            backgroundColor: Colors.coltsNavy,
            borderColor: Colors.coltsNavy,
            borderWidth: 1.5,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        aiActionBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            color: '#FFFFFF',
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        aiClearBtn: {
            flex: 0.8,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            backgroundColor: 'transparent',
        },
        aiActionBtnTextClear: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            color: '#ef4444',
            letterSpacing: 0.5,
        },
        lobbySectionTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            letterSpacing: 1.5,
            marginTop: theme_1.Spacing.two,
        },
        tableContainer: {
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: Colors.surface,
            width: 530, // static width for horizontal scrolling
        },
        tableHeaderRow: {
            flexDirection: 'row',
            backgroundColor: Colors.surfaceLifted,
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            paddingVertical: 8,
            paddingHorizontal: 8,
        },
        tableHeaderCell: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8.5,
            fontWeight: '800',
            color: Colors.secondaryAccent,
            letterSpacing: 1.5,
        },
        tableRow: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.coltsNavyLight,
            paddingVertical: 8,
            paddingHorizontal: 8,
        },
        tableRowHuman: {
            backgroundColor: 'rgba(255, 205, 0, 0.12)',
            borderBottomColor: 'rgba(255, 205, 0, 0.25)',
            borderBottomWidth: 1,
        },
        tableCellText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        tableCellHumanText: {
            color: Colors.primaryAccent,
            fontWeight: 'bold',
        },
        tableNameCell: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        cpuSubLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
        },
        tableCell: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
        },
        // Simulated draft overlay loader
        simulatingOverlay: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: isDark ? 'rgba(12, 12, 12, 0.95)' : 'rgba(248, 250, 252, 0.95)',
            zIndex: 999,
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme_1.Spacing.three,
        },
        simulatingText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 15,
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        overlayProgressBarBg: {
            width: 240,
            height: 8,
            backgroundColor: Colors.surfaceLifted,
            borderRadius: 4,
            overflow: 'hidden',
            marginTop: theme_1.Spacing.one,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
        },
        overlayProgressBarFill: {
            height: '100%',
            backgroundColor: Colors.coltsNavy,
            borderRadius: 4,
        },
        greenProgressCircleBadge: {
            position: 'absolute',
            top: 8,
            right: 8,
            width: 52,
            height: 52,
            borderRadius: 26,
            borderWidth: 2,
            borderColor: '#22c55e',
            backgroundColor: '#f0fdf4',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 3,
        },
        greenProgressCircleBadgeActive: {
            borderColor: '#4ade80',
            backgroundColor: '#dcfce7',
            shadowOpacity: 0.3,
            shadowRadius: 10,
        },
        greenProgressCircleBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#15803d',
        },
        greenProgressCircleBadgeSubText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 6.5,
            color: '#166534',
            fontWeight: 'bold',
            letterSpacing: 0.2,
            marginTop: -1,
        },
        exploreTooltip: {
            marginTop: theme_1.Spacing.two,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 6,
            paddingHorizontal: 12,
            alignSelf: 'center',
            ...Colors.shadows,
        },
        exploreTooltipText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        // Bottom action buttons
        actionContainer: {
            gap: theme_1.Spacing.two,
            marginTop: theme_1.Spacing.two,
        },
        primaryBtn: {
            backgroundColor: Colors.coltsNavy,
            borderColor: Colors.coltsNavy,
            borderWidth: 1.5,
            borderRadius: 8,
            paddingVertical: 12,
            minHeight: 48,
            justifyContent: 'center',
            alignItems: 'center',
        },
        primaryBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            color: '#FFFFFF',
            fontWeight: 'bold',
            letterSpacing: 1,
        },
        secondaryBtn: {
            backgroundColor: 'transparent',
            borderColor: Colors.primaryAccent,
            borderWidth: 1,
            borderRadius: 8,
            paddingVertical: 12,
            minHeight: 48,
            justifyContent: 'center',
            alignItems: 'center',
        },
        secondaryBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            color: Colors.primaryAccent,
            fontWeight: 'bold',
            letterSpacing: 1,
        },
        btnPressed: {
            opacity: 0.85,
            transform: [{ scale: 0.98 }],
        },
        // Draft Board Styles
        boardSection: {
            padding: theme_1.Spacing.three,
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            marginHorizontal: theme_1.Spacing.three,
            marginTop: theme_1.Spacing.two,
            marginBottom: theme_1.Spacing.four,
            overflow: 'hidden',
            ...Colors.shadows,
        },
        boardHeaderCard: {
            marginBottom: theme_1.Spacing.three,
        },
        boardHeaderTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            textTransform: 'uppercase',
        },
        boardHeaderSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.one,
            lineHeight: 16,
        },
        boardGridContainer: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        boardRow: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.half,
        },
        boardRoundHeaderCell: {
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: theme_1.Spacing.one,
        },
        boardRoundHeaderText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            textAlign: 'center',
        },
        boardTeamHeaderCell: {
            width: 120,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.surfaceLifted,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            marginHorizontal: theme_1.Spacing.half,
            paddingHorizontal: theme_1.Spacing.one,
        },
        boardTeamHeaderCellUser: {
            borderColor: isDark ? Colors.secondaryAccent : Colors.coltsNavy,
            backgroundColor: 'rgba(224, 49, 34, 0.08)',
        },
        boardTeamHeaderText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            textAlign: 'center',
        },
        boardTeamHeaderTextUser: {
            color: Colors.primaryAccent,
        },
        boardTeamSubText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.half,
        },
        boardRoundCell: {
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: theme_1.Spacing.one,
        },
        boardRoundCellText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            textAlign: 'center',
        },
        boardPlayerCell: {
            width: 120,
            height: 64,
            backgroundColor: Colors.surfaceLifted,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            marginHorizontal: theme_1.Spacing.half,
            padding: theme_1.Spacing.one,
            justifyContent: 'space-between',
        },
        boardPlayerCellUser: {
            borderColor: 'rgba(255, 205, 0, 0.5)',
            backgroundColor: 'rgba(255, 205, 0, 0.08)',
        },
        boardCellTopRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        boardCellPosBadge: {
            paddingHorizontal: theme_1.Spacing.one,
            paddingVertical: 1,
            borderRadius: 4,
        },
        boardCellPosText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#000000',
        },
        boardCellPickNumber: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: '#64748b',
        },
        boardCellName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            fontWeight: '600',
            color: Colors.primaryAccent,
            marginTop: 2,
        },
        boardCellMeta: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: 1,
        },
        boardPlayerCellEmpty: {
            width: 120,
            height: 64,
            backgroundColor: 'transparent',
            borderRadius: 8,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: Colors.coltsNavyLight,
            marginHorizontal: theme_1.Spacing.half,
            justifyContent: 'center',
            alignItems: 'center',
        },
        boardPlayerTextEmpty: {
            color: '#64748b',
            fontSize: 16,
        },
    });
}
const lightStyles = createStyles(theme_1.LightColors);
const darkStyles = createStyles(theme_1.DarkColors);
const styles = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
