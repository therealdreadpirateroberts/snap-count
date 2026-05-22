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
exports.default = LandingScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const expo_av_1 = require("expo-av");
const FileSystem = __importStar(require("expo-file-system/legacy"));
const quotes_1 = require("@/constants/quotes");
const useAuthStore_1 = require("@/store/useAuthStore");
const OnboardingScreen_1 = __importDefault(require("@/components/OnboardingScreen"));
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const useCronSyncStore_1 = require("@/store/useCronSyncStore");
function LandingScreen() {
    const Colors = (0, theme_1.useColors)();
    const router = (0, expo_router_1.useRouter)();
    const { user, logout } = (0, useAuthStore_1.useAuthStore)();
    const { historicalDrafts, liveSimStats, myRanks, liveSimRunning, startLiveSimulationLoop, stopLiveSimulationLoop, runBotSelfImprovementTraining, news, featuredSlot1Key, homepageTileCap, showNewsOnHomepage } = (0, useMockMaxxingStore_1.useMockMaxxingStore)();
    const { width } = (0, react_native_1.useWindowDimensions)();
    // Responsive layout breakpoints
    const isDesktop = react_native_1.Platform.OS === 'web' && width >= 1024;
    // Navigation Sub-Tab State
    const [activeTab, setActiveTab] = (0, react_1.useState)('overview');
    const [currentQuoteIndex, setCurrentQuoteIndex] = (0, react_1.useState)(() => Math.floor(Math.random() * quotes_1.INTERSPERSED_QUOTES.length));
    const [isSpeaking, setIsSpeaking] = (0, react_1.useState)(false);
    const [isLoadingAudio, setIsLoadingAudio] = (0, react_1.useState)(false);
    const [apiError, setApiError] = (0, react_1.useState)(null);
    const soundRef = (0, react_1.useRef)(null);
    const cacheRef = (0, react_1.useRef)({});
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) { }
        }
    };
    const pulseAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const waveScale1 = (0, react_1.useRef)(new react_native_1.Animated.Value(0.3)).current;
    const waveScale2 = (0, react_1.useRef)(new react_native_1.Animated.Value(0.3)).current;
    const waveScale3 = (0, react_1.useRef)(new react_native_1.Animated.Value(0.3)).current;
    // Spring scale animations for premium tactile cards
    const scaleSandbox = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const scaleConsensus = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const scaleCheatSheet = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const scaleTop250 = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const scaleSwarm = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const scaleNews = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const handlePressIn = (animatedValue) => {
        react_native_1.Animated.spring(animatedValue, {
            toValue: 0.96,
            useNativeDriver: true,
            tension: 140,
            friction: 6,
        }).start();
    };
    const handlePressOut = (animatedValue) => {
        react_native_1.Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 140,
            friction: 6,
        }).start();
    };
    const fabScale = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const handleFabPressIn = () => {
        react_native_1.Animated.spring(fabScale, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 180,
            friction: 8,
        }).start();
    };
    const handleFabPressOut = () => {
        react_native_1.Animated.spring(fabScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 180,
            friction: 8,
        }).start();
    };
    const handleFabPress = () => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/wizard/setup');
    };
    // Live Swarm Telemetry Logs Console State
    const [terminalLogs, setTerminalLogs] = (0, react_1.useState)([
        '🤖 Swarm telemetry console initialized.',
        '⚡ Evolved bot parameter training loop listening...',
        '📊 Active consensus ADP mappings hydrated safely.'
    ]);
    // Terminal scroll reference
    const terminalScrollRef = (0, react_1.useRef)(null);
    // Dynamic calculations for dynamic metrics
    const completedDraftsCount = historicalDrafts?.length || 0;
    const calculateAvgGrade = () => {
        if (!historicalDrafts || historicalDrafts.length === 0)
            return 'A-';
        const sum = historicalDrafts.reduce((acc, draft) => acc + (draft.valueScore || 90), 0);
        const avg = Math.round(sum / historicalDrafts.length);
        if (avg >= 95)
            return 'A+';
        if (avg >= 90)
            return 'A-';
        if (avg >= 85)
            return 'B+';
        if (avg >= 80)
            return 'B';
        return 'C+';
    };
    const calculateAvgScore = () => {
        if (!historicalDrafts || historicalDrafts.length === 0)
            return 92;
        const sum = historicalDrafts.reduce((acc, draft) => acc + (draft.valueScore || 90), 0);
        return Math.round(sum / historicalDrafts.length);
    };
    const avgDraftGrade = calculateAvgGrade();
    const avgDraftScore = calculateAvgScore();
    const activeSheetsCount = (myRanks && myRanks.length > 0) ? myRanks.length : 1;
    const totalSimsCount = liveSimStats?.totalSims || 286600;
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    // Evolved Bot data mappings for Swarm List
    const botsList = [
        { name: 'Andy', strategy: 'Zero RB', expert: 'Consensus', accuracy: 0.94, color: '#c084fc' },
        { name: 'Jason', strategy: 'Hero RB', expert: 'Jason Preference', accuracy: 0.92, color: '#4ade80' },
        { name: 'Mike', strategy: 'Balanced', expert: 'Mike Preference', accuracy: 0.90, color: '#60a5fa' },
        { name: 'Sarah', strategy: 'Robust RB', expert: 'Consensus', accuracy: 0.88, color: '#fb923c' },
        { name: 'David', strategy: 'Elite QB/TE Premium', expert: 'Andy Preference', accuracy: 0.86, color: '#f87171' },
        { name: 'Emily', strategy: 'Late QB/TE Focus', expert: 'Jason Preference', accuracy: 0.84, color: '#FFE066' },
    ];
    const getBotRecord = (botName) => {
        if (liveSimStats?.botRecords && liveSimStats.botRecords[botName]) {
            return liveSimStats.botRecords[botName];
        }
        const defaults = {
            Andy: { wins: 142, losses: 98 },
            Jason: { wins: 135, losses: 105 },
            Mike: { wins: 128, losses: 112 },
            Sarah: { wins: 122, losses: 118 },
            David: { wins: 115, losses: 125 },
            Emily: { wins: 108, losses: 132 },
        };
        return defaults[botName] || { wins: 100, losses: 100 };
    };
    const calculateBotWinRate = (wins, losses) => {
        const total = wins + losses;
        if (total === 0)
            return '50.0%';
        return `${((wins / total) * 100).toFixed(1)}%`;
    };
    // Simulation logs updates driven by background training loop or dynamic timer
    (0, react_1.useEffect)(() => {
        let logInterval = null;
        if (liveSimRunning) {
            logInterval = setInterval(() => {
                const bots = ['Andy', 'Jason', 'Mike', 'Sarah', 'David', 'Emily'];
                const actions = [
                    'mutated consensus arbitrage priority factor to +0.12',
                    'analyzed historical cohort rosters for standard variance',
                    're-evaluated FLEX slot arbitrage projections',
                    'mutated strategist camp weight variables by -0.04',
                    'completed simulated fantasy matchup cohort run',
                    'captured ECR consensus markup of +0.08',
                    'adjusted tight end slot preference parameter to +0.15',
                    'calculated standard deviation boundary variance'
                ];
                const randomBot = bots[Math.floor(Math.random() * bots.length)];
                const randomAction = actions[Math.floor(Math.random() * actions.length)];
                const timestamp = new Date().toTimeString().split(' ')[0];
                setTerminalLogs(prev => [
                    ...prev.slice(-39),
                    `[${timestamp}] 🧠 SwarmBot "${randomBot}" ${randomAction}.`
                ]);
            }, 1800);
        }
        return () => {
            if (logInterval)
                clearInterval(logInterval);
        };
    }, [liveSimRunning]);
    // Append background status messages occasionally
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            if (!liveSimRunning) {
                const timestamp = new Date().toTimeString().split(' ')[0];
                setTerminalLogs(prev => [
                    ...prev.slice(-39),
                    `[${timestamp}] 💤 Swarm idle. Awaiting evolution directive...`
                ]);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [liveSimRunning]);
    // Equalizer bar scales driven by speech
    (0, react_1.useEffect)(() => {
        let anim = null;
        if (isSpeaking) {
            anim = react_native_1.Animated.loop(react_native_1.Animated.parallel([
                react_native_1.Animated.sequence([
                    react_native_1.Animated.timing(waveScale1, { toValue: 1.0, duration: 280, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale1, { toValue: 0.3, duration: 280, useNativeDriver: true }),
                ]),
                react_native_1.Animated.sequence([
                    react_native_1.Animated.delay(80),
                    react_native_1.Animated.timing(waveScale2, { toValue: 1.0, duration: 330, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale2, { toValue: 0.3, duration: 330, useNativeDriver: true }),
                ]),
                react_native_1.Animated.sequence([
                    react_native_1.Animated.delay(160),
                    react_native_1.Animated.timing(waveScale3, { toValue: 1.0, duration: 230, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale3, { toValue: 0.3, duration: 230, useNativeDriver: true }),
                ]),
            ]));
            anim.start();
        }
        else if (isLoadingAudio) {
            anim = react_native_1.Animated.loop(react_native_1.Animated.sequence([
                react_native_1.Animated.parallel([
                    react_native_1.Animated.timing(waveScale1, { toValue: 0.7, duration: 500, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale2, { toValue: 0.7, duration: 500, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale3, { toValue: 0.7, duration: 500, useNativeDriver: true }),
                ]),
                react_native_1.Animated.parallel([
                    react_native_1.Animated.timing(waveScale1, { toValue: 0.3, duration: 500, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale2, { toValue: 0.3, duration: 500, useNativeDriver: true }),
                    react_native_1.Animated.timing(waveScale3, { toValue: 0.3, duration: 500, useNativeDriver: true }),
                ]),
            ]));
            anim.start();
        }
        else {
            waveScale1.setValue(0.3);
            waveScale2.setValue(0.3);
            waveScale3.setValue(0.3);
        }
        return () => {
            if (anim)
                anim.stop();
        };
    }, [isSpeaking, isLoadingAudio]);
    // Spring pulse animation
    (0, react_1.useEffect)(() => {
        const pulse = react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
            react_native_1.Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
        ]));
        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim]);
    const stopAllSpeech = async () => {
        try {
            setIsLoadingAudio(false);
            if (soundRef.current) {
                if (react_native_1.Platform.OS === 'web') {
                    console.log('🔊 [Web] Stopping HTML5 audio playback...');
                    const audio = soundRef.current;
                    audio.pause();
                    soundRef.current = null;
                }
                else {
                    console.log('🔊 [Native] Stopping expo-av audio playback...');
                    await soundRef.current.stopAsync().catch(() => { });
                    await soundRef.current.unloadAsync().catch(() => { });
                    soundRef.current = null;
                }
            }
            setIsSpeaking(false);
        }
        catch (e) {
            console.error('Failed to stop speech:', e);
        }
    };
    const handleNextQuote = async () => {
        await stopAllSpeech();
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes_1.INTERSPERSED_QUOTES.length);
    };
    const activeRequestsRef = (0, react_1.useRef)({});
    const synthesizeQuoteAudio = async (index) => {
        if (cacheRef.current[index]) {
            return cacheRef.current[index];
        }
        if (activeRequestsRef.current[index]) {
            return activeRequestsRef.current[index];
        }
        console.log(`🎙️ [Background] Starting synthesis for quote ${index} in Bill Oxley voice...`);
        const promise = (async () => {
            try {
                const activeQuote = quotes_1.INTERSPERSED_QUOTES[index];
                const ELEVEN_API_KEY = process.env.EXPO_PUBLIC_ELEVEN_API_KEY || 'sk_4f01eb23c51508126342a7a0c0d0211fa08653f6c950759e';
                const BILL_OXLEY_VOICE_ID = 'iiidtqDt9FBdT1vfBluA';
                const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${BILL_OXLEY_VOICE_ID}`, {
                    method: 'POST',
                    headers: {
                        'xi-api-key': ELEVEN_API_KEY,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: activeQuote.text,
                        model_id: 'eleven_multilingual_v2',
                        voice_settings: {
                            stability: 0.35,
                            similarity_boost: 0.85,
                            style: 0.55,
                            use_speaker_boost: true,
                        },
                    }),
                }).catch(err => {
                    throw new Error('CORS or Network Blocked. Ad-blocker might be active.');
                });
                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`ElevenLabs returned status code ${response.status}: ${errText}`);
                }
                const blob = await response.blob();
                let audioUrl = '';
                if (react_native_1.Platform.OS === 'web') {
                    audioUrl = URL.createObjectURL(blob);
                }
                else {
                    const reader = new FileReader();
                    const localPath = `${FileSystem.cacheDirectory}quote_${index}.mp3`;
                    const base64Promise = new Promise((resolve, reject) => {
                        reader.onloadend = () => {
                            const base64data = reader.result.split(',')[1];
                            resolve(base64data);
                        };
                        reader.onerror = reject;
                    });
                    reader.readAsDataURL(blob);
                    const base64data = await base64Promise;
                    await FileSystem.writeAsStringAsync(localPath, base64data, {
                        encoding: 'base64',
                    });
                    audioUrl = localPath;
                }
                cacheRef.current[index] = audioUrl;
                console.log(`✅ [Background] Quote ${index} successfully synthesized and cached!`);
                return audioUrl;
            }
            finally {
                delete activeRequestsRef.current[index];
            }
        })();
        activeRequestsRef.current[index] = promise;
        return promise;
    };
    const preFetchQuote = async (index) => {
        if (!user)
            return;
        try {
            await synthesizeQuoteAudio(index);
        }
        catch (err) {
            console.warn(`🎙️ [Background] Failed to pre-fetch quote ${index}:`, err);
        }
    };
    // Retired quotes speaker panel pre-fetch to optimize startup speed and ElevenLabs quota
    // useEffect(() => {
    //   preFetchQuote(currentQuoteIndex);
    //   const timer = setTimeout(() => {
    //     preFetchQuote((currentQuoteIndex + 1) % INTERSPERSED_QUOTES.length);
    //   }, 1000);
    //   return () => clearTimeout(timer);
    // }, [currentQuoteIndex]);
    if (!user) {
        return <OnboardingScreen_1.default />;
    }
    const handlePlayQuote = async () => {
        try {
            if (isSpeaking || isLoadingAudio) {
                await stopAllSpeech();
                return;
            }
            setApiError(null);
            if (react_native_1.Platform.OS !== 'web') {
                await expo_av_1.Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                }).catch(() => { });
            }
            let audioUrl = cacheRef.current[currentQuoteIndex];
            if (!audioUrl) {
                setIsLoadingAudio(true);
                audioUrl = await synthesizeQuoteAudio(currentQuoteIndex);
            }
            setIsLoadingAudio(false);
            setIsSpeaking(true);
            if (react_native_1.Platform.OS === 'web') {
                const audio = new window.Audio(audioUrl);
                soundRef.current = audio;
                audio.onended = () => {
                    setIsSpeaking(false);
                    soundRef.current = null;
                    setCurrentQuoteIndex((prev) => (prev + 1) % quotes_1.INTERSPERSED_QUOTES.length);
                };
                audio.onerror = (e) => {
                    setIsSpeaking(false);
                    soundRef.current = null;
                    setApiError('Audio playback failed in browser.');
                };
                await audio.play().catch(e => {
                    setIsSpeaking(false);
                    soundRef.current = null;
                    setApiError('Autoplay blocked. Tap play button again to listen.');
                });
            }
            else {
                const { sound: newSound } = await expo_av_1.Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: true });
                soundRef.current = newSound;
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        setIsSpeaking(false);
                        newSound.unloadAsync().catch(() => { });
                        soundRef.current = null;
                        setCurrentQuoteIndex((prev) => (prev + 1) % quotes_1.INTERSPERSED_QUOTES.length);
                    }
                });
            }
        }
        catch (err) {
            setIsLoadingAudio(false);
            setIsSpeaking(false);
            setApiError(err.message || 'ElevenLabs connection failed.');
        }
    };
    // Starbucks-style custom Svg vector graphics for cards
    const renderCardGraphic = (type) => {
        switch (type) {
            case 'mock':
                return (<react_native_1.Image source={require('../../assets/images/studio_mock_suite.png')} style={{ width: '100%', height: 160 }} resizeMode="cover"/>);
            case 'news':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="newsGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#1E293B"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#0F172A"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#newsGrad)"/>
            {/* Grid overlay */}
            <react_native_svg_1.Line x1="0" y1="40" x2="320" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="0" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            {/* Newspaper frame mockup */}
            <react_native_svg_1.Rect x="80" y="30" width="160" height="100" rx="4" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5"/>
            <react_native_svg_1.Rect x="90" y="40" width="140" height="10" fill="rgba(255,255,255,0.3)"/>
            <react_native_svg_1.Rect x="90" y="60" width="60" height="45" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="160" y1="65" x2="220" y2="65" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <react_native_svg_1.Line x1="160" y1="75" x2="210" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <react_native_svg_1.Line x1="160" y1="85" x2="225" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <react_native_svg_1.Line x1="90" y1="115" x2="230" y2="115" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5"/>
            {/* Alert indicator dot */}
            <react_native_svg_1.Circle cx="230" cy="30" r="6" fill="#EF4444"/>
            <react_native_svg_1.Circle cx="230" cy="30" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity={0.5}/>
          </react_native_svg_1.default>);
            case 'sheets':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="sheetsGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#0F172A"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#1E293B"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#sheetsGrad)"/>
            {/* Tabular rows mockup */}
            <react_native_svg_1.Rect x="60" y="25" width="200" height="110" rx="6" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5"/>
            {/* Header row */}
            <react_native_svg_1.Rect x="61" y="26" width="198" height="22" rx="4" fill="rgba(255, 255, 255, 0.05)"/>
            <react_native_svg_1.Line x1="110" y1="25" x2="110" y2="135" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="210" y1="25" x2="210" y2="135" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            {/* Data rows */}
            <react_native_svg_1.Line x1="60" y1="48" x2="260" y2="48" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="60" y1="70" x2="260" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="60" y1="92" x2="260" y2="92" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <react_native_svg_1.Line x1="60" y1="114" x2="260" y2="114" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            {/* Text blocks */}
            <react_native_svg_1.Circle cx="85" cy="36" r="4" fill="rgba(255,255,255,0.2)"/>
            <react_native_svg_1.Rect x="120" y="33" width="70" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
            {/* Gold laurel stamp ring rewards outline */}
            <react_native_svg_1.G transform="translate(160, 80) scale(1.4)">
              <react_native_svg_1.Circle cx="0" cy="0" r="18" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" strokeDasharray="4 2"/>
              {/* Star symbol inside laurel */}
              <react_native_svg_1.Path d="M0 -6 L2 -2 L6 -2 L3 1 L4 5 L0 3 L-4 5 L-3 1 L-6 -2 L-2 -2 Z" fill={Colors.hofYellow}/>
            </react_native_svg_1.G>
          </react_native_svg_1.default>);
            case 'swarm':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="swarmGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#312E81"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#0F172A"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#swarmGrad)"/>
            {/* Swarm network nodes */}
            <react_native_svg_1.G opacity={0.65}>
              <react_native_svg_1.Circle cx="160" cy="80" r="8" fill="#c084fc"/>
              <react_native_svg_1.Circle cx="100" cy="50" r="5" fill="#60a5fa"/>
              <react_native_svg_1.Circle cx="220" cy="50" r="5" fill="#4ade80"/>
              <react_native_svg_1.Circle cx="100" cy="110" r="5" fill="#fb923c"/>
              <react_native_svg_1.Circle cx="220" cy="110" r="5" fill="#FFE066"/>
              {/* Interconnecting lines */}
              <react_native_svg_1.Line x1="160" y1="80" x2="100" y2="50" stroke="#60a5fa" strokeWidth="1.5"/>
              <react_native_svg_1.Line x1="160" y1="80" x2="220" y2="50" stroke="#4ade80" strokeWidth="1.5"/>
              <react_native_svg_1.Line x1="160" y1="80" x2="100" y2="110" stroke="#fb923c" strokeWidth="1.5"/>
              <react_native_svg_1.Line x1="160" y1="80" x2="220" y2="110" stroke="#FFE066" strokeWidth="1.5"/>
              <react_native_svg_1.Line x1="100" y1="50" x2="220" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <react_native_svg_1.Line x1="100" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </react_native_svg_1.G>
            {/* Glowing outer rings */}
            <react_native_svg_1.Circle cx="160" cy="80" r="16" fill="none" stroke="#c084fc" strokeWidth="1" opacity={0.3}/>
            <react_native_svg_1.Circle cx="160" cy="80" r="24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 3" opacity={0.2}/>
          </react_native_svg_1.default>);
            case 'leaderboard':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="leadGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor={Colors.coltsNavy}/>
                <react_native_svg_1.Stop offset="100%" stopColor={Colors.background}/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#leadGrad)"/>
            {/* Laurel wreath stamp decoration behind cup */}
            <react_native_svg_1.G transform="translate(160, 75) scale(1.6)" opacity={0.45}>
              <react_native_svg_1.Circle cx="0" cy="0" r="22" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" strokeDasharray="5,3"/>
            </react_native_svg_1.G>
            {/* Golden Championship Trophy Cup outline */}
            <react_native_svg_1.G transform="translate(160, 70)">
              {/* Cup bowl */}
              <react_native_svg_1.Path d="M-15,-30 L15,-30 L12,-5 C12,12 -12,12 -12,-5 Z" fill="none" stroke={Colors.hofYellow} strokeWidth="3"/>
              {/* Cup stem & base */}
              <react_native_svg_1.Path d="M-4,10 L4,10 L6,22 L-6,22 Z" fill="none" stroke={Colors.hofYellow} strokeWidth="2.5"/>
              <react_native_svg_1.Line x1="-12" y1="22" x2="12" y2="22" stroke={Colors.hofYellow} strokeWidth="3.5"/>
              {/* Cup handles */}
              <react_native_svg_1.Path d="M-15,-22 C-22,-22 -22,-10 -13,-5" fill="none" stroke={Colors.hofYellow} strokeWidth="2"/>
              <react_native_svg_1.Path d="M15,-22 C22,-22 22,-10 13,-5" fill="none" stroke={Colors.hofYellow} strokeWidth="2"/>
              {/* Star on trophy */}
              <react_native_svg_1.Path d="M0 -15 L1 -12 L4 -12 L2 -10 L3 -7 L0 -9 L-3 -7 L-2 -10 L-4 -12 L-1 -12 Z" fill={Colors.hofYellow}/>
            </react_native_svg_1.G>
          </react_native_svg_1.default>);
        }
    };
    // Subscribe to central cron sync telemetry store
    const { newsStories, isSyncing, lastSyncTime, nextSyncCountdown } = (0, useCronSyncStore_1.useCronSyncStore)();
    const formatCountdown = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    // Core Cards representing the 10 actionable features or tools
    const coreCards = [
        {
            id: 'mock-draft',
            kicker: 'CORE APPLICATION',
            title: 'ELITE MOCK DRAFT SUITE',
            description: 'Draft in real-time against our evolved neural bot swarm. Calibrate league size, rosters, and test draft strategy camps with dynamic ADP arbitrage telemetry.',
            btnLabel: 'MOCK NOW',
            route: '/wizard/setup',
            graphicType: 'mock'
        },
        {
            id: 'cheat-sheets',
            kicker: 'CUSTOM BOARD BUILDER',
            title: 'CONSENSUS ADP CHEAT SHEETS',
            description: 'Construct your ultimate board. Layer ECR projections, flag sleepers, adjust positional scarcity values, and lock key rankings before entering the draft war room.',
            btnLabel: 'CREATE SHEET',
            route: '/rankings',
            graphicType: 'sheets'
        },
        {
            id: 'leaderboard-stats',
            kicker: 'COACH GRADES & ANOMALIES',
            title: 'HISTORICAL DRAFT LEADERBOARDS',
            description: 'Review your past drafts. Track your GPA value scores over time, study your highest-value draft selections, and analyze positional arbitrage variance graphs.',
            btnLabel: 'VIEW STATS',
            route: '/leaderboard',
            graphicType: 'leaderboard'
        },
        {
            id: 'trade-center',
            kicker: 'DRAFT TRADE SUITE',
            title: 'INTERACTIVE SIMULATED TRADE ADVISOR',
            description: 'Evaluate draft trades with our AI trade telemetry engine. Assess roster impacts, value anomalies, and optimize trade equity on the fly.',
            btnLabel: 'MANAGE ALERTS',
            route: '/settings',
            graphicType: 'news'
        },
        {
            id: 'scarcity-wizard',
            kicker: 'BOARD BUILDER WIZARD',
            title: 'POSITIONAL SCARCITY SCANNERS',
            description: 'Calibrate custom scarcity multipliers. Lock down team needs, secure roster anchors, and leverage player tiers dynamically.',
            btnLabel: 'VIEW CHEAT SHEETS',
            route: '/rankings',
            graphicType: 'sheets'
        },
        {
            id: 'simulation-lab',
            kicker: 'EXECUTIVE SYSTEM HARNESS',
            title: 'MONTE CARLO SIMULATIONS LAB',
            description: 'Run high-frequency simulations to optimize bot strategies. Access live telemetry dashboards and bot crawl logs instantly.',
            btnLabel: 'SIMULATION HARNESS',
            route: '/qa-simulation',
            graphicType: 'swarm'
        },
        {
            id: 'roster-recap',
            kicker: 'POST-DRAFT GRADE TELEMETRY',
            title: 'ROSTER RECAP EVALUATOR',
            description: 'Instantly analyze completed drafts. Review your projected wins, playoff chances, value anomaly percentages, and overall GPA grades.',
            btnLabel: 'VIEW RECAPPED RUNS',
            route: '/recap',
            graphicType: 'leaderboard'
        },
        {
            id: 'top250',
            kicker: 'EXPERT ADP DENSITY',
            title: 'TOP 250 CONSENSUS MATRIX',
            description: 'Scan the consolidated Top 250 consensus matrix. Layer expert rankings base values, compare positional trends, and isolate sleeper targets.',
            btnLabel: 'SCAN THE MATRIX',
            route: '/rankings',
            graphicType: 'sheets'
        },
        {
            id: 'user-settings',
            kicker: 'COACH & NOTIFICATION CONFIG',
            title: 'USER PREFERENCES & CONTROL CENTER',
            description: 'Configure system options, theme switches, and inbox notifications. Manage permissions, user sessions, and reset data safely.',
            btnLabel: 'ACCOUNT SETTINGS',
            route: '/settings',
            graphicType: 'news'
        },
        {
            id: 'expert-ecr',
            kicker: 'LIVE EXPERT SCENARIOS',
            title: 'EXPERT CONSENSUS RANKINGS',
            description: 'Compare ECR consensus ranks against Andy, Mike, and Jason. Leverage dynamic positional scarcity indices and draft filters.',
            btnLabel: 'ECR DASHBOARD',
            route: '/rankings',
            graphicType: 'sheets'
        }
    ];
    // Dynamic re-ordering based on CEO Slot 1 promoted key
    const sortedCoreCards = [...coreCards];
    const promotedIndex = sortedCoreCards.findIndex(card => card.id === featuredSlot1Key);
    if (promotedIndex > 0) {
        const [promotedCard] = sortedCoreCards.splice(promotedIndex, 1);
        sortedCoreCards.unshift(promotedCard);
    }
    // Cap at dynamically configured tile cap (default 10)
    const activeTileCap = homepageTileCap !== undefined ? homepageTileCap : 10;
    const homepageTiles = sortedCoreCards.slice(0, activeTileCap).map(card => ({
        type: 'core',
        data: card
    }));
    const renderHomogeneousCard = (tile) => {
        const isCore = tile.type === 'core';
        if (isCore) {
            const card = tile.data;
            return (<react_native_1.Pressable key={card.id} style={({ pressed }) => [
                    styles.tileCard,
                    isDesktop && styles.tileCardDesktop,
                    pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
                ]} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push(card.route);
                }}>
          {/* Aspect Ratio Graphic Banner */}
          <react_native_1.View style={styles.tileImageContainer}>
            {renderCardGraphic(card.graphicType)}
          </react_native_1.View>

          {/* Content Details */}
          <react_native_1.View style={styles.tileContent}>
            <react_native_1.Text style={styles.tileKicker}>{card.kicker}</react_native_1.Text>
            <react_native_1.Text style={styles.tileTitle}>{card.title}</react_native_1.Text>
            <react_native_1.Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
              {card.description}
            </react_native_1.Text>

            {/* Capsule Button */}
            <react_native_1.Pressable style={({ pressed }) => [
                    styles.tileButton,
                    pressed && { opacity: 0.9 }
                ]} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push(card.route);
                }}>
              <react_native_1.Text style={styles.tileButtonText}>{card.btnLabel}</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.Pressable>);
        }
        else {
            const story = tile.data;
            // Determine if we should display the local premium studio action photo or the ESPN combiners
            const imageSource = story.localImage ? story.localImage : { uri: story.imageUrl };
            // Trend Badge Styling
            const trendColor = story.trend === 'up' ? '#22C55E' : '#EF4444';
            const trendIcon = story.trend === 'up' ? '▲' : '▼';
            return (<react_native_1.Pressable key={story.id} style={({ pressed }) => [
                    styles.tileCard,
                    isDesktop && styles.tileCardDesktop,
                    pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
                ]} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/news');
                }}>
          {/* Aspect Ratio Graphic Banner */}
          <react_native_1.View style={styles.tileImageContainer}>
            <react_native_1.Image source={imageSource} style={styles.newsTileImage} resizeMode="cover"/>
            {/* Visual containment shadow overlay */}
            <react_native_1.View style={styles.tileImageOverlay}/>
            
            {/* Trend Indicator Overlay Badge (Apple HIG tactile and high-contrast) */}
            <react_native_1.View style={[styles.newsTrendBadge, { borderColor: Colors.hofYellow }]}>
              <react_native_1.Text style={[styles.newsTrendBadgeText, { color: trendColor }]}>
                {trendIcon} {story.playerName.toUpperCase()} ({story.position})
              </react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>

          {/* Content Details */}
          <react_native_1.View style={styles.tileContent}>
            <react_native_1.View style={styles.newsMetaRow}>
              <react_native_1.View style={[styles.newsTagBadge, { backgroundColor: story.tagColor }]}>
                <react_native_1.Text style={styles.newsTagText}>{story.tag}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Text style={styles.newsTimeText}>{story.timeAgo} • {story.team}</react_native_1.Text>
            </react_native_1.View>

            <react_native_1.Text style={styles.tileTitle} numberOfLines={2} ellipsizeMode="tail">
              {story.headline.toUpperCase()}
            </react_native_1.Text>
            
            <react_native_1.Text style={styles.newsTakeTextKicker}>FANTASY IMPACT REACTION:</react_native_1.Text>
            <react_native_1.Text style={styles.newsTakeText} numberOfLines={3} ellipsizeMode="tail">
              {story.take}
            </react_native_1.Text>

            {/* Capsule Button */}
            <react_native_1.Pressable style={({ pressed }) => [
                    styles.tileButton,
                    pressed && { opacity: 0.9 }
                ]} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/news');
                }}>
              <react_native_1.Text style={styles.tileButtonText}>REACTION TELEMETRY</react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.Pressable>);
        }
    };
    const renderCardFeed = () => {
        return (<react_native_1.View style={styles.feedContainer}>
        <react_native_1.View style={styles.tileGrid}>
          {homepageTiles.map((tile) => renderHomogeneousCard(tile))}
        </react_native_1.View>
      </react_native_1.View>);
    };
    // SVG Chart: Double Curved Line Performance Trend
    const renderLineChart = () => {
        return (<react_native_1.View style={styles.chartPanelCard}>
        <react_native_1.View style={styles.panelHeader}>
          <react_native_1.View>
            <react_native_1.Text style={styles.panelTitle}>DRAFT PERFORMANCE TREND</react_native_1.Text>
            <react_native_1.Text style={styles.panelSubtitle}>Consensus arbitrage capture vs CPU latency cycles</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.legendIndicatorRow}>
            <react_native_1.View style={styles.legendDotItem}>
              <react_native_1.View style={[styles.legendIndicatorDot, { backgroundColor: Colors.hofYellow }]}/>
              <react_native_1.Text style={styles.legendIndicatorLabel}>ADP Arbitrage</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.legendDotItem}>
              <react_native_1.View style={[styles.legendIndicatorDot, { backgroundColor: Colors.coltsBlue }]}/>
              <react_native_1.Text style={styles.legendIndicatorLabel}>CPU Latency</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.svgChartContainer}>
          <react_native_svg_1.default width="100%" height={170} viewBox="0 0 320 170" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="yellowAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor={Colors.hofYellow} stopOpacity={0.25}/>
                <react_native_svg_1.Stop offset="100%" stopColor={Colors.hofYellow} stopOpacity={0.0}/>
              </react_native_svg_1.LinearGradient>
              <react_native_svg_1.LinearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor={Colors.coltsBlue} stopOpacity={0.15}/>
                <react_native_svg_1.Stop offset="100%" stopColor={Colors.coltsBlue} stopOpacity={0.0}/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            
            {/* Dashed Grid Lines */}
            <react_native_svg_1.Line x1="10" y1="30" x2="310" y2="30" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
            <react_native_svg_1.Line x1="10" y1="70" x2="310" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
            <react_native_svg_1.Line x1="10" y1="110" x2="310" y2="110" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>
            <react_native_svg_1.Line x1="10" y1="140" x2="310" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3"/>

            {/* Area under curve 2 (Latency) */}
            <react_native_svg_1.Path d="M 10 118 C 40 105, 50 110, 70 102 C 90 94, 110 115, 130 112.5 C 150 110, 170 85, 190 79.5 C 210 74, 230 98, 250 96 C 270 94, 290 72, 310 68.5 L 310 140 L 10 140 Z" fill="url(#blueAreaGradient)"/>

            {/* Area under curve 1 (Arbitrage) */}
            <react_native_svg_1.Path d="M 10 96 C 40 85, 50 82, 70 79.5 C 90 77, 110 88, 130 90.5 C 150 93, 170 72, 190 68.5 C 210 65, 230 82, 250 79.5 C 270 77, 290 62, 310 57.5 L 310 140 L 10 140 Z" fill="url(#yellowAreaGradient)"/>

            {/* Curve line 2 (Latency) */}
            <react_native_svg_1.Path d="M 10 118 C 40 105, 50 110, 70 102 C 90 94, 110 115, 130 112.5 C 150 110, 170 85, 190 79.5 C 210 74, 230 98, 250 96 C 270 94, 290 72, 310 68.5" fill="none" stroke={Colors.coltsBlue} strokeWidth="2.5"/>

            {/* Curve line 1 (Arbitrage) */}
            <react_native_svg_1.Path d="M 10 96 C 40 85, 50 82, 70 79.5 C 90 77, 110 88, 130 90.5 C 150 93, 170 72, 190 68.5 C 210 65, 230 82, 250 79.5 C 270 77, 290 62, 310 57.5" fill="none" stroke={Colors.hofYellow} strokeWidth="3.5" strokeLinecap="round"/>

            {/* Glowing Coordinate Nodes */}
            <react_native_svg_1.Circle cx="70" cy="79.5" r="5" fill="#18181b" stroke={Colors.hofYellow} strokeWidth="2.5"/>
            <react_native_svg_1.Circle cx="190" cy="68.5" r="5" fill="#18181b" stroke={Colors.hofYellow} strokeWidth="2.5"/>
            <react_native_svg_1.Circle cx="310" cy="57.5" r="5" fill="#18181b" stroke={Colors.hofYellow} strokeWidth="2.5"/>

            <react_native_svg_1.Circle cx="70" cy="102" r="4" fill="#18181b" stroke={Colors.coltsBlue} strokeWidth="2"/>
            <react_native_svg_1.Circle cx="190" cy="79.5" r="4" fill="#18181b" stroke={Colors.coltsBlue} strokeWidth="2"/>
          </react_native_svg_1.default>
        </react_native_1.View>
      </react_native_1.View>);
    };
    // SVG Chart: Donut Target Position Allocation
    const renderDonutChart = () => {
        return (<react_native_1.View style={styles.chartPanelCard}>
        <react_native_1.View style={styles.panelHeader}>
          <react_native_1.View>
            <react_native_1.Text style={styles.panelTitle}>POSITION TARGET ALLOCATION</react_native_1.Text>
            <react_native_1.Text style={styles.panelSubtitle}>Standard roster slot construction targets</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.donutChartContainer}>
          <react_native_1.View style={styles.donutWrapper}>
            <react_native_svg_1.default width={120} height={120} viewBox="0 0 120 120">
              <react_native_svg_1.Circle cx="60" cy="60" r="45" stroke="#1f2937" strokeWidth="12" fill="none"/>
              
              {/* WR: 40% (circumference = 282.74, 40% = 113.1) */}
              <react_native_svg_1.Circle cx="60" cy="60" r="45" stroke={Colors.positions.WR} strokeWidth="12" strokeDasharray="113.1 282.7" strokeDashoffset="0" strokeLinecap="round" fill="none" transform="rotate(-90 60 60)"/>

              {/* RB: 26.7% (26.7% = 75.4) */}
              <react_native_svg_1.Circle cx="60" cy="60" r="45" stroke={Colors.positions.RB} strokeWidth="12" strokeDasharray="75.4 282.7" strokeDashoffset="-113.1" strokeLinecap="round" fill="none" transform="rotate(-90 60 60)"/>

              {/* QB: 13.3% (13.3% = 37.7) */}
              <react_native_svg_1.Circle cx="60" cy="60" r="45" stroke={Colors.positions.QB} strokeWidth="12" strokeDasharray="37.7 282.7" strokeDashoffset="-188.5" strokeLinecap="round" fill="none" transform="rotate(-90 60 60)"/>

              {/* TE: 13.3% (13.3% = 37.7) */}
              <react_native_svg_1.Circle cx="60" cy="60" r="45" stroke={Colors.positions.TE} strokeWidth="12" strokeDasharray="37.7 282.7" strokeDashoffset="-226.2" strokeLinecap="round" fill="none" transform="rotate(-90 60 60)"/>

              {/* FLEX: 6.7% (6.7% = 18.8) */}
              <react_native_svg_1.Circle cx="60" cy="60" r="45" stroke="#c084fc" strokeWidth="12" strokeDasharray="18.8 282.7" strokeDashoffset="-263.9" strokeLinecap="round" fill="none" transform="rotate(-90 60 60)"/>
            </react_native_svg_1.default>
            
            <react_native_1.View style={styles.donutCenterContent}>
              <react_native_1.Text style={styles.donutCenterValue}>15</react_native_1.Text>
              <react_native_1.Text style={styles.donutCenterLabel}>ROUNDS</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>

          <react_native_1.View style={styles.donutLegendContainer}>
            <react_native_1.View style={styles.legendItem}>
              <react_native_1.View style={[styles.legendDot, { backgroundColor: Colors.positions.WR }]}/>
              <react_native_1.Text style={styles.legendName}>Wide Receiver</react_native_1.Text>
              <react_native_1.Text style={styles.legendVal}>40.0%</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.legendItem}>
              <react_native_1.View style={[styles.legendDot, { backgroundColor: Colors.positions.RB }]}/>
              <react_native_1.Text style={styles.legendName}>Running Back</react_native_1.Text>
              <react_native_1.Text style={styles.legendVal}>26.7%</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.legendItem}>
              <react_native_1.View style={[styles.legendDot, { backgroundColor: Colors.positions.QB }]}/>
              <react_native_1.Text style={styles.legendName}>Quarterback</react_native_1.Text>
              <react_native_1.Text style={styles.legendVal}>13.3%</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.legendItem}>
              <react_native_1.View style={[styles.legendDot, { backgroundColor: Colors.positions.TE }]}/>
              <react_native_1.Text style={styles.legendName}>Tight End</react_native_1.Text>
              <react_native_1.Text style={styles.legendVal}>13.3%</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.legendItem}>
              <react_native_1.View style={[styles.legendDot, { backgroundColor: '#c084fc' }]}/>
              <react_native_1.Text style={styles.legendName}>Flex Spot</react_native_1.Text>
              <react_native_1.Text style={styles.legendVal}>6.7%</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>);
    };
    // Metrics Summary Strip
    const renderMetricsStrip = () => {
        return (<react_native_1.View style={styles.metricsStrip}>
        <react_native_1.View style={styles.metricCard}>
          <react_native_1.View style={styles.metricHeader}>
            <react_native_1.Text style={styles.metricLabel}>DRAFTS RUN</react_native_1.Text>
            <react_native_1.View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
              <react_native_1.Text style={[styles.trendText, { color: '#22C55E' }]}>+18.2% ▲</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.Text style={styles.metricValue}>{completedDraftsCount}</react_native_1.Text>
          <react_native_1.Text style={styles.metricComparison}>vs last week baseline</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.metricCard}>
          <react_native_1.View style={styles.metricHeader}>
            <react_native_1.Text style={styles.metricLabel}>AVG DRAFT GRADE</react_native_1.Text>
            <react_native_1.View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
              <react_native_1.Text style={[styles.trendText, { color: '#22C55E' }]}>+1.5% ▲</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.Text style={[styles.metricValue, { color: Colors.hofYellow }]}>{avgDraftGrade}</react_native_1.Text>
          <react_native_1.Text style={styles.metricComparison}>Mean score: {avgDraftScore}%</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.metricCard}>
          <react_native_1.View style={styles.metricHeader}>
            <react_native_1.Text style={styles.metricLabel}>CHEAT SHEETS</react_native_1.Text>
            <react_native_1.View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
              <react_native_1.Text style={[styles.trendText, { color: '#22C55E' }]}>+25.0% ▲</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.Text style={[styles.metricValue, { color: '#60a5fa' }]}>{activeSheetsCount}</react_native_1.Text>
          <react_native_1.Text style={styles.metricComparison}>Custom board lists</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.metricCard}>
          <react_native_1.View style={styles.metricHeader}>
            <react_native_1.Text style={styles.metricLabel}>SWARM SIMULATIONS</react_native_1.Text>
            <react_native_1.View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
              <react_native_1.Text style={[styles.trendText, { color: '#22C55E' }]}>+12.4% ▲</react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>
          <react_native_1.Text style={styles.metricValue}>{formatNumber(totalSimsCount)}</react_native_1.Text>
          <react_native_1.Text style={styles.metricComparison}>Live genetic iterations</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    };
    // Evolved Bots Roster (Tab 1: Overview)
    const renderBotRoster = () => {
        return (<react_native_1.View style={styles.botRosterGrid}>
        {botsList.map((bot) => {
                const record = getBotRecord(bot.name);
                const winRateStr = calculateBotWinRate(record.wins, record.losses);
                return (<react_native_1.View key={bot.name} style={styles.botRosterCard}>
              <react_native_1.View style={styles.botRosterHeader}>
                <react_native_1.View style={styles.botRosterLeftInfo}>
                  <react_native_1.Text style={styles.botRosterName}>SwarmBot {bot.name}</react_native_1.Text>
                  <react_native_1.View style={[styles.botRosterTag, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: bot.color, borderWidth: 0.5 }]}>
                    <react_native_1.Text style={[styles.botRosterTagText, { color: bot.color }]}>{bot.strategy}</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>
                <react_native_1.Text style={[styles.botRosterWinRate, { color: Colors.hofYellow }]}>{winRateStr} WR</react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={styles.botRosterAccuracyRow}>
                <react_native_1.Text style={styles.botRosterAccuracyLabel}>Swarm Learning Accuracy</react_native_1.Text>
                <react_native_1.Text style={styles.botRosterAccuracyVal}>{(bot.accuracy * 100).toFixed(0)}%</react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={styles.botRosterProgressTrack}>
                <react_native_1.View style={[styles.botRosterProgressFill, { width: `${bot.accuracy * 100}%`, backgroundColor: bot.color }]}/>
              </react_native_1.View>

              <react_native_1.Text style={styles.botRosterRecordLabel}>Cohort Record: {record.wins}W — {record.losses}L</react_native_1.Text>
            </react_native_1.View>);
            })}
      </react_native_1.View>);
    };
    // Cohort Standings Table (Tab 2: Swarm Training)
    const renderCohortTable = () => {
        return (<react_native_1.View style={styles.cohortTableContainer}>
        <react_native_1.View style={styles.cohortTableHeader}>
          <react_native_1.Text style={[styles.cohortTableHeadCell, { flex: 1 }]}>BOT PROFILE</react_native_1.Text>
          <react_native_1.Text style={[styles.cohortTableHeadCell, { flex: 1 }]}>STRATEGY CAMP</react_native_1.Text>
          <react_native_1.Text style={[styles.cohortTableHeadCell, { width: 90, textAlign: 'right' }]}>RECORD</react_native_1.Text>
          <react_native_1.Text style={[styles.cohortTableHeadCell, { width: 90, textAlign: 'right' }]}>WIN RATE %</react_native_1.Text>
        </react_native_1.View>

        {botsList.map((bot, index) => {
                const record = getBotRecord(bot.name);
                const winRate = calculateBotWinRate(record.wins, record.losses);
                return (<react_native_1.View key={bot.name} style={[styles.cohortTableRow, index % 2 === 1 && { backgroundColor: 'rgba(255,255,255,0.01)' }]}>
              <react_native_1.View style={[styles.cohortTableCell, { flex: 1 }]}>
                <react_native_1.Text style={styles.cohortTableTextBold}>{bot.name}</react_native_1.Text>
                <react_native_1.Text style={styles.cohortTableTextSub}>Base: {bot.expert}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={[styles.cohortTableCell, { flex: 1 }]}>
                <react_native_1.View style={[styles.strategyBadgeCompact, { borderColor: bot.color }]}>
                  <react_native_1.Text style={[styles.strategyBadgeText, { color: bot.color }]}>{bot.strategy}</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
              <react_native_1.View style={[styles.cohortTableCell, { width: 90, alignItems: 'flex-end' }]}>
                <react_native_1.Text style={styles.cohortTableText}>{record.wins} — {record.losses}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={[styles.cohortTableCell, { width: 90, alignItems: 'flex-end' }]}>
                <react_native_1.Text style={[styles.cohortTableTextBold, { color: Colors.hofYellow }]}>{winRate}</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>);
            })}
      </react_native_1.View>);
    };
    // Mutated Param Weight Matrix (Tab 2: Swarm Training)
    const renderMutationMatrix = () => {
        // Dynamically pull or static fallback mutations
        const mutations = [
            { param: 'ADP Arbitrage Capture Bias', weight: '+0.28', status: 'Stable mutation' },
            { param: 'Hero RB Camp Affinity Coeff', weight: '+0.15', status: 'Evolving dynamic' },
            { param: 'Consensus ECR Consensus Weight', weight: '+0.06', status: 'Evolving dynamic' },
            { param: 'Zero RB Roster Slot Preference', weight: '-0.11', status: 'Stable mutation' },
            { param: 'TE Premium Draft Bias', weight: '+0.18', status: 'High variance' },
            { param: 'Flex Configuration Rarity Weight', weight: '-0.04', status: 'Stable mutation' },
        ];
        return (<react_native_1.View style={styles.mutationMatrixGrid}>
        {mutations.map((m) => (<react_native_1.View key={m.param} style={styles.mutationMatrixCard}>
            <react_native_1.View style={styles.mutationMatrixHeader}>
              <react_native_1.Text style={styles.mutationMatrixLabel} numberOfLines={1}>{m.param}</react_native_1.Text>
              <react_native_1.View style={[styles.mutationMatrixBadge, { backgroundColor: m.weight.startsWith('-') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)' }]}>
                <react_native_1.Text style={[styles.mutationMatrixBadgeText, { color: m.weight.startsWith('-') ? '#EF4444' : '#22C55E' }]}>
                  {m.weight}
                </react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.Text style={styles.mutationMatrixStatus}>{m.status}</react_native_1.Text>
          </react_native_1.View>))}
      </react_native_1.View>);
    };
    // Live Swarm Telemetry Logs Console (Tab 3: Arbitrage Feed)
    const renderTerminalConsole = () => {
        return (<react_native_1.View style={styles.terminalConsoleContainer}>
        <react_native_1.View style={styles.terminalConsoleHeader}>
          <react_native_1.View style={styles.terminalConsoleHeaderLeft}>
            <react_native_1.View style={[styles.syncDot, { backgroundColor: liveSimRunning ? '#22C55E' : '#94a3b8' }]}/>
            <react_native_1.Text style={styles.terminalConsoleTitle}>SWARM_BOT_TRAINING_STREAM</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.Text style={styles.terminalConsoleFormat}>PRO_TELEMETRY</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.ScrollView ref={terminalScrollRef} style={styles.terminalConsoleBody} contentContainerStyle={{ padding: 12, gap: 4 }} onContentSizeChange={() => {
                if (terminalScrollRef.current) {
                    terminalScrollRef.current.scrollToEnd({ animated: true });
                }
            }}>
          {terminalLogs.map((log, index) => (<react_native_1.Text key={index} style={styles.terminalConsoleLogLine}>
              {log}
            </react_native_1.Text>))}
        </react_native_1.ScrollView>
      </react_native_1.View>);
    };
    // NFL Crawler News Feed (Tab 3: Arbitrage Feed)
    const renderNewsCrawler = () => {
        // Hydrate news stories from store news list, or static fallbacks
        const activeNews = (news && news.length > 0) ? news.slice(0, 4) : [
            { id: '1', title: 'Christian McCaffrey expects full workload inside training setup', category: 'Injury Watch', excerpt: 'San Francisco running back declares 100% health targets, stabilizing standard draft tier 1 placements.' },
            { id: '2', title: 'Marvin Harrison Jr. dominates early targets in cohort practices', category: 'Rookie Alert', excerpt: 'Consensus index rankings adjust significantly as Harrison locks high-volume role outlines.' },
            { id: '3', title: 'Roster depth: Drake London climbs consensus draft tier boards', category: 'Value Jumper', excerpt: 'Arbitrage capture models identify London as a premium consensus target pick inside round 3 boundaries.' },
        ];
        return (<react_native_1.View style={styles.newsCrawlerContainer}>
        {activeNews.map((item) => (<react_native_1.View key={item.id} style={styles.newsCrawlerCard}>
            <react_native_1.View style={styles.newsCrawlerCardHeader}>
              <react_native_1.View style={styles.newsCrawlerCategoryBadge}>
                <react_native_1.Text style={styles.newsCrawlerCategoryText}>{item.category || 'NEWS UPDATE'}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Text style={styles.newsCrawlerDateText}>LIVE CRAWLER</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.Text style={styles.newsCrawlerTitle}>{item.title}</react_native_1.Text>
            <react_native_1.Text style={styles.newsCrawlerExcerpt} numberOfLines={2}>
              {item.excerpt || item.content || 'No detailed analyst report hydration available currently.'}
            </react_native_1.Text>
          </react_native_1.View>))}
      </react_native_1.View>);
    };
    // Modular Grid Card Actions (Primary directives)
    const renderActionsGrid = () => {
        return (<react_native_1.View style={styles.featureGrid}>
        
        {/* AI Draft Sandbox */}
        <react_native_1.Pressable onPressIn={() => handlePressIn(scaleSandbox)} onPressOut={() => handlePressOut(scaleSandbox)} onPress={() => { triggerHaptic(); router.push('/wizard/setup'); }} style={styles.featureCardPressable}>
          <react_native_1.Animated.View style={[styles.featureCard, { transform: [{ scale: scaleSandbox }] }, { borderColor: Colors.glassBorderGold }]}>
            <react_native_1.View style={styles.cardIndicatorDotGold}/>
            <react_native_1.View style={styles.featureCardLeft}>
              <react_native_1.View style={[styles.featureIconCircle, { borderColor: 'rgba(255, 224, 102, 0.25)' }]}>
                <react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12V9H17C17 7.9 16.1 7 15 7H13.82C13.4 5.27 11.85 4 10 4C7.79 4 6 5.79 6 8V12H4V12.01C4 16.1 7.12 19.46 11.1 19.95C10.4 18.73 10 17.28 10 15.68V14H12V15.68C12 17.65 12.75 19.44 14 20.73V22C14.55 22 15 21.55 15 21V20.1C18.9 19.16 21.8 15.86 21.98 12H22V12C22 6.48 17.52 2 12 2Z" fill={Colors.hofYellow}/>
                </react_native_svg_1.default>
              </react_native_1.View>
              <react_native_1.View style={styles.featureTextContainer}>
                <react_native_1.Text style={styles.featureTitle}>AI DRAFT SANDBOX</react_native_1.Text>
                <react_native_1.Text style={styles.featureSubtitle}>Draft against 11 evolved bot profiles with custom constraints.</react_native_1.Text>
                <react_native_1.View style={styles.cardCtaContainer}>
                  <react_native_1.Text style={styles.cardCtaText}>Start Draft</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.arrowChevron}>
              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke={Colors.primaryAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.Pressable>

        {/* Consensus Board */}
        <react_native_1.Pressable onPressIn={() => handlePressIn(scaleConsensus)} onPressOut={() => handlePressOut(scaleConsensus)} onPress={() => { triggerHaptic(); router.push('/rankings'); }} style={styles.featureCardPressable}>
          <react_native_1.Animated.View style={[styles.featureCard, { transform: [{ scale: scaleConsensus }] }]}>
            <react_native_1.View style={styles.featureCardLeft}>
              <react_native_1.View style={styles.featureIconCircle}>
                <react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M5 19h14v2H5v-2zm10-4h4v2h-4v-2zm-5-5h4v7h-4v-7zM5 5h4v12H5V5z" fill={Colors.primaryAccent}/>
                </react_native_svg_1.default>
              </react_native_1.View>
              <react_native_1.View style={styles.featureTextContainer}>
                <react_native_1.Text style={styles.featureTitle}>CONSENSUS BOARD</react_native_1.Text>
                <react_native_1.Text style={styles.featureSubtitle}>Review player rankings, expert recommendations, and ADP indexes.</react_native_1.Text>
                <react_native_1.View style={styles.cardCtaContainer}>
                  <react_native_1.Text style={styles.cardCtaText}>Draft Player</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.arrowChevron}>
              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke={Colors.primaryAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.Pressable>

        {/* Cheat Sheets Creator */}
        <react_native_1.Pressable onPressIn={() => handlePressIn(scaleCheatSheet)} onPressOut={() => handlePressOut(scaleCheatSheet)} onPress={() => { triggerHaptic(); router.push('/rankings'); }} style={styles.featureCardPressable}>
          <react_native_1.Animated.View style={[styles.featureCard, { transform: [{ scale: scaleCheatSheet }] }]}>
            <react_native_1.View style={styles.featureCardLeft}>
              <react_native_1.View style={styles.featureIconCircle}>
                <react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill={Colors.primaryAccent}/>
                </react_native_svg_1.default>
              </react_native_1.View>
              <react_native_1.View style={styles.featureTextContainer}>
                <react_native_1.Text style={styles.featureTitle}>CHEAT SHEET CREATOR</react_native_1.Text>
                <react_native_1.Text style={styles.featureSubtitle}>Compile custom rankings, import CSV files, and sort positional tiers.</react_native_1.Text>
                <react_native_1.View style={styles.cardCtaContainer}>
                  <react_native_1.Text style={styles.cardCtaText}>Queue Player</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.arrowChevron}>
              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke={Colors.primaryAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.Pressable>

        {/* Top 250 experience (matches rankings but routes to top250) */}
        <react_native_1.Pressable onPressIn={() => handlePressIn(scaleTop250)} onPressOut={() => handlePressOut(scaleTop250)} onPress={() => { triggerHaptic(); router.push('/rankings'); }} style={styles.featureCardPressable}>
          <react_native_1.Animated.View style={[styles.featureCard, { transform: [{ scale: scaleTop250 }] }]}>
            <react_native_1.View style={styles.featureCardLeft}>
              <react_native_1.View style={[styles.featureIconCircle, { borderColor: 'rgba(96, 165, 250, 0.25)' }]}>
                <react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="#60a5fa"/>
                </react_native_svg_1.default>
              </react_native_1.View>
              <react_native_1.View style={styles.featureTextContainer}>
                <react_native_1.Text style={styles.featureTitle}>TOP 250 CHEAT SHEET</react_native_1.Text>
                <react_native_1.Text style={styles.featureSubtitle}>Compile alternative custom rankings, consensus boards, and players.</react_native_1.Text>
                <react_native_1.View style={styles.cardCtaContainer}>
                  <react_native_1.Text style={styles.cardCtaText}>Draft Player</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.arrowChevron}>
              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke={Colors.primaryAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.Pressable>

        {/* Bot Swarm Standings */}
        <react_native_1.Pressable onPressIn={() => handlePressIn(scaleSwarm)} onPressOut={() => handlePressOut(scaleSwarm)} onPress={() => { triggerHaptic(); router.push('/leaderboard'); }} style={styles.featureCardPressable}>
          <react_native_1.Animated.View style={[styles.featureCard, { transform: [{ scale: scaleSwarm }] }]}>
            <react_native_1.View style={styles.featureCardLeft}>
              <react_native_1.View style={styles.featureIconCircle}>
                <react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.2 1.8 4 4 4h2.2c.8 1.9 2.5 3.2 4.8 3.4V20H9v2h6v-2h-3v-2.6c2.3-.2 4-1.5 4.8-3.4H19c2.2 0 4-1.8 4-4V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 1.1-.9 2-2 2zm14 0c-1.1 0-2-.9-2-2V7h2v3zm-7 4c-1.7 0-3-1.3-3-3V5h6v6c0 1.7-1.3 3-3 3z" fill={Colors.hofYellow}/>
                </react_native_svg_1.default>
              </react_native_1.View>
              <react_native_1.View style={styles.featureTextContainer}>
                <react_native_1.Text style={styles.featureTitle}>BOT SWARM STANDINGS</react_native_1.Text>
                <react_native_1.Text style={styles.featureSubtitle}>Assert simulated bot win rates, evolved param weights, and slot gains.</react_native_1.Text>
                <react_native_1.View style={styles.cardCtaContainer}>
                  <react_native_1.Text style={styles.cardCtaText}>View Standings</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.arrowChevron}>
              <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke={Colors.primaryAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
              </react_native_svg_1.default>
            </react_native_1.View>
          </react_native_1.Animated.View>
        </react_native_1.Pressable>

        {/* NFL News Feed */}
        {showNewsOnHomepage && (<react_native_1.Pressable onPressIn={() => handlePressIn(scaleNews)} onPressOut={() => handlePressOut(scaleNews)} onPress={() => { triggerHaptic(); router.push('/news'); }} style={styles.featureCardPressable}>
            <react_native_1.Animated.View style={[styles.featureCard, { transform: [{ scale: scaleNews }] }]}>
              <react_native_1.View style={styles.featureCardLeft}>
                <react_native_1.View style={styles.featureIconCircle}>
                  <react_native_svg_1.default width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" fill={Colors.primaryAccent}/>
                  </react_native_svg_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.featureTextContainer}>
                  <react_native_1.Text style={styles.featureTitle}>NFL NEWS FEED</react_native_1.Text>
                  <react_native_1.Text style={styles.featureSubtitle}>Track dynamic injury tickers, roster updates, and expert chatter.</react_native_1.Text>
                  <react_native_1.View style={styles.cardCtaContainer}>
                    <react_native_1.Text style={styles.cardCtaText}>Accept Trade</react_native_1.Text>
                  </react_native_1.View>
                </react_native_1.View>
              </react_native_1.View>
              <react_native_1.View style={styles.arrowChevron}>
                <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke={Colors.primaryAccent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
                </react_native_svg_1.default>
              </react_native_1.View>
            </react_native_1.Animated.View>
          </react_native_1.Pressable>)}

      </react_native_1.View>);
    };
    // Left Sidebar column layout (Web/Desktop)
    const renderSidebar = () => {
        return (<react_native_1.View style={styles.sidebarColumn}>
        <react_native_1.View style={styles.sidebarBrand}>
          <react_native_svg_1.default width={26} height={26} viewBox="-3 -3 30 30" fill="none" style={{ overflow: 'visible' }}>
            <react_native_svg_1.G rotation={-30} originX={12} originY={12}>
              <react_native_svg_1.Path d="M 2 12 C 6 5, 18 5, 22 12 C 18 19, 6 19, 2 12 Z" stroke={Colors.hofYellow} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              <react_native_svg_1.Path d="M 7 12 H 17" stroke={Colors.hofYellow} strokeWidth={1.5} strokeLinecap="round"/>
              <react_native_svg_1.Path d="M 9.5 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
              <react_native_svg_1.Path d="M 12 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
              <react_native_svg_1.Path d="M 14.5 9.5 V 14.5" stroke={Colors.hofYellow} strokeWidth={1.2} strokeLinecap="round"/>
            </react_native_svg_1.G>
          </react_native_svg_1.default>
          <react_native_1.Text style={styles.brandText}>
            MOCK<react_native_1.Text style={styles.cursiveGoldTextBrand}>Maxxing</react_native_1.Text>
          </react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.sidebarSectionTitle}>NAVIGATE</react_native_1.View>
        
        <react_native_1.View style={styles.sidebarLinksContainer}>
          <react_native_1.Pressable style={[styles.sidebarLink, styles.sidebarLinkActive]}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>🏈</react_native_1.Text>
            <react_native_1.Text style={[styles.sidebarLinkText, styles.sidebarLinkTextActive]}>Overview Dashboard</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); router.push('/wizard/setup'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>⚡</react_native_1.Text>
            <react_native_1.Text style={styles.sidebarLinkText}>Mock Draft Sandbox</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); router.push('/rankings'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>📊</react_native_1.Text>
            <react_native_1.Text style={styles.sidebarLinkText}>Consensus Board</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); router.push('/rankings'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>📝</react_native_1.Text>
            <react_native_1.Text style={styles.sidebarLinkText}>Cheat Sheets</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); router.push('/leaderboard'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>🧠</react_native_1.Text>
            <react_native_1.Text style={styles.sidebarLinkText}>Bot Leaderboard</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); router.push('/news'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>📰</react_native_1.Text>
            <react_native_1.Text style={styles.sidebarLinkText}>NFL News Feed</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.View style={styles.sidebarSectionTitle}>SYSTEMS</react_native_1.View>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); router.push('/qa-simulation'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>🧪</react_native_1.Text>
            <react_native_1.Text style={[styles.sidebarLinkText, { color: Colors.hofYellow, fontWeight: 'bold' }]}>Telemetry Lab</react_native_1.Text>
          </react_native_1.Pressable>

          <react_native_1.Pressable style={styles.sidebarLink} onPress={() => { triggerHaptic(); alert('Configuration assert bounds: 100% z-index safety.'); }}>
            <react_native_1.Text style={styles.sidebarLinkEmoji}>⚙️</react_native_1.Text>
            <react_native_1.Text style={styles.sidebarLinkText}>Settings</react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_1.View>

        <react_native_1.View style={styles.sidebarCoachCard}>
          <react_native_1.View style={styles.coachAvatarCircle}>
            <react_native_1.Text style={styles.coachAvatarText}>
              {(user?.name || user?.email || 'C').charAt(0).toUpperCase()}
            </react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.coachCardInfo}>
            <react_native_1.Text style={styles.coachCardName} numberOfLines={1}>{user?.name || '@Drafter'}</react_native_1.Text>
            <react_native_1.Text style={styles.coachCardFormat}>PRO ANALYST</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.Pressable style={styles.logoutBtnIcon} onPress={() => { triggerHaptic(); logout(); }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <react_native_svg_1.default width={16} height={16} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="#ef4444"/>
            </react_native_svg_1.default>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>);
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (<>
            {/* Dynamic metrics strip */}
            {renderMetricsStrip()}

            {/* Charts Row */}
            <react_native_1.View style={[styles.chartsGridRow, isDesktop && { flexDirection: 'row' }]}>
              {renderLineChart()}
              {renderDonutChart()}
            </react_native_1.View>

            {/* Active Bots Roster */}
            <react_native_1.View style={styles.gridSection}>
              <react_native_1.Text style={styles.sectionHeaderTitle}>LIVE SWARM ACTIVE BOT PROFILES</react_native_1.Text>
              {renderBotRoster()}
            </react_native_1.View>

            {/* Main Action Directives Grid */}
            <react_native_1.View style={styles.gridSection}>
              <react_native_1.Text style={styles.sectionHeaderTitle}>DRAFT ENGINE DIRECTIVES</react_native_1.Text>
              {renderActionsGrid()}
            </react_native_1.View>
          </>);
            case 'swarm':
                return (<>
            {/* Live evolution settings panel */}
            <react_native_1.View style={styles.swarmControlCard}>
              <react_native_1.View style={styles.swarmControlLeft}>
                <react_native_1.Text style={styles.swarmControlTitle}>EVOLVED COHORT STANDINGS</react_native_1.Text>
                <react_native_1.Text style={styles.swarmControlSubtitle}>
                  Win-rate indexes and parameter mutations calculated across {formatNumber(totalSimsCount)} genetic cohorts
                </react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Pressable style={({ pressed }) => [
                        styles.swarmLoopBtn,
                        liveSimRunning && styles.swarmLoopBtnActive,
                        pressed && { transform: [{ scale: 0.96 }] }
                    ]} onPress={() => {
                        triggerHaptic();
                        if (liveSimRunning) {
                            stopLiveSimulationLoop();
                        }
                        else {
                            startLiveSimulationLoop();
                        }
                    }}>
                <react_native_1.View style={styles.btnRowContent}>
                  <react_native_1.View style={[styles.livePulseDot, liveSimRunning ? { backgroundColor: '#22C55E' } : { backgroundColor: '#EF4444' }]}/>
                  <react_native_1.Text style={styles.swarmLoopBtnText}>
                    {liveSimRunning ? 'PAUSE LIVE EVOLUTION' : 'ACTIVATE EVOLUTION LOOP'}
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.Pressable>
            </react_native_1.View>

            {/* Standings Cohort Leaderboard */}
            <react_native_1.View style={styles.gridSection}>
              <react_native_1.Text style={styles.sectionHeaderTitle}>COHORT STANDINGS LEADERBOARD</react_native_1.Text>
              {renderCohortTable()}
            </react_native_1.View>

            {/* Parameter mutations grid */}
            <react_native_1.View style={styles.gridSection}>
              <react_native_1.Text style={styles.sectionHeaderTitle}>MUTATION WEIGHT MATRIX</react_native_1.Text>
              {renderMutationMatrix()}
            </react_native_1.View>
          </>);
            case 'feed':
                return (<>
            {/* Live scrollable log terminal */}
            <react_native_1.View style={styles.gridSection}>
              <react_native_1.Text style={styles.sectionHeaderTitle}>SWARM TELEMETRY CONSOLE</react_native_1.Text>
              {renderTerminalConsole()}
            </react_native_1.View>

            {/* Live news crawler feed */}
            <react_native_1.View style={styles.gridSection}>
              <react_native_1.Text style={styles.sectionHeaderTitle}>NFL CRAWLER NEWS FEED</react_native_1.Text>
              {renderNewsCrawler()}
            </react_native_1.View>
          </>);
            default:
                return null;
        }
    };
    const renderCoachingInsights = () => {
        return (<react_native_1.View style={styles.playCardWrapper}>
        {apiError && (<react_native_1.View style={styles.errorBanner}>
            <react_native_1.Text style={styles.errorText}>⚠️ ElevenLabs API Error: {apiError}. (Check browser console / extensions)</react_native_1.Text>
          </react_native_1.View>)}
        
        <react_native_1.View style={styles.playCard}>
          <react_native_1.View style={styles.playCardLeft}>
            <react_native_1.Pressable style={({ pressed }) => [
                styles.iconCircle,
                (isSpeaking || isLoadingAudio) && styles.iconCircleSpeaking,
                pressed && { opacity: 0.7 }
            ]} onPress={() => {
                triggerHaptic();
                handlePlayQuote();
            }}>
              {isSpeaking || isLoadingAudio ? (<react_native_1.View style={styles.speakingWave}>
                  <react_native_1.Animated.View style={[styles.waveBar, { transform: [{ scaleY: waveScale1 }] }]}/>
                  <react_native_1.Animated.View style={[styles.waveBar, { transform: [{ scaleY: waveScale2 }] }]}/>
                  <react_native_1.Animated.View style={[styles.waveBar, { transform: [{ scaleY: waveScale3 }] }]}/>
                </react_native_1.View>) : (<react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <react_native_svg_1.Path d="M8 5V19L19 12L8 5Z" fill="#ffffff"/>
                </react_native_svg_1.default>)}
            </react_native_1.Pressable>
            
            <react_native_1.Pressable style={({ pressed }) => [
                styles.playCardText,
                pressed && { opacity: 0.85 }
            ]} onPress={() => {
                triggerHaptic();
                handleNextQuote();
            }}>
              <react_native_1.View style={styles.badgeRow}>
                {isLoadingAudio && (<react_native_1.View style={[styles.liveIndicator, { borderColor: Colors.hofYellow }]}>
                    <react_native_1.View style={[styles.livePulse, { backgroundColor: Colors.hofYellow }]}/>
                    <react_native_1.Text style={[styles.liveText, { color: Colors.hofYellow }]}>GENERATING...</react_native_1.Text>
                  </react_native_1.View>)}
                {isSpeaking && (<react_native_1.View style={styles.liveIndicator}>
                    <react_native_1.View style={styles.livePulse}/>
                    <react_native_1.Text style={styles.liveText}>SPEAKING</react_native_1.Text>
                  </react_native_1.View>)}
              </react_native_1.View>
              <react_native_1.Text style={[styles.playCardTitle, { color: '#ffffff' }]}>COACHING INSIGHTS</react_native_1.Text>
              <react_native_1.Text style={styles.playCardSubtitle} numberOfLines={2} ellipsizeMode="tail">
                "{quotes_1.INTERSPERSED_QUOTES[currentQuoteIndex].text}"
              </react_native_1.Text>
              <react_native_1.Text style={styles.attributionText}>
                — {quotes_1.INTERSPERSED_QUOTES[currentQuoteIndex].author}
              </react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
          
          <react_native_1.Pressable style={({ pressed }) => [
                styles.arrowChevronCircle,
                pressed && { opacity: 0.6 }
            ]} onPress={() => {
                triggerHaptic();
                router.push('/settings');
            }}>
            <react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none">
              <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#ffffff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/>
            </react_native_svg_1.default>
          </react_native_1.Pressable>
        </react_native_1.View>
      </react_native_1.View>);
    };
    const renderFloatingActionButton = () => {
        return (<react_native_1.Animated.View style={[
                styles.fabWrapper,
                { transform: [{ scale: fabScale }] }
            ]}>
        <react_native_1.Pressable style={({ pressed }) => [
                styles.fabButton,
                pressed && styles.fabButtonPressed
            ]} onPressIn={handleFabPressIn} onPressOut={handleFabPressOut} onPress={handleFabPress} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <react_native_1.Text style={styles.fabText}>DRAFT NOW</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.Animated.View>);
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      {/* Background SVG Ambient Glows */}
      <react_native_1.View style={styles.ambientGlowContainer} pointerEvents="none">
        <react_native_svg_1.default width="100%" height="100%" style={react_native_1.StyleSheet.absoluteFill}>
          <react_native_svg_1.Defs>
            <react_native_svg_1.RadialGradient id="coltsBlueGlow" cx="15%" cy="30%" rx="35%" ry="35%" fx="15%" fy="30%">
              <react_native_svg_1.Stop offset="0%" stopColor={Colors.coltsBlueGlow}/>
              <react_native_svg_1.Stop offset="100%" stopColor="rgba(248, 250, 252, 0)"/>
            </react_native_svg_1.RadialGradient>
            <react_native_svg_1.RadialGradient id="doordashRedGlow" cx="85%" cy="70%" rx="40%" ry="40%" fx="85%" fy="70%">
              <react_native_svg_1.Stop offset="0%" stopColor={Colors.doordashRedGlow}/>
              <react_native_svg_1.Stop offset="100%" stopColor="rgba(248, 250, 252, 0)"/>
            </react_native_svg_1.RadialGradient>
          </react_native_svg_1.Defs>
          <react_native_svg_1.Circle cx="15%" cy="30%" r="45%" fill="url(#coltsBlueGlow)"/>
          <react_native_svg_1.Circle cx="85%" cy="70%" r="50%" fill="url(#doordashRedGlow)"/>
        </react_native_svg_1.default>
      </react_native_1.View>
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Horizontal responsive desktop split layout wrapper */}
        <react_native_1.View style={styles.mainSplitWrapper}>
          
          {/* Render left column navigation sidebar on large screens */}
          {isDesktop && renderSidebar()}

          {/* Right main workspace layout */}
          <react_native_1.View style={styles.rightWorkspace}>
            
            {isDesktop ? (<>
                {/* Header Area */}
                <react_native_1.View style={styles.workspaceHeader}>
                  <react_native_1.View style={styles.headerTitleArea}>
                    <react_native_1.Text style={styles.headerTitle}>COACH OVERVIEW DASHBOARD</react_native_1.Text>
                    <react_native_1.Text style={styles.headerSubtitle}>Real-time evolved bot profiles, analytics, and custom cheat sheets</react_native_1.Text>
                  </react_native_1.View>
                  
                  <react_native_1.View style={styles.headerRightActions}>
                    <react_native_1.View style={styles.syncBadge}>
                      <react_native_1.View style={styles.syncDot}/>
                      <react_native_1.Text style={styles.syncText}>SYNC ACTIVE</react_native_1.Text>
                    </react_native_1.View>

                    {/* Primary mock draft button hidden per CEO instruction
            <Pressable
              style={({ pressed }) => [
                styles.primaryRunBtn,
                pressed && styles.btnPressed
              ]}
              onPress={() => { triggerHaptic(); router.push('/wizard/setup'); }}
            >
              <Text style={styles.primaryRunBtnText}>MOCK DRAFT NOW 🏈</Text>
            </Pressable>
            */}
                  </react_native_1.View>
                </react_native_1.View>

                {/* Scrollable Workspace content viewports */}
                <react_native_1.ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                  {/* Starbucks-Style Uniform Card Feed */}
                  {renderCardFeed()}
                </react_native_1.ScrollView>
              </>) : (
        // Mobile layout with premium scroll layout!
        <react_native_1.View style={{ flex: 1 }}>
                <react_native_1.ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContentMobile} showsVerticalScrollIndicator={false}>
                  {/* AppHeader + Greeting Banner */}
                  <react_native_1.View style={styles.mobileHeaderGroup}>
                    <AppHeader_1.default isLanding={true}/>
                    
                    {/* Starbucks-style personalized greeting banner */}
                    <react_native_1.View style={styles.mobileGreetingBanner}>
                      <react_native_1.Text style={styles.greetingMainText}>
                        <react_native_1.Text style={styles.greetingCoachName}>{(user?.firstName || 'COACH').toUpperCase()}</react_native_1.Text>, LET'S COOK.
                      </react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>

                  {/* Starbucks-Style Uniform Card Feed */}
                  {renderCardFeed()}
                </react_native_1.ScrollView>

                {/* Floating Action Button (FAB) bottom-right, floating above AppTabBar */}
                {/* Mobile DRAFT NOW button hidden per CEO instruction
            {renderFloatingActionButton()}
            */}
              </react_native_1.View>)}
          </react_native_1.View>
        </react_native_1.View>
      </react_native_safe_area_context_1.SafeAreaView>
      
      {/* Absolute persistent mobile tab navigation */}
      {!isDesktop && <AppTabBar_1.default />}
    </react_native_1.View>);
}
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
        },
        ambientGlowContainer: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            zIndex: -1,
            overflow: 'hidden',
        },
        safeArea: {
            flex: 1,
            alignSelf: 'center',
            width: '100%',
        },
        mainSplitWrapper: {
            flex: 1,
            flexDirection: 'row',
            height: '100%',
        },
        // Left Sidebar Navigation
        sidebarColumn: {
            width: 260,
            borderRightWidth: 1,
            borderRightColor: 'rgba(255, 255, 255, 0.1)',
            paddingVertical: 24,
            paddingHorizontal: 16,
            backgroundColor: Colors.coltsNavy, // Solid Colts Navy branding for desktop sidebar
            justifyContent: 'space-between',
            height: '100%',
        },
        sidebarBrand: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingBottom: 24,
            paddingHorizontal: 8,
        },
        brandText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: -0.5,
        },
        cursiveGoldTextBrand: {
            color: Colors.hofYellow,
            fontFamily: react_native_1.Platform.select({
                web: "'Caveat', 'Dancing Script', cursive",
                default: 'System',
            }),
            fontSize: 24,
        },
        sidebarSectionTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: 'rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            letterSpacing: 1.5,
            marginTop: 18,
            marginBottom: 8,
            paddingLeft: 8,
        },
        sidebarLinksContainer: {
            gap: 4,
            flex: 1,
        },
        sidebarLink: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            minHeight: 44, // HIG touch target compliant
        },
        sidebarLinkActive: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderLeftWidth: 3,
            borderLeftColor: Colors.hofYellow,
        },
        sidebarLinkEmoji: {
            fontSize: 16,
        },
        sidebarLinkText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: '#94a3b8',
        },
        sidebarLinkTextActive: {
            color: '#ffffff',
            fontWeight: '600',
        },
        sidebarCoachCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.06)',
            paddingTop: 16,
            paddingHorizontal: 4,
        },
        coachAvatarCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.15)', // Standardized neutral borders (No Orange)
        },
        coachAvatarText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        coachCardInfo: {
            flex: 1,
            gap: 2,
        },
        coachCardName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            fontWeight: '600',
            color: '#ffffff',
        },
        coachCardFormat: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.hofYellow,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        logoutBtnIcon: {
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16,
            backgroundColor: 'rgba(239, 68, 68, 0.05)',
        },
        // Right Workspace Page Layout
        rightWorkspace: {
            flex: 1,
            backgroundColor: Colors.background, // Light slate-blue background
        },
        workspaceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight, // Light mode slate border
        },
        headerTitleArea: {
            gap: 2,
        },
        headerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        headerSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
        },
        headerRightActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
        },
        syncBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            borderWidth: 0.5,
            borderColor: 'rgba(34, 197, 94, 0.2)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 50,
        },
        syncDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#22C55E',
        },
        syncText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: '#22C55E',
            fontWeight: 'bold',
        },
        primaryRunBtn: {
            backgroundColor: Colors.hofYellow,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
            minHeight: 44, // Apple reachability target
            justifyContent: 'center',
            alignItems: 'center',
        },
        primaryRunBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#09090b',
            letterSpacing: 0.5,
        },
        // Interactive View Tabs Container
        tabBarContainer: {
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            paddingHorizontal: 16,
            paddingVertical: 10,
            gap: 8,
        },
        tabButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(0,0,0,0.06)',
            backgroundColor: 'transparent',
            minHeight: 44, // Touch size minimum
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabButtonActive: {
            backgroundColor: 'rgba(0,0,0,0.04)',
            borderColor: Colors.primaryAccent,
        },
        tabButtonText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 13,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
            letterSpacing: 0.2,
        },
        tabButtonTextActive: {
            color: Colors.primaryAccent,
        },
        // Main Scroll Contents
        scrollArea: {
            flex: 1,
        },
        scrollContent: {
            padding: 24,
            gap: 24,
            paddingBottom: react_native_1.Platform.OS === 'ios' ? 120 : 100, // Safe padding on mobile viewports
        },
        // Metrics summary strip
        metricsStrip: {
            flexDirection: 'row',
            gap: 12,
            flexWrap: 'wrap',
        },
        metricCard: {
            flex: 1,
            minWidth: 160,
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            borderRadius: 16,
            padding: 16,
            gap: 12,
            // Flat Card Aesthetic - No shadows
        },
        metricHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        metricLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: 'rgba(255, 255, 255, 0.35)',
            fontWeight: 'bold',
            letterSpacing: 0.8,
        },
        trendBadge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        trendText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
        },
        metricValue: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        metricComparison: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: '#64748b',
        },
        // Visualizations: Line & Donut
        chartsGridRow: {
            flexDirection: 'column',
            gap: 20,
        },
        chartPanelCard: {
            flex: 1,
            minWidth: 320,
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            borderRadius: 16,
            padding: 20,
            gap: 12,
            // Flat Card Aesthetic - No shadows
        },
        panelHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 8,
        },
        panelTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 0.5,
        },
        panelSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: '#64748b',
        },
        legendIndicatorRow: {
            flexDirection: 'row',
            gap: 12,
        },
        legendDotItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        legendIndicatorDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        legendIndicatorLabel: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: '#94a3b8',
        },
        svgChartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        // Donut positions
        donutChartContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
        },
        donutWrapper: {
            width: 120,
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
        },
        donutCenterContent: {
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: 90,
            height: 90,
        },
        donutCenterValue: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        donutCenterLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: 'rgba(255, 255, 255, 0.35)',
            fontWeight: 'bold',
        },
        donutLegendContainer: {
            flex: 1,
            minWidth: 160,
            gap: 6,
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        legendDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        legendName: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: '#94a3b8',
            flex: 1,
        },
        legendVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: '#ffffff',
            fontWeight: '600',
        },
        // Active Swarm Bot Profiles Roster (Overview Tab)
        botRosterGrid: {
            flexDirection: 'row',
            gap: 12,
            flexWrap: 'wrap',
        },
        botRosterCard: {
            flex: 1,
            minWidth: 280,
            backgroundColor: Colors.surface,
            borderColor: Colors.glassBorder,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            gap: 12,
            // Flat Card Aesthetic - No shadows
        },
        botRosterHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        botRosterLeftInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        botRosterName: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        botRosterTag: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        botRosterTagText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
        },
        botRosterWinRate: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
        },
        botRosterAccuracyRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        botRosterAccuracyLabel: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: '#94a3b8',
        },
        botRosterAccuracyVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 11,
            color: '#ffffff',
            fontWeight: 'bold',
        },
        botRosterProgressTrack: {
            height: 6,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 3,
            overflow: 'hidden',
        },
        botRosterProgressFill: {
            height: '100%',
            borderRadius: 3,
        },
        botRosterRecordLabel: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: '#64748b',
        },
        // Evolved Swarm Training Controls Card (Swarm Training Tab)
        swarmControlCard: {
            flexDirection: 'row',
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorderGold,
            borderRadius: 16,
            padding: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
        },
        swarmControlLeft: {
            flex: 1,
            gap: 4,
            minWidth: 260,
        },
        swarmControlTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.hofYellow,
            letterSpacing: 0.5,
        },
        swarmControlSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: '#94a3b8',
            lineHeight: 16,
        },
        swarmLoopBtn: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            minHeight: 44, // touch compliance
            justifyContent: 'center',
            alignItems: 'center',
        },
        swarmLoopBtnActive: {
            borderColor: '#22C55E',
        },
        btnRowContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        livePulseDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        swarmLoopBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        // Cohort Standings Table Components
        cohortTableContainer: {
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            overflow: 'hidden',
        },
        cohortTableHeader: {
            flexDirection: 'row',
            backgroundColor: 'rgba(0,0,0,0.02)',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.06)',
        },
        cohortTableHeadCell: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        cohortTableRow: {
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(0,0,0,0.04)',
            alignItems: 'center',
        },
        cohortTableCell: {
            justifyContent: 'center',
        },
        cohortTableText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 12,
            color: Colors.primaryAccent,
        },
        cohortTableTextBold: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        cohortTableTextSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: 1,
        },
        strategyBadgeCompact: {
            alignSelf: 'flex-start',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            borderWidth: 0.5,
            backgroundColor: 'rgba(0,0,0,0.02)',
        },
        strategyBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
        },
        // Mutated Matrix Grid Components
        mutationMatrixGrid: {
            flexDirection: 'row',
            gap: 16,
            flexWrap: 'wrap',
        },
        mutationMatrixCard: {
            flex: 1,
            minWidth: 200,
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            borderRadius: 12,
            padding: 12,
            gap: 8,
        },
        mutationMatrixHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8,
        },
        mutationMatrixLabel: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: '#ffffff',
            flex: 1,
        },
        mutationMatrixBadge: {
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
        },
        mutationMatrixBadgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: 'bold',
        },
        mutationMatrixStatus: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: '#64748b',
        },
        // Terminal Console Logs Components (Tab 3)
        terminalConsoleContainer: {
            backgroundColor: '#09090b',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            borderRadius: 16,
            overflow: 'hidden',
            height: 240,
        },
        terminalConsoleHeader: {
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.08)',
            paddingVertical: 10,
            paddingHorizontal: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        terminalConsoleHeaderLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        terminalConsoleTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 0.5,
        },
        terminalConsoleFormat: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.hofYellow,
            fontWeight: 'bold',
        },
        terminalConsoleBody: {
            flex: 1,
            backgroundColor: '#050507',
        },
        terminalConsoleLogLine: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            color: '#4ade80', // bright terminal green
            lineHeight: 16,
        },
        // News crawler container (Tab 3)
        newsCrawlerContainer: {
            gap: 16,
        },
        newsCrawlerCard: {
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            borderRadius: 16,
            padding: 16,
            gap: 10,
        },
        newsCrawlerCardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        newsCrawlerCategoryBadge: {
            backgroundColor: 'rgba(96,165,250,0.1)',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 4,
            borderWidth: 0.5,
            borderColor: '#60a5fa',
        },
        newsCrawlerCategoryText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: '#60a5fa',
            fontWeight: 'bold',
        },
        newsCrawlerDateText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: '#64748b',
        },
        newsCrawlerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        newsCrawlerExcerpt: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: '#94a3b8',
            lineHeight: 16,
        },
        // Grid Action Directives
        gridSection: {
            gap: 12,
        },
        sectionHeaderTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 'bold',
            letterSpacing: 0.5,
            paddingLeft: 4,
        },
        featureGrid: {
            flexDirection: 'row',
            gap: 16,
            flexWrap: 'wrap',
        },
        featureCardPressable: {
            flex: 1,
            minWidth: 320,
        },
        featureCard: {
            flex: 1,
            backgroundColor: Colors.surface,
            borderWidth: 1,
            borderColor: Colors.glassBorder,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            minHeight: 88, // Massively compliant 44pt+ touch target height
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: Colors.shadows.shadowOffset,
            shadowOpacity: Colors.shadows.shadowOpacity,
            shadowRadius: Colors.shadows.shadowRadius,
            elevation: Colors.shadows.elevation,
        },
        cardIndicatorDotGold: {
            position: 'absolute',
            top: 12,
            right: 12,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: Colors.hofYellow,
        },
        featureCardLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            flex: 1,
        },
        featureIconCircle: {
            width: 44, // 44pt HIG Target Minimum
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        featureTextContainer: {
            flex: 1,
            gap: 3,
        },
        featureTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 15,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: -0.2,
        },
        featureSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            lineHeight: 15,
        },
        arrowChevron: {
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardPressed: {
            borderColor: Colors.hofYellow,
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            transform: [{ scale: 0.98 }],
        },
        btnPressed: {
            opacity: 0.6,
        },
        // Audio Speech Quotes Coaching insights (Strict Mandate Compliance)
        playCardWrapper: {
            gap: 6,
        },
        errorBanner: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#EF4444',
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
        },
        errorText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            fontWeight: 'bold',
            color: '#EF4444',
            textAlign: 'center',
        },
        playCard: {
            backgroundColor: Colors.surface, // Solid white surface for cards
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: 14,
            paddingHorizontal: 16,
            minHeight: 88,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            // Flat Card Aesthetic - No shadows
        },
        playCardLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: 14,
        },
        iconCircle: {
            width: 44, // 44pt HIG Target Minimum
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderColor: 'rgba(0, 0, 0, 0.06)',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconCircleSpeaking: {
            borderColor: Colors.hofYellow,
            backgroundColor: 'rgba(255, 205, 0, 0.1)',
        },
        speakingWave: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.5,
            height: 16,
        },
        waveBar: {
            width: 3,
            height: 16,
            backgroundColor: Colors.coltsNavy,
            borderRadius: 1.5,
        },
        playCardText: {
            flex: 1,
            gap: 3,
        },
        badgeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        liveIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            backgroundColor: Colors.surfaceLifted,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 50,
            borderWidth: 0.5,
            borderColor: '#22C55E',
        },
        livePulse: {
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#22C55E',
        },
        liveText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 6,
            color: '#22C55E',
            fontWeight: 'bold',
        },
        playCardTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 15,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: -0.2,
        },
        playCardSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            lineHeight: 16,
        },
        attributionText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            fontStyle: 'italic',
            color: Colors.secondaryAccent,
            marginTop: 2,
        },
        arrowChevronCircle: {
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
        },
        // Starbucks-Inspired Pinned Layout & FAB styling
        scrollContentMobile: {
            paddingBottom: react_native_1.Platform.OS === 'ios' ? 160 : 130,
        },
        mobileHeaderGroup: {
            width: '100%',
            paddingBottom: 8,
        },
        mobileGreetingBanner: {
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 16,
            width: '100%',
        },
        liveCrawlerBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#EF8354', // Energetic Coral brand background from request 8
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#BFC0C0',
            gap: 6,
        },
        liveCrawlerDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#000000', // Crisp black contrasting dot on Coral background
        },
        liveCrawlerDotSyncing: {
            backgroundColor: '#ffffff', // white dot when active/syncing
        },
        liveCrawlerText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: '800',
            color: '#000000', // Solid black text (WCAG AAA 7:1+ contrast ratio on energetic Coral)
            letterSpacing: 0.5,
        },
        greetingMainText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 22,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
            lineHeight: 26,
        },
        greetingCoachName: {
            color: Colors.primaryAccent === '#FFFFFF' ? Colors.hofYellow : Colors.primaryAccent, // High contrast adaptive highlight
        },
        tabBarContainerSticky: {
            // WCAG AAA Opaque Backdrop Mandate compliance!
            backgroundColor: Colors.surface, // dynamically resolves to solid white or graphite
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            paddingHorizontal: 16,
            paddingVertical: 12,
            width: '100%',
        },
        mobileContentArea: {
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 20,
        },
        fabWrapper: {
            position: 'absolute',
            bottom: react_native_1.Platform.OS === 'ios' ? 104 : 96,
            right: 16,
            zIndex: 999999, // Float above content and bottom navigation
        },
        fabButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.hofYellow, // #FFCD00
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderRadius: 30,
            borderWidth: 1.5,
            borderColor: '#ffffff', // High contrast border highlight
            minHeight: 48,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 6,
        },
        fabButtonPressed: {
            opacity: 0.9,
        },
        fabText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#040b1f',
            letterSpacing: 0.8,
        },
        cardCtaContainer: {
            marginTop: 6,
            alignSelf: 'flex-start',
        },
        cardCtaText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent === '#FFFFFF' ? Colors.hofYellow : Colors.primaryAccent,
        },
        // Starbucks-style homogeneous home feed styles
        feedContainer: {
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 40,
            width: '100%',
            alignSelf: 'center',
            maxWidth: 800,
        },
        tileGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
            gap: 16,
        },
        tileCard: {
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: Colors.coltsNavyLight,
            overflow: 'hidden',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            width: '100%',
            marginBottom: 8,
        },
        tileCardDesktop: {
            width: '48.5%', // 2 columns with spacing on desktop
            marginBottom: 0,
        },
        tileImageContainer: {
            height: 160,
            width: '100%',
            backgroundColor: Colors.surfaceLifted,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
        },
        tileContent: {
            padding: 16,
        },
        tileKicker: {
            fontFamily: theme_1.Fonts.headings,
            color: Colors.doordashRed,
            fontSize: 11,
            letterSpacing: 1.2,
            marginBottom: 4,
            textTransform: 'uppercase',
        },
        tileTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            marginBottom: 8,
            lineHeight: 22,
        },
        tileDescription: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            lineHeight: 18,
            color: Colors.secondaryAccent,
            marginBottom: 16,
            minHeight: 54, // Ensures paragraph blocks take identical height footprint
        },
        tileButton: {
            height: 44,
            borderRadius: 22,
            backgroundColor: Colors.hofYellow,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: Colors.hofYellow,
            paddingHorizontal: 24,
            alignSelf: 'flex-start',
        },
        tileButtonText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#000000',
            letterSpacing: 0.5,
        },
        newsTileImage: {
            width: '100%',
            height: 160,
        },
        tileImageOverlay: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
        },
        newsTrendBadge: {
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: '#0c0c0c',
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        newsTrendBadgeText: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.stats,
            fontWeight: 'bold',
        },
        newsMetaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
        },
        newsTagBadge: {
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
            marginRight: 8,
        },
        newsTagText: {
            fontSize: 9,
            fontFamily: theme_1.Fonts.headings,
            fontWeight: 'bold',
            color: '#000000', // Mandatory solid black overlay
        },
        newsTimeText: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.stats,
            color: Colors.secondaryAccent,
        },
        newsTakeTextKicker: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.headings,
            color: Colors.hofYellow, // Champagne Bronze
            marginTop: 8,
            marginBottom: 2,
        },
        newsTakeText: {
            fontSize: 12,
            fontFamily: theme_1.Fonts.body,
            color: Colors.primaryAccent,
            lineHeight: 16,
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
