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
exports.default = ActiveDraftScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const useThemeStore_1 = require("@/store/useThemeStore");
const mockData_1 = require("@/store/mockData");
const theme_1 = require("@/constants/theme");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const SCREEN_HEIGHT = react_native_1.Dimensions.get('window').height;
const SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
// Map top player names to ESPN player IDs for premium headshots
const getPlayerHeadshotUrl = (name, position, team) => {
    const cleanName = name.toLowerCase().replace(/['.-]/g, '').replace(/\s+/g, '').trim();
    if (position === 'DST' && team) {
        return (0, mockData_1.getTeamLogoUrl)(team);
    }
    const mapping = {
        // QBs
        'patrickmahomes': '3139477',
        'joshallen': '3918298',
        'lamarjackson': '3916387',
        'jalenhurts': '4040715',
        'cjstroud': '4432577',
        'joeburrow': '3915290',
        'anthonyrichardson': '4432573',
        'dakprescott': '2578570',
        'jordanlove': '4038941',
        'brockpurdy': '4361741',
        'kylermurray': '3917315',
        'calebwilliams': '4431611',
        'jaredgoff': '3122627',
        'tuatagovailoa': '4241479',
        'trevorlawrence': '4372247',
        'kirkcousins': '14880',
        'jaydendaniels': '4431612',
        'justinherbert': '4426303',
        // RBs
        'christianmccaffrey': '3117251',
        'breecehall': '4426361',
        'bijanrobinson': '4430807',
        'saquonbarkley': '3929630',
        'jonathantaylor': '4242335',
        'jahmyrgibbs': '4430737',
        'derrickhenry': '3043078',
        'kyrenwilliams': '4428800',
        'devonachane': '4430802',
        'travisetiennejr': '4239994',
        'isiahpacheco': '4361517',
        'jamescook': '4361420',
        'joshjacobs': '4047648',
        'alvinkamara': '3054850',
        'rachaadwhite': '4428340',
        'joemixon': '3116385',
        'kennethwalkeriii': '4426338',
        'davidmontgomery': '4035661',
        'jamesconner': '3045138',
        'dandreswift': '4259545',
        'zamirwhite': '4360310',
        'raheemmostert': '17458',
        'najeeharris': '4241457',
        'jaylenwarren': '4363066',
        'tonypollard': '3911229',
        'javontewilliams': '4426336',
        'brianrobinsonjr': '4241400',
        'jonathonbrooks': '4431527',
        'tychandler': '4241398',
        'devinsingletary': '4040774',
        'chubahubbard': '4241389',
        'gusedwards': '3046714',
        'zachcharbonnet': '4426348',
        'jeromeford': '4360216',
        'treybenson': '4431501',
        'ezekielelliott': '3051392',
        'blakecorum': '4426354',
        'ricodowdle': '4046554',
        // WRs
        'ceedeelamb': '4426377',
        'tyreekhill': '15818',
        'justinjefferson': '4262921',
        'jamarrchase': '4362629',
        'amonrastbrown': '4361370',
        'ajbrown': '4047646',
        'garrettwilson': '4426384',
        'pukanacua': '4403332',
        'marvinharrisonjr': '4432571',
        'davanteadams': '16800',
        'chrisolave': '4426390',
        'drakelondon': '4426387',
        'brandonaiyuk': '4241372',
        'mikeevans': '16737',
        'nicocollins': '4426372',
        'deebosamuelsr': '4047650',
        'deebosamuel': '4047650',
        'maliknabers': '4432242',
        'jaylenwaddle': '4361379',
        'dkmetcalf': '4047654',
        'djmoore': '3915416',
        'devontasmith': '4372074',
        'stefondiggs': '2976212',
        'cooperkupp': '2977599',
        'zayflowers': '4361738',
        'teehiggins': '4239993',
        'amaricooper': '2976499',
        'georgepickens': '4431615',
        'tankdell': '4372023',
        'terrymclaurin': '3121422',
        'christiankirk': '3895856',
        'chrisgodwin': '3116157',
        'keenanallen': '15804',
        'jaydenreed': '4361405',
        'calvinridley': '3925347',
        'rasheerice': '4428807',
        'romeodunze': '4432535',
        'diontaejohnson': '3915377',
        'hollywoodbrown': '4040726',
        'courtlandsutton': '3121424',
        'jaxonsmithnjigba': '4430869',
        'laddmcconkey': '4432738',
        'brianthomasjr': '4432179',
        'keoncoleman': '4432585',
        'xavierworthy': '4431614',
        'curtissamuel': '3116155',
        'tylerlockett': '2578384',
        'jakobimeyers': '4038965',
        'romeodoubs': '4361376',
        // TEs
        'samlaporta': '4430856',
        'traviskelce': '15847',
        'treymcbride': '4430752',
        'markandrews': '3116162',
        'daltonkincaid': '4372087',
        'georgekittle': '3041344',
        'kylepitts': '4361369',
        'evanengram': '3116154',
        'jakeferguson': '4242493',
        'davidnjoku': '3123075',
        'brockbowers': '4432569',
        'dallasgoedert': '3121545',
        'patfreiermuth': '4361551',
        'taysomhill': '2974858',
        'colekmet': '4242540',
        'hunterhenry': '3045136',
        // Kickers
        'brandonaubrey': '4682498',
        'harrisonbutker': '3054840',
        'justintucker': '15683',
        'kaimifairbairn': '2971383',
        'jakeelliott': '3051390',
        'younghoekoo': '2985659',
        'jasonsanders': '3917300',
        'evanmcpherson': '4240030',
    };
    const id = mapping[cleanName];
    if (id) {
        return `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`;
    }
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};
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
// Calculate pick number inside cell grid
const getPickNumberForCell = (round, teamIdx, leagueSize, draftType) => {
    if (draftType === 'Snake' && round % 2 === 0) {
        return (round - 1) * leagueSize + (leagueSize - 1 - teamIdx) + 1;
    }
    return (round - 1) * leagueSize + teamIdx + 1;
};
function ActiveDraftScreen() {
    const router = (0, expo_router_1.useRouter)();
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    (0, theme_1.useColors)(); // subscribe to theme changes to trigger re-renders
    const theme = (0, useThemeStore_1.useThemeStore)((state) => state.theme);
    const isDark = theme === 'dark';
    // Store state
    const setup = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.setup);
    const players = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.players);
    const draftStatus = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.draftStatus);
    const currentPick = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.currentPick);
    const draftHistory = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.draftHistory);
    const cpuIsThinking = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.cpuIsThinking);
    const thinkingCpuName = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.thinkingCpuName);
    // Store actions
    const draftPlayer = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.draftPlayer);
    const simulateCpuTurn = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.simulateCpuTurn);
    const getSuggestedPicks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.getSuggestedPicks);
    const resetDraft = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.resetDraft);
    // Local UI State
    const [boardViewMode, setBoardViewMode] = (0, react_1.useState)('round');
    const [activeTab, setActiveTab] = (0, react_1.useState)('suggested');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [posFilter, setPosFilter] = (0, react_1.useState)('ALL');
    const [sheetMode, setSheetMode] = (0, react_1.useState)('collapsed');
    const [starredIds, setStarredIds] = (0, react_1.useState)([]);
    const [isZoomedOut, setIsZoomedOut] = (0, react_1.useState)(false);
    // Animated values
    const sheetHeightAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(200)).current;
    const dragHandleActiveAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const pulseAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    // Premium drag handle micro-interaction interpolations
    const handleWidth = dragHandleActiveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [36, 52], // stretches wider when held
    });
    const handleOpacity = dragHandleActiveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.8], // brightens when active
    });
    const handleScale = dragHandleActiveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.3], // slightly grows thicker
    });
    // ScrollView references for horizontal auto-scrolling
    const horizontalBoardScroll = (0, react_1.useRef)(null);
    // Determine active turn math
    const activeTeamIdx = (0, react_1.useMemo)(() => {
        return (0, useMockMaxxingStore_1.getTeamIndexForPick)(currentPick, setup.leagueSize, setup.draftType);
    }, [currentPick, setup]);
    const isUserTurn = (0, react_1.useMemo)(() => {
        return activeTeamIdx === setup.userPosition - 1;
    }, [activeTeamIdx, setup]);
    // Roster categories for user's team
    const userRoster = (0, react_1.useMemo)(() => {
        return players.filter(p => p.draftedBy === (0, useMockMaxxingStore_1.getUserTeamName)());
    }, [players]);
    // Dynamic starter counts
    const starterCounts = (0, react_1.useMemo)(() => {
        const qbs = userRoster.filter(p => p.position === 'QB').length;
        const rbs = userRoster.filter(p => p.position === 'RB').length;
        const wrs = userRoster.filter(p => p.position === 'WR').length;
        const tes = userRoster.filter(p => p.position === 'TE').length;
        const dst = userRoster.filter(p => p.position === 'DST').length;
        const ks = userRoster.filter(p => p.position === 'K').length;
        // FLX is any extra RB/WR/TE beyond core starters
        const extraRbs = Math.max(0, rbs - 2);
        const extraWrs = Math.max(0, wrs - 3);
        const extraTes = Math.max(0, tes - 1);
        const flx = Math.min(1, extraRbs + extraWrs + extraTes);
        return {
            ALL: userRoster.length,
            QB: qbs,
            RB: rbs,
            WR: wrs,
            TE: tes,
            FLX: flx,
            DST: dst,
            K: ks
        };
    }, [userRoster]);
    // Suggested players
    const suggestedPlayers = (0, react_1.useMemo)(() => {
        // Get all available players that fit basic roster needs
        const userRoster = players.filter(p => p.draftedBy === (0, useMockMaxxingStore_1.getUserTeamName)());
        const qbCount = userRoster.filter(p => p.position === 'QB').length;
        const teCount = userRoster.filter(p => p.position === 'TE').length;
        const kCount = userRoster.filter(p => p.position === 'K').length;
        const dstCount = userRoster.filter(p => p.position === 'DST').length;
        const available = players.filter(p => !p.draftedBy);
        const candidates = available.filter(player => {
            if (player.position === 'QB' && qbCount >= 2)
                return false;
            if (player.position === 'TE' && teCount >= 2)
                return false;
            if (player.position === 'K' && kCount >= 1)
                return false;
            if (player.position === 'DST' && dstCount >= 1)
                return false;
            const currentRound = Math.ceil(currentPick / setup.leagueSize);
            if ((player.position === 'K' || player.position === 'DST') && currentRound < (setup.rounds - 2)) {
                return false;
            }
            return true;
        });
        // Apply the position filter (if not 'ALL')
        const filteredCandidates = posFilter === 'ALL'
            ? candidates
            : candidates.filter(p => p.position === posFilter);
        // Apply search query filter if present
        const searchedCandidates = searchQuery.trim() !== ''
            ? filteredCandidates.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.team.toLowerCase().includes(searchQuery.toLowerCase()))
            : filteredCandidates;
        // Return all suggestions matching filters to allow doom scrolling
        return searchedCandidates;
    }, [players, currentPick, posFilter, searchQuery, setup]);
    // Filtered available list for Rankings tab
    const filteredRankings = (0, react_1.useMemo)(() => {
        return players
            .filter(p => !p.draftedBy)
            .filter(p => posFilter === 'ALL' || p.position === posFilter)
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.team.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [players, posFilter, searchQuery]);
    // Toggle favorite / queue
    const toggleStar = (rank) => {
        if (starredIds.includes(rank)) {
            setStarredIds(starredIds.filter(id => id !== rank));
        }
        else {
            setStarredIds([...starredIds, rank]);
        }
    };
    const queuedPlayers = (0, react_1.useMemo)(() => {
        return players
            .filter(p => !p.draftedBy)
            .filter(p => starredIds.includes(p.rank))
            .filter(p => posFilter === 'ALL' || p.position === posFilter)
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.team.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [players, starredIds, posFilter, searchQuery]);
    const filteredUserRoster = (0, react_1.useMemo)(() => {
        return userRoster
            .filter(p => posFilter === 'ALL' || p.position === posFilter)
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.team.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [userRoster, posFilter, searchQuery]);
    // Dynamic cell dimensions depending on zoom level
    const cellWidth = (0, react_1.useMemo)(() => {
        if (isZoomedOut) {
            return Math.max(45, (SCREEN_WIDTH - 24) / setup.leagueSize);
        }
        return 125;
    }, [isZoomedOut, setup.leagueSize]);
    const cellHeight = isZoomedOut ? 48 : 72;
    // Keep refs of sheetMode and isUserTurn to avoid stale closure in PanResponder callbacks
    const sheetModeRef = (0, react_1.useRef)(sheetMode);
    sheetModeRef.current = sheetMode;
    const isUserTurnRef = (0, react_1.useRef)(isUserTurn);
    isUserTurnRef.current = isUserTurn;
    // Bottom Sheet Swipe Dragging (PanResponder) Setup
    const lastSheetHeight = (0, react_1.useRef)(200);
    const gestureStartHeight = (0, react_1.useRef)(200);
    (0, react_1.useEffect)(() => {
        const listener = sheetHeightAnim.addListener(({ value }) => {
            lastSheetHeight.current = value;
        });
        return () => {
            sheetHeightAnim.removeListener(listener);
        };
    }, [sheetHeightAnim]);
    const panResponder = (0, react_1.useRef)(react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            // Only trigger if movement is primarily vertical
            return Math.abs(gestureState.dy) > 5 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        },
        onPanResponderGrant: () => {
            sheetHeightAnim.stopAnimation();
            gestureStartHeight.current = lastSheetHeight.current;
            // Visual drag handle scale micro-interaction
            react_native_1.Animated.spring(dragHandleActiveAnim, {
                toValue: 1,
                useNativeDriver: false,
                friction: 8,
                tension: 40,
            }).start();
        },
        onPanResponderMove: (_, gestureState) => {
            const collapsedHeight = 80;
            const fullHeight = SCREEN_HEIGHT * 0.92;
            let newHeight = gestureStartHeight.current - gestureState.dy;
            // Apply high-fidelity rubber-band resistance when dragging beyond boundaries
            if (newHeight > fullHeight) {
                const overflow = newHeight - fullHeight;
                newHeight = fullHeight + overflow * 0.25; // 25% sensitivity beyond max
            }
            else if (newHeight < collapsedHeight) {
                const underflow = collapsedHeight - newHeight;
                newHeight = collapsedHeight - underflow * 0.25; // 25% sensitivity beyond min
            }
            sheetHeightAnim.setValue(newHeight);
        },
        onPanResponderRelease: (_, gestureState) => {
            // Return drag handle to original state
            react_native_1.Animated.spring(dragHandleActiveAnim, {
                toValue: 0,
                useNativeDriver: false,
                friction: 8,
                tension: 40,
            }).start();
            const collapsedHeight = 80;
            const fullHeight = SCREEN_HEIGHT * 0.92;
            const midPoint = (collapsedHeight + fullHeight) / 2;
            const currentHeight = lastSheetHeight.current;
            let targetMode = sheetModeRef.current;
            // Premium physics snap calculations based on finger momentum/velocity and position
            const vy = gestureState.vy;
            const velocityThreshold = 0.35; // Swipe speed threshold in px/ms
            if (Math.abs(vy) > velocityThreshold) {
                // Flick detection
                if (vy < 0) {
                    targetMode = 'full'; // Swipe up expands
                }
                else {
                    targetMode = 'collapsed'; // Swipe down collapses
                }
            }
            else {
                // Slow drag - snap based on proximity to midpoint
                if (currentHeight > midPoint) {
                    targetMode = 'full';
                }
                else {
                    targetMode = 'collapsed';
                }
            }
            // Synchronize state
            setSheetMode(targetMode);
            const targetHeight = targetMode === 'collapsed' ? collapsedHeight : fullHeight;
            // Premium damped snap animation
            react_native_1.Animated.spring(sheetHeightAnim, {
                toValue: targetHeight,
                useNativeDriver: false,
                bounciness: 5,
                speed: 12,
            }).start();
        }
    })).current;
    // 1. CPU Simulation Trigger
    (0, react_1.useEffect)(() => {
        if (draftStatus === 'drafting' && !isUserTurn) {
            simulateCpuTurn(() => {
                // When CPU turn ends and user is back on the clock, open the sheet fully to draft
                setSheetMode('full');
            });
        }
    }, [currentPick, isUserTurn, draftStatus]);
    // 2. Summary Redirection Trigger
    (0, react_1.useEffect)(() => {
        if (draftStatus === 'summary') {
            router.replace('/wizard/summary');
        }
    }, [draftStatus]);
    // 2.5 Auto-expand to full sheet when it is the user's pick
    (0, react_1.useEffect)(() => {
        if (draftStatus === 'drafting' && isUserTurn) {
            setSheetMode('full');
        }
    }, [isUserTurn, draftStatus]);
    // 3. Pulse animation for active pick indicators
    (0, react_1.useEffect)(() => {
        const pulse = react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(pulseAnim, {
                toValue: 1.25,
                duration: 900,
                easing: react_native_1.Easing.inOut(react_native_1.Easing.ease),
                useNativeDriver: false,
            }),
            react_native_1.Animated.timing(pulseAnim, {
                toValue: 1.0,
                duration: 900,
                easing: react_native_1.Easing.inOut(react_native_1.Easing.ease),
                useNativeDriver: false,
            }),
        ]));
        pulse.start();
        return () => pulse.stop();
    }, []);
    // 4. Auto scroll horizontal board to keep active pick column visible
    (0, react_1.useEffect)(() => {
        if (horizontalBoardScroll.current && !isZoomedOut) {
            const colWidth = 125;
            const targetOffset = activeTeamIdx * colWidth - 80;
            setTimeout(() => {
                horizontalBoardScroll.current?.scrollTo({
                    x: Math.max(0, targetOffset),
                    animated: true,
                });
            }, 100);
        }
        else if (horizontalBoardScroll.current && isZoomedOut) {
            setTimeout(() => {
                horizontalBoardScroll.current?.scrollTo({
                    x: 0,
                    animated: true,
                });
            }, 100);
        }
    }, [currentPick, activeTeamIdx, isZoomedOut]);
    // 5. Bottom sheet height animations
    (0, react_1.useEffect)(() => {
        const targetHeight = sheetMode === 'collapsed' ? 80 : SCREEN_HEIGHT * 0.92;
        if (Math.abs(lastSheetHeight.current - targetHeight) > 10) {
            react_native_1.Animated.spring(sheetHeightAnim, {
                toValue: targetHeight,
                useNativeDriver: false,
                friction: 8,
                tension: 40,
            }).start();
        }
    }, [sheetMode, isUserTurn]);
    const handleHandleTap = () => {
        if (sheetMode === 'collapsed') {
            setSheetMode('full');
        }
        else {
            setSheetMode('collapsed');
        }
    };
    const handleDraft = (player) => {
        draftPlayer(player.rank, activeTeamIdx, (0, useMockMaxxingStore_1.getUserTeamName)());
        setStarredIds(starredIds.filter(id => id !== player.rank));
        setSearchQuery('');
        setSheetMode('collapsed');
    };
    const handleExit = () => {
        resetDraft();
        router.replace('/');
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* TOP STATUS BAR */}
        <react_native_1.View style={styles.topBar}>
          <react_native_1.Pressable style={styles.exitBtn} onPress={handleExit}>
            <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M15 19L8 12L15 5" stroke="#f87171" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
            </react_native_svg_1.default>
            <react_native_1.Text style={styles.exitBtnText}>EXIT</react_native_1.Text>
          </react_native_1.Pressable>
          <react_native_1.View style={styles.headerDetails}>
            <react_native_1.Text style={styles.headerTitle}>Round {Math.ceil(currentPick / setup.leagueSize)} of {setup.rounds}</react_native_1.Text>
            <react_native_1.Text style={styles.headerSub}>Pick {currentPick} ({(currentPick % setup.leagueSize) || setup.leagueSize} overall)</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.topRightControls}>
            {boardViewMode === 'round' && (<react_native_1.Pressable style={[styles.zoomToggleBtn, isZoomedOut && styles.zoomToggleBtnActive]} onPress={() => setIsZoomedOut(!isZoomedOut)}>
                <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Circle cx={11} cy={11} r={6} stroke={isZoomedOut ? theme_1.Colors.hofYellow : '#94a3b8'} strokeWidth={2}/>
                  <react_native_svg_1.Path d="M20 20L16 16" stroke={isZoomedOut ? theme_1.Colors.hofYellow : '#94a3b8'} strokeWidth={2} strokeLinecap="round"/>
                  {isZoomedOut ? (<react_native_svg_1.Path d="M9 11H13M11 9V13" stroke={theme_1.Colors.hofYellow} strokeWidth={2} strokeLinecap="round"/>) : (<react_native_svg_1.Path d="M9 11H13" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round"/>)}
                </react_native_svg_1.default>
              </react_native_1.Pressable>)}
            <react_native_1.View style={styles.modeToggle}>
              <react_native_1.Pressable style={[styles.modeBtn, boardViewMode === 'round' && styles.modeBtnActive]} onPress={() => setBoardViewMode('round')}>
                <react_native_1.Text style={[styles.modeBtnText, boardViewMode === 'round' && styles.modeBtnTextActive]}>By Round</react_native_1.Text>
              </react_native_1.Pressable>
              <react_native_1.Pressable style={[styles.modeBtn, boardViewMode === 'roster' && styles.modeBtnActive]} onPress={() => setBoardViewMode('roster')}>
                <react_native_1.Text style={[styles.modeBtnText, boardViewMode === 'roster' && styles.modeBtnTextActive]}>By Roster</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>

        {/* MAIN BOARD SECTION */}
        <react_native_1.Animated.View style={[styles.boardContainer, { marginBottom: sheetHeightAnim }]}>
          
          {boardViewMode === 'round' ? (
        /* BY ROUND: HORIZONTAL SCROLLABLE GRID MATRIX */
        <react_native_1.ScrollView ref={horizontalBoardScroll} horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              <react_native_1.View style={styles.grid}>
                
                {/* Columns Header (Teams) */}
                <react_native_1.View style={styles.gridHeaderRow}>
                  {Array.from({ length: setup.leagueSize }).map((_, teamIdx) => {
                const name = (0, useMockMaxxingStore_1.getTeamNameForIndex)(teamIdx, setup.userPosition);
                const isUser = teamIdx === setup.userPosition - 1;
                return (<react_native_1.View key={teamIdx} style={[
                        styles.gridHeaderCell,
                        isUser && styles.gridHeaderCellUser,
                        { width: cellWidth }
                    ]}>
                        <react_native_1.Text style={[
                        isZoomedOut ? styles.gridHeaderCellLabelCompact : styles.gridHeaderCellLabel,
                        isUser && styles.gridHeaderCellLabelUser
                    ]} numberOfLines={1}>
                          {isUser ? (isZoomedOut ? "YOU" : "YOUR TEAM") : (isZoomedOut ? name.substring(0, 3).toUpperCase() : name.toUpperCase())}
                        </react_native_1.Text>
                      </react_native_1.View>);
            })}
                </react_native_1.View>

                {/* Rows Grid (Rounds) */}
                <react_native_1.ScrollView contentContainerStyle={styles.gridRowsScroll} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: setup.rounds }).map((_, roundIdx) => {
                const round = roundIdx + 1;
                return (<react_native_1.View key={round} style={styles.gridRow}>
                        {Array.from({ length: setup.leagueSize }).map((_, teamIdx) => {
                        const pickNum = getPickNumberForCell(round, teamIdx, setup.leagueSize, setup.draftType);
                        const isCurrent = pickNum === currentPick;
                        const historyEntry = draftHistory.find(h => h.pickNumber === pickNum);
                        const player = historyEntry ? historyEntry.player : null;
                        const isUser = teamIdx === setup.userPosition - 1;
                        return (<react_native_1.View key={teamIdx} style={[
                                styles.gridCell,
                                isCurrent && styles.gridCellCurrent,
                                isUser && styles.gridCellUser,
                                { width: cellWidth, height: cellHeight },
                                player && isZoomedOut && { backgroundColor: theme_1.Colors.positions[player.position] }
                            ]}>
                              {player ? (isZoomedOut ? (
                            /* COMPACT ZOOMED OUT VIEW */
                            <react_native_1.View style={[
                                    styles.gridPlayerBlockCompact,
                                    { borderLeftWidth: 0 }
                                ]}>
                                    <react_native_1.Text style={[styles.gridPlayerNameCompact, { color: '#09090b' }]} numberOfLines={1}>
                                      {player.name.split(' ').pop()}
                                    </react_native_1.Text>
                                    <react_native_1.Text style={[styles.gridPlayerSubCompact, { color: 'rgba(9, 9, 11, 0.75)' }]} numberOfLines={1}>
                                      {player.position}·{player.team}
                                    </react_native_1.Text>
                                  </react_native_1.View>) : (
                            /* STANDARD DRAFTED VIEW */
                            <react_native_1.View style={[styles.gridPlayerBlock, { borderLeftColor: theme_1.Colors.positions[player.position] }]}>
                                    <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.gridHeadshot}/>
                                    <react_native_1.View style={styles.gridPlayerDetails}>
                                      <react_native_1.Text style={styles.gridPlayerName} numberOfLines={1}>
                                        {getDisplayName(player.name)}
                                      </react_native_1.Text>
                                      <react_native_1.Text style={styles.gridPlayerSub}>{player.position} · {player.team}</react_native_1.Text>
                                    </react_native_1.View>
                                    <react_native_1.Text style={styles.gridCellPickIndicator}>{round}.{String(teamIdx + 1).padStart(2, '0')}</react_native_1.Text>
                                  </react_native_1.View>)) : (<react_native_1.View style={styles.gridEmptyBlock}>
                                  {isCurrent ? (isZoomedOut ? (
                                /* COMPACT ON-CLOCK VIEW */
                                <react_native_1.Animated.View style={[
                                        styles.onClockPulseCompact,
                                        isUser ? styles.onClockPulseUserCompact : styles.onClockPulseCpuCompact,
                                        { transform: [{ scale: pulseAnim }] }
                                    ]}>
                                        <react_native_1.Text style={[styles.onClockTextCompact, isUser && { color: isDark ? theme_1.Colors.hofYellow : '#000000' }]}>{isUser ? "YOU" : "CPU"}</react_native_1.Text>
                                      </react_native_1.Animated.View>) : (
                                /* STANDARD ON-CLOCK VIEW */
                                <react_native_1.Animated.View style={[
                                        styles.onClockPulse,
                                        isUser ? styles.onClockPulseUser : styles.onClockPulseCpu,
                                        { transform: [{ scale: pulseAnim }] }
                                    ]}>
                                        <react_native_1.Text style={[styles.onClockText, isUser && { color: isDark ? theme_1.Colors.hofYellow : '#000000' }]}>{isUser ? "YOUR PICK!" : "PICKING..."}</react_native_1.Text>
                                        <react_native_svg_1.default width={12} height={12} viewBox="0 0 24 24" fill="none" style={styles.clockIcon}>
                                          <react_native_svg_1.Circle cx={12} cy={12} r={9} stroke={isUser ? theme_1.Colors.hofYellow : "#60a5fa"} strokeWidth={2.5}/>
                                          <react_native_svg_1.Path d="M12 7V12L15 14" stroke={isUser ? theme_1.Colors.hofYellow : "#60a5fa"} strokeWidth={2.5}/>
                                        </react_native_svg_1.default>
                                      </react_native_1.Animated.View>)) : (<react_native_1.Text style={isZoomedOut ? styles.gridEmptyPickTextCompact : styles.gridEmptyPickText}>
                                      {round}.{String(teamIdx + 1).padStart(2, '0')}
                                    </react_native_1.Text>)}
                                </react_native_1.View>)}
                            </react_native_1.View>);
                    })}
                      </react_native_1.View>);
            })}
                </react_native_1.ScrollView>

              </react_native_1.View>
            </react_native_1.ScrollView>) : (
        /* BY ROSTER: VERTICAL ROSTER SUMMARY LIST */
        <react_native_1.ScrollView contentContainerStyle={styles.rostersList} showsVerticalScrollIndicator={false}>
              {Array.from({ length: setup.leagueSize }).map((_, teamIdx) => {
                const name = (0, useMockMaxxingStore_1.getTeamNameForIndex)(teamIdx, setup.userPosition);
                const isUser = teamIdx === setup.userPosition - 1;
                const rosterPicks = draftHistory.filter(h => h.teamIndex === teamIdx);
                return (<react_native_1.View key={teamIdx} style={[styles.rosterCard, isUser && styles.rosterCardUser]}>
                    <react_native_1.Text style={[styles.rosterCardTitle, isUser && styles.rosterCardTitleUser]}>
                      {isUser ? "YOUR TEAM" : name.toUpperCase()}
                    </react_native_1.Text>
                    <react_native_1.View style={styles.rosterCardGrid}>
                      {rosterPicks.map((pick) => (<react_native_1.View key={pick.pickNumber} style={styles.rosterCardPick}>
                          <react_native_1.Text style={[styles.rosterPickNum, { color: theme_1.Colors.positions[pick.player.position] }]}>
                            {pick.round} · {pick.player.position}
                          </react_native_1.Text>
                          <react_native_1.Text style={styles.rosterPickName} numberOfLines={1}>{pick.player.name}</react_native_1.Text>
                        </react_native_1.View>))}
                      {rosterPicks.length === 0 && (<react_native_1.Text style={styles.rosterCardEmpty}>No picks yet.</react_native_1.Text>)}
                    </react_native_1.View>
                  </react_native_1.View>);
            })}
            </react_native_1.ScrollView>)}

        </react_native_1.Animated.View>

        {/* BOTTOM SHEET WIDGET (Sleeper style) */}
        <react_native_1.Animated.View style={[
            styles.sheet,
            {
                height: sheetHeightAnim,
                paddingBottom: insets.bottom + theme_1.Spacing.two
            }
        ]}>
          
          {/* Drag Handle Area */}
          <react_native_1.View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
            <react_native_1.Pressable onPress={handleHandleTap} style={styles.dragHandleHitbox}>
              <react_native_1.Animated.View style={[
            styles.dragHandle,
            {
                width: handleWidth,
                opacity: handleOpacity,
                transform: [{ scale: handleScale }]
            }
        ]}/>
            </react_native_1.Pressable>
          </react_native_1.View>

          {/* ON THE CLOCK HEADER */}
          <react_native_1.View {...panResponder.panHandlers} style={styles.sheetHeader}>
            <react_native_1.View style={styles.clockRow}>
              {isUserTurn ? (<react_native_1.View style={styles.userClockWrapper}>
                  <react_native_1.Text style={styles.userClockText}>Your Pick</react_native_1.Text>
                  <react_native_1.Animated.View style={[styles.userPulseDot, { transform: [{ scale: pulseAnim }] }]}/>
                </react_native_1.View>) : (<react_native_1.View style={styles.cpuClockWrapper}>
                  <react_native_1.Text style={styles.cpuClockText}>{thinkingCpuName || 'CPU'} is picking</react_native_1.Text>
                  <react_native_1.Animated.View style={[styles.cpuPulseDot, { transform: [{ scale: pulseAnim }] }]}/>
                </react_native_1.View>)}
              <react_native_1.Text style={styles.sheetOverallPick}>Pick {currentPick} (Round {Math.ceil(currentPick / setup.leagueSize)})</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>



          {/* EXPANDED VIEW: TABS & CONTENT */}
          {sheetMode !== 'collapsed' && (<react_native_1.View style={styles.expandedWrapper}>
              
              {/* TAB ROW */}
              <react_native_1.View style={styles.tabsRow}>
                {[
                { id: 'suggested', label: 'Suggested' },
                { id: 'rankings', label: 'Rankings' },
                { id: 'queue', label: `Queue (${queuedPlayers.length})` },
                { id: 'roster', label: `My Team` }
            ].map((t) => {
                const active = activeTab === t.id;
                return (<react_native_1.Pressable key={t.id} style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={() => setActiveTab(t.id)}>
                      <react_native_1.Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{t.label}</react_native_1.Text>
                    </react_native_1.Pressable>);
            })}
              </react_native_1.View>

              {/* PERSISTENT SEARCH & POSITION FILTER BLOCK */}
              <react_native_1.View style={styles.searchBlock}>
                <react_native_1.TextInput style={styles.sheetSearchInput} placeholder={`Search ${activeTab === 'suggested' ? 'suggestions' : activeTab === 'queue' ? 'queue' : activeTab === 'roster' ? 'roster' : 'players'}...`} placeholderTextColor="#64748b" value={searchQuery} onChangeText={setSearchQuery} autoCorrect={false} autoCapitalize="none"/>
                <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.posChipsScroll}>
                  {['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'].map((filter) => {
                const active = posFilter === filter;
                return (<react_native_1.Pressable key={filter} style={[styles.posChip, active && styles.posChipActive]} onPress={() => setPosFilter(filter)}>
                        <react_native_1.Text style={[styles.posChipText, active && styles.posChipTextActive]}>{filter}</react_native_1.Text>
                      </react_native_1.Pressable>);
            })}
                </react_native_1.ScrollView>
              </react_native_1.View>

              {/* TAB CONTENTS */}
              <react_native_1.View style={styles.sheetListContent}>
                
                {/* SUGGESTED TAB */}
                {activeTab === 'suggested' && (<react_native_1.ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {suggestedPlayers.map((player, idx) => {
                    const isStarred = starredIds.includes(player.rank);
                    const expertPercent = idx === 0 ? '86%' : idx === 1 ? '14%' : '0%';
                    return (<react_native_1.View key={player.rank} style={styles.suggestedItem}>
                          <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.suggestedHeadshot}/>
                          <react_native_1.View style={styles.suggestedInfo}>
                            <react_native_1.View style={styles.suggestedHeaderRow}>
                              <react_native_1.Text style={styles.suggestedName} numberOfLines={1}>{player.name}</react_native_1.Text>
                              <react_native_1.View style={[styles.posBadge, { borderColor: theme_1.Colors.positions[player.position] }]}>
                                <react_native_1.Text style={[styles.posBadgeText, { color: theme_1.Colors.positions[player.position] }]}>{player.posRank}</react_native_1.Text>
                              </react_native_1.View>
                            </react_native_1.View>
                            <react_native_1.Text style={styles.suggestedSub}>{player.team} · Bye {player.bye} · ECR {player.rank}</react_native_1.Text>
                          </react_native_1.View>
                          
                          <react_native_1.View style={styles.suggestedActions}>
                            <react_native_1.View style={styles.expertCol}>
                              <react_native_1.Text style={styles.expertVal}>{expertPercent}</react_native_1.Text>
                              <react_native_1.Text style={styles.expertLbl}>Experts</react_native_1.Text>
                            </react_native_1.View>
                            <react_native_1.Pressable style={styles.starBtn} onPress={() => toggleStar(player.rank)}>
                              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? "#fbbf24" : "none"}>
                                <react_native_svg_1.Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? "#fbbf24" : "#94a3b8"} strokeWidth={2}/>
                              </react_native_svg_1.default>
                            </react_native_1.Pressable>
                            <react_native_1.Pressable style={[styles.draftBtn, !isUserTurn && styles.draftBtnDisabled]} disabled={!isUserTurn} onPress={() => handleDraft(player)}>
                              <react_native_1.Text style={[styles.draftBtnText, !isUserTurn && styles.draftBtnTextDisabled]}>Draft</react_native_1.Text>
                            </react_native_1.Pressable>
                          </react_native_1.View>
                        </react_native_1.View>);
                })}
                  </react_native_1.ScrollView>)}

                {/* RANKINGS TAB (WITH TIERS) */}
                {activeTab === 'rankings' && (<react_native_1.ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {filteredRankings.map((player) => {
                    const isStarred = starredIds.includes(player.rank);
                    // Inject Tier Headings based on Rank
                    const showTierHeader = player.rank === 1 || player.rank === 6 || player.rank === 16 || player.rank === 31 || player.rank === 51;
                    let tierLabel = '';
                    let tierColor = '#ef4444'; // Red
                    if (player.rank === 1) {
                        tierLabel = 'TIER 1';
                        tierColor = '#ef4444';
                    }
                    else if (player.rank === 6) {
                        tierLabel = 'TIER 2';
                        tierColor = '#fbbf24';
                    }
                    else if (player.rank === 16) {
                        tierLabel = 'TIER 3';
                        tierColor = '#fb923c';
                    }
                    else if (player.rank === 31) {
                        tierLabel = 'TIER 4';
                        tierColor = '#60a5fa';
                    }
                    else if (player.rank === 51) {
                        tierLabel = 'TIER 5';
                        tierColor = '#4ade80';
                    }
                    return (<react_native_1.View key={player.rank}>
                          {showTierHeader && (<react_native_1.View style={[styles.tierHeader, { borderBottomColor: tierColor }]}>
                              <react_native_1.Text style={[styles.tierHeaderText, { color: tierColor }]}>{tierLabel}</react_native_1.Text>
                            </react_native_1.View>)}
                          <react_native_1.View style={styles.rankingsRowItem}>
                            <react_native_1.Text style={styles.rankingsRowRank}>{player.rank}</react_native_1.Text>
                            <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.rankingsRowHeadshot}/>
                            <react_native_1.View style={styles.rankingsRowInfo}>
                              <react_native_1.Text style={styles.rankingsRowName} numberOfLines={1}>{player.name}</react_native_1.Text>
                              <react_native_1.Text style={styles.rankingsRowMeta}>
                                <react_native_1.Text style={{ color: theme_1.Colors.positions[player.position], fontWeight: 'bold' }}>{player.posRank}</react_native_1.Text> · {player.team} · Bye {player.bye}
                              </react_native_1.Text>
                            </react_native_1.View>
                            <react_native_1.Pressable style={styles.starBtnSmall} onPress={() => toggleStar(player.rank)}>
                              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? "#fbbf24" : "none"}>
                                <react_native_svg_1.Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? "#fbbf24" : "#94a3b8"} strokeWidth={2}/>
                              </react_native_svg_1.default>
                            </react_native_1.Pressable>
                            <react_native_1.Pressable style={[styles.draftBtnSmall, !isUserTurn && styles.draftBtnDisabled]} disabled={!isUserTurn} onPress={() => handleDraft(player)}>
                              <react_native_1.Text style={[styles.draftBtnTextSmall, !isUserTurn && styles.draftBtnTextDisabled]}>Draft</react_native_1.Text>
                            </react_native_1.Pressable>
                          </react_native_1.View>
                        </react_native_1.View>);
                })}
                    {filteredRankings.length === 0 && (<react_native_1.Text style={styles.emptySearch}>No matching players available.</react_native_1.Text>)}
                  </react_native_1.ScrollView>)}

                {/* QUEUE TAB */}
                {activeTab === 'queue' && (<react_native_1.ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {queuedPlayers.map((player) => (<react_native_1.View key={player.rank} style={styles.rankingsRowItem}>
                        <react_native_1.Text style={styles.rankingsRowRank}>{player.rank}</react_native_1.Text>
                        <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.rankingsRowHeadshot}/>
                        <react_native_1.View style={styles.rankingsRowInfo}>
                          <react_native_1.Text style={styles.rankingsRowName} numberOfLines={1}>{player.name}</react_native_1.Text>
                          <react_native_1.Text style={styles.rankingsRowMeta}>
                            <react_native_1.Text style={{ color: theme_1.Colors.positions[player.position], fontWeight: 'bold' }}>{player.posRank}</react_native_1.Text> · {player.team}
                          </react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.Pressable style={styles.starBtnSmall} onPress={() => toggleStar(player.rank)}>
                          <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="#fbbf24">
                            <react_native_svg_1.Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke="#fbbf24" strokeWidth={2}/>
                          </react_native_svg_1.default>
                        </react_native_1.Pressable>
                        <react_native_1.Pressable style={[styles.draftBtnSmall, !isUserTurn && styles.draftBtnDisabled]} disabled={!isUserTurn} onPress={() => handleDraft(player)}>
                          <react_native_1.Text style={[styles.draftBtnTextSmall, !isUserTurn && styles.draftBtnTextDisabled]}>Draft</react_native_1.Text>
                        </react_native_1.Pressable>
                      </react_native_1.View>))}
                    {queuedPlayers.length === 0 && (<react_native_1.Text style={styles.emptySearch}>
                        {players.filter(p => !p.draftedBy && starredIds.includes(p.rank)).length === 0
                        ? "Queue is empty. Tap the star icon on players to queue them."
                        : "No matching players in queue."}
                      </react_native_1.Text>)}
                  </react_native_1.ScrollView>)}

                {/* MY TEAM ROSTER TAB */}
                {activeTab === 'roster' && (<react_native_1.ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {filteredUserRoster.map((player, idx) => (<react_native_1.View key={player.rank} style={styles.rankingsRowItem}>
                        <react_native_1.View style={styles.rosterCardIndex}>
                          <react_native_1.Text style={styles.rosterCardIndexText}>{idx + 1}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.rankingsRowHeadshot}/>
                        <react_native_1.View style={styles.rankingsRowInfo}>
                          <react_native_1.Text style={styles.rankingsRowName} numberOfLines={1}>{player.name}</react_native_1.Text>
                          <react_native_1.Text style={styles.rankingsRowMeta}>
                            <react_native_1.Text style={{ color: theme_1.Colors.positions[player.position], fontWeight: 'bold' }}>{player.position}</react_native_1.Text> · {player.team} · Bye {player.bye}
                          </react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>))}
                    {filteredUserRoster.length === 0 && (<react_native_1.Text style={styles.emptySearch}>
                        {userRoster.length === 0 ? "No drafted players. Starters will fill up here." : "No matching players in roster."}
                      </react_native_1.Text>)}
                  </react_native_1.ScrollView>)}

              </react_native_1.View>

            </react_native_1.View>)}

        </react_native_1.Animated.View>

      </react_native_safe_area_context_1.SafeAreaView>
    </react_native_1.View>);
}
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        topBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.two,
            backgroundColor: Colors.background,
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            minHeight: 52,
        },
        exitBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 28,
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.35)',
            borderWidth: 1,
            borderRadius: 14,
            paddingHorizontal: 10,
            gap: 4,
        },
        exitBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: '#f87171',
            fontWeight: '800',
            letterSpacing: 1,
        },
        headerDetails: {
            alignItems: 'center',
            flex: 1,
        },
        headerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        headerSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontWeight: '500',
        },
        modeToggle: {
            flexDirection: 'row',
            backgroundColor: Colors.surface,
            borderRadius: 6,
            padding: 2,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        modeBtn: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
        },
        modeBtnActive: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.hofYellow,
            borderWidth: 1,
        },
        modeBtnText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: '700',
        },
        modeBtnTextActive: {
            color: Colors.hofYellow,
        },
        boardContainer: {
            flex: 1,
        },
        grid: {
            flex: 1,
        },
        gridHeaderRow: {
            flexDirection: 'row',
            height: 38,
            borderBottomWidth: 1,
            borderBottomColor: Colors.surfaceLifted,
            backgroundColor: Colors.surface,
        },
        gridHeaderCell: {
            width: 125,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: Colors.surfaceLifted,
            paddingHorizontal: 4,
        },
        gridHeaderCellUser: {
            backgroundColor: Colors.surfaceLifted,
        },
        gridHeaderCellLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            fontWeight: '800',
        },
        gridHeaderCellLabelUser: {
            color: '#34d399',
        },
        gridRowsScroll: {
            paddingBottom: 200,
        },
        gridRow: {
            flexDirection: 'row',
        },
        gridCell: {
            width: 125,
            height: 72,
            borderRightWidth: 1,
            borderRightColor: Colors.surfaceLifted,
            borderBottomWidth: 1,
            borderBottomColor: Colors.surfaceLifted,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.background,
        },
        gridCellCurrent: {
            backgroundColor: Colors.surface,
        },
        gridCellUser: {
            backgroundColor: Colors.surfaceLifted,
        },
        gridPlayerBlock: {
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 6,
            borderLeftWidth: 3,
            position: 'relative',
        },
        gridHeadshot: {
            width: 32,
            height: 32,
            borderRadius: 16,
            marginRight: 4,
        },
        gridPlayerDetails: {
            flex: 1,
            justifyContent: 'center',
        },
        gridPlayerName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        gridPlayerSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
        },
        gridCellPickIndicator: {
            position: 'absolute',
            right: 4,
            bottom: 2,
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
            opacity: 0.5,
        },
        gridEmptyBlock: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        onClockPulse: {
            width: '90%',
            height: '85%',
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
        },
        onClockPulseUser: {
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1.5,
            borderColor: Colors.hofYellow,
        },
        onClockPulseCpu: {
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        onClockText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: '900',
            color: Colors.primaryAccent,
        },
        clockIcon: {
            opacity: 0.9,
        },
        gridEmptyPickText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: Colors.secondaryAccent,
            opacity: 0.3,
        },
        rostersList: {
            padding: theme_1.Spacing.three,
            paddingBottom: 240,
            gap: theme_1.Spacing.three,
        },
        rosterCard: {
            backgroundColor: Colors.surface,
            borderRadius: 10,
            padding: theme_1.Spacing.three,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        rosterCardUser: {
            borderColor: '#34d399',
        },
        rosterCardTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontWeight: '800',
            marginBottom: theme_1.Spacing.two,
        },
        rosterCardTitleUser: {
            color: '#34d399',
        },
        rosterCardGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme_1.Spacing.two,
        },
        rosterCardPick: {
            backgroundColor: Colors.background,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 6,
            width: '48%',
        },
        rosterPickNum: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
        },
        rosterPickName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.primaryAccent,
            marginTop: 2,
        },
        rosterCardEmpty: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            fontStyle: 'italic',
        },
        sheet: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: Colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1.5,
            borderTopColor: Colors.coltsNavyLight,
            zIndex: 100,
            paddingHorizontal: theme_1.Spacing.three,
            // Soft elegant shadow glow overlay
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
            elevation: 24,
        },
        dragHandleContainer: {
            width: '100%',
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dragHandle: {
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#64748b',
            opacity: 0.35,
        },
        sheetHeader: {
            marginBottom: theme_1.Spacing.one,
        },
        clockRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        userClockWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        userClockText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        userPulseDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#22c55e',
        },
        cpuClockWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        cpuClockText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        cpuPulseDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#60a5fa',
        },
        sheetOverallPick: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            fontWeight: '500',
        },
        starterBar: {
            marginVertical: theme_1.Spacing.two,
        },
        starterBarScroll: {
            gap: 8,
            paddingRight: 16,
        },
        starterPill: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: Colors.background,
            borderRadius: 16,
            paddingHorizontal: 12,
            height: 32,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        starterPillActive: {
            borderColor: Colors.hofYellow,
            backgroundColor: Colors.surface,
        },
        starterPillLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: '700',
        },
        starterPillCount: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.primaryAccent,
            fontWeight: '800',
        },
        dragHandleHitbox: {
            paddingVertical: 8,
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        topRightControls: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        zoomToggleBtn: {
            width: 32,
            height: 32,
            borderRadius: 6,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        zoomToggleBtnActive: {
            borderColor: Colors.hofYellow,
            backgroundColor: Colors.surfaceLifted,
        },
        gridHeaderCellLabelCompact: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            fontWeight: '800',
            textAlign: 'center',
        },
        gridPlayerBlockCompact: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            paddingHorizontal: 4,
            borderLeftWidth: 2,
        },
        gridPlayerNameCompact: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        gridPlayerSubCompact: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 7,
            color: Colors.secondaryAccent,
        },
        onClockPulseCompact: {
            width: '90%',
            height: '85%',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
        },
        onClockPulseUserCompact: {
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.hofYellow,
        },
        onClockPulseCpuCompact: {
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        onClockTextCompact: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7,
            fontWeight: '900',
            color: Colors.primaryAccent,
        },
        gridEmptyPickTextCompact: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
            opacity: 0.3,
        },
        collapsedSuggestionsContainer: {
            gap: 6,
            marginTop: theme_1.Spacing.two,
            paddingBottom: 10,
        },
        posBadge: {
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 4,
            paddingVertical: 1,
        },
        posBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: '900',
        },
        expandedWrapper: {
            flex: 1,
        },
        tabsRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: Colors.surfaceLifted,
            paddingBottom: theme_1.Spacing.one,
        },
        tabBtn: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 8,
        },
        tabBtnActive: {
            borderBottomWidth: 3,
            borderBottomColor: Colors.hofYellow,
        },
        tabBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 15,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        tabBtnTextActive: {
            color: Colors.primaryAccent,
        },
        searchBlock: {
            paddingVertical: theme_1.Spacing.two,
            gap: 8,
        },
        sheetSearchInput: {
            backgroundColor: Colors.background,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            borderRadius: 8,
            paddingHorizontal: theme_1.Spacing.three,
            height: 38,
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: Colors.primaryAccent,
        },
        posChipsScroll: {
            gap: 6,
        },
        posChip: {
            paddingHorizontal: 12,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        posChipActive: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.hofYellow,
            borderWidth: 1,
        },
        posChipText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: Colors.secondaryAccent,
            fontWeight: '700',
        },
        posChipTextActive: {
            color: Colors.hofYellow,
        },
        sheetListContent: {
            flex: 1,
        },
        expandedListScroll: {
            paddingBottom: 80,
            gap: 12,
            paddingTop: theme_1.Spacing.two,
        },
        suggestedItem: {
            backgroundColor: Colors.surface,
            borderRadius: 8,
            paddingVertical: 6,
            paddingHorizontal: theme_1.Spacing.two,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            height: 52,
        },
        suggestedHeadshot: {
            width: 34,
            height: 34,
            borderRadius: 17,
        },
        suggestedInfo: {
            flex: 1,
            justifyContent: 'center',
        },
        suggestedHeaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        suggestedName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        suggestedSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
        },
        suggestedActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        expertCol: {
            alignItems: 'center',
            marginRight: 2,
        },
        expertVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: '#34d399',
            fontWeight: 'bold',
        },
        expertLbl: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 8,
            color: Colors.secondaryAccent,
        },
        starBtn: {
            width: 28,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
        },
        draftBtn: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
            borderWidth: 1,
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
        },
        draftBtnDisabled: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.surfaceLifted,
            opacity: 0.4,
        },
        draftBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            fontWeight: 'bold',
            color: '#000000',
        },
        draftBtnTextDisabled: {
            color: Colors.secondaryAccent,
        },
        tierHeader: {
            borderBottomWidth: 1.5,
            paddingBottom: 4,
            marginTop: theme_1.Spacing.two,
            marginBottom: theme_1.Spacing.one,
        },
        tierHeaderText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 2,
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
            height: 52,
        },
        rankingsRowRank: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 12,
            color: '#94a3b8',
            width: 20,
            textAlign: 'center',
            fontWeight: 'bold',
        },
        rankingsRowHeadshot: {
            width: 32,
            height: 32,
            borderRadius: 16,
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
        starBtnSmall: {
            width: 28,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
        },
        draftBtnSmall: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
            borderWidth: 1,
            borderRadius: 6,
            paddingHorizontal: 10,
            height: 28,
            justifyContent: 'center',
            alignItems: 'center',
        },
        draftBtnTextSmall: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            fontWeight: 'bold',
            color: '#000000',
        },
        rosterCardIndex: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: Colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        rosterCardIndexText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: '#94a3b8',
            fontWeight: 'bold',
        },
        emptySearch: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: Colors.secondaryAccent,
            textAlign: 'center',
            paddingVertical: theme_1.Spacing.five,
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
