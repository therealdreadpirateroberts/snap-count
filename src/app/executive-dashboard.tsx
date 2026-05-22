import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Animated, Platform, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, Stop, G, Text as SvgText } from 'react-native-svg';
import { useColors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import * as Haptics from 'expo-haptics';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function ExecutiveDashboardContent() {
  const Colors = useColors();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);

  // Zustand State Subscriptions
  const {
    featuredSlot1Key,
    homepageTileCap,
    setHomepageTileCap,
    showNewsOnHomepage,
    setShowNewsOnHomepage
  } = usePlayerStore();

  const {
    liveSimRunning,
    startLiveSimulationLoop,
    stopLiveSimulationLoop,
    clearSimulatedCohorts,
    resetLiveSimulationStats
  } = useSimulationStore();

  // Modal Visibility States
  const [capperModalVisible, setCapperModalVisible] = useState(false);
  const [telemetryModalVisible, setTelemetryModalVisible] = useState(false);
  const [advisorModalVisible, setAdvisorModalVisible] = useState(false);

  // Animation values for scale press hooks
  const scaleRef = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Real-time speed & telemetry mock parameters for executive display
  const [draftsPerSec, setDraftsPerSec] = useState(4820.5);
  const [systemStability, setSystemStability] = useState(99.98);
  const [activeThreads, setActiveThreads] = useState(128);

  const getScale = (id: string) => {
    if (!scaleRef[id]) {
      scaleRef[id] = new Animated.Value(1);
    }
    return scaleRef[id];
  };

  const handlePressIn = (id: string) => {
    Animated.spring(getScale(id), {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 180,
      friction: 8,
    }).start();
  };

  const handlePressOut = (id: string) => {
    Animated.spring(getScale(id), {
      toValue: 1,
      useNativeDriver: true,
      tension: 180,
      friction: 8,
    }).start();
  };

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  // Flashing telemetry loop
  useEffect(() => {
    let interval: any = null;
    if (liveSimRunning) {
      interval = setInterval(() => {
        setDraftsPerSec(prev => +(prev + (Math.random() - 0.5) * 80).toFixed(1));
        setSystemStability(prev => +(99.95 + Math.random() * 0.04).toFixed(3));
        setActiveThreads(prev => Math.floor(120 + Math.random() * 16));
      }, 1000);
    } else {
      interval = setInterval(() => {
        setDraftsPerSec(prev => +(prev * 0.98).toFixed(1));
        setSystemStability(99.99);
        setActiveThreads(0);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [liveSimRunning]);

  // Advisor advice updates dynamically depending on the configurations chosen
  const getAdvisorInsights = () => {
    const insights = [];
    
    if (homepageTileCap < 8) {
      insights.push("⚠️ DENSE FOCUS: Cap is set extremely low. Users will only see core functions; secondary tools are hidden.");
    } else if (homepageTileCap > 10) {
      insights.push("💡 LEAGUE COVERAGE: High homepage tile count. Ensure top priority items are pinned to prevent scanner decay.");
    } else {
      insights.push("🎯 OPTIMAL VISIBILITY: Standard 10-tile boundary limits are fully enforced. HIG scanner density is balanced.");
    }

    if (featuredSlot1Key === 'mock-draft') {
      insights.push("👑 DRAFT DOMINANCE: 'Mock Draft Suite' pinned to Slot 1A. Drive immediate conversion of standard bot setup runs.");
    } else if (featuredSlot1Key === 'top250') {
      insights.push("👑 EXPERT SCENARIOS: 'Top 250 Consensus Matrix' promoted. ADP variance scanner is prioritized on first load.");
    } else {
      insights.push(`👑 BRAND ALIGNMENT: '${featuredSlot1Key.toUpperCase()}' promoted to Slot 1A. Observe conversion metric telemetry closely.`);
    }

    if (!showNewsOnHomepage) {
      insights.push("✅ NEWS COMPRESSION: NFL Stories are completely excluded. 100% focused on core drafting software engines.");
    } else {
      insights.push("💡 HYBRID VIEWPORT: Stories and telemetry integrated on landing grid. News telemetry is syncing in the background.");
    }

    if (liveSimRunning) {
      insights.push("🚀 LIVE CONCURRENCY: Monte Carlo swarm evolution loop active. Concurrency threads and evolution matrices are peaking.");
    } else {
      insights.push("💤 TELEMETRY SLEEP: Sweepers are idle. Awaiting evolution command loops from the command console.");
    }

    return insights;
  };

  const capsList = [5, 8, 10, 12];
  const styles = createStyles(Colors, theme);

  // SVG Graphics for Tiles (to look exact same as homepage)
  const renderDashboardCardGraphic = (type: 'promo' | 'capper' | 'telemetry' | 'advisor') => {
    switch (type) {
      case 'promo':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="promoGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#1E293B" />
                <Stop offset="100%" stopColor="#0c0c0c" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#promoGrad)" />
            
            {/* Outline Slot Mockups */}
            <Rect x="40" y="45" width="60" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <Rect x="130" y="45" width="60" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <Rect x="220" y="45" width="60" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

            {/* Pinned Crown inside slot 1 */}
            <G transform="translate(70, 75) scale(1.1)">
              <Circle cx="0" cy="0" r="22" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" strokeDasharray="5,3" />
              {/* Crown */}
              <Path d="M-8 8 L8 8 L10 -4 L4 2 L0 -8 L-4 2 L-10 -4 Z" fill={Colors.hofYellow} />
            </G>

            {/* Barcode details for tech aesthetic */}
            <Rect x="140" y="85" width="40" height="4" fill="rgba(255, 255, 255, 0.2)" />
            <Rect x="140" y="93" width="25" height="4" fill="rgba(255, 255, 255, 0.15)" />
            <Rect x="230" y="85" width="40" height="4" fill="rgba(255, 255, 255, 0.2)" />
            <Rect x="230" y="93" width="30" height="4" fill="rgba(255, 255, 255, 0.15)" />
          </Svg>
        );
      case 'capper':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="capperGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#0c0c0c" />
                <Stop offset="100%" stopColor="#1e293b" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#capperGrad)" />

            {/* Switcher & Grid mockups */}
            <Rect x="50" y="40" width="220" height="80" rx="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            
            {/* Grid Cap blocks */}
            <Rect x="70" y="60" width="32" height="32" rx="16" fill={Colors.hofYellow} />
            <SvgText x="86" y="80" fill="#000000" fontSize="12" fontWeight="bold" textAnchor="middle">10</SvgText>

            <Circle cx="130" cy="76" r="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <SvgText x="130" y="80" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold" textAnchor="middle">12</SvgText>

            {/* Toggle switch track */}
            <Rect x="180" y="64" width="60" height="24" rx="12" fill={Colors.coltsNavy} />
            <Circle cx="228" cy="76" r="10" fill="#FFFFFF" />
          </Svg>
        );
      case 'telemetry':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="telGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#0F172A" />
                <Stop offset="100%" stopColor="#1E293B" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#telGrad)" />
            
            {/* Speed dial */}
            <G transform="translate(160, 80) scale(1.1)">
              <Circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <Circle
                cx="0"
                cy="0"
                r="30"
                fill="none"
                stroke={Colors.hofYellow}
                strokeWidth="6"
                strokeDasharray="188.4"
                strokeDashoffset={188.4 * 0.3}
                strokeLinecap="round"
                transform="rotate(-90)"
              />
              <SvgText x="0" y="5" fill="#ffffff" fontSize="11" fontFamily="JetBrainsMono-Bold" textAnchor="middle">PEAK</SvgText>
            </G>

            {/* Simulated bar chart columns in corner */}
            <Rect x="40" y="100" width="10" height="30" fill="rgba(255,113,113,0.3)" rx="2" />
            <Rect x="60" y="80" width="10" height="50" fill="rgba(74,222,128,0.5)" rx="2" />
            <Rect x="80" y="90" width="10" height="40" fill="rgba(96,165,250,0.4)" rx="2" />

            <Rect x="230" y="100" width="10" height="30" fill="rgba(251,146,60,0.3)" rx="2" />
            <Rect x="250" y="70" width="10" height="60" fill={Colors.hofYellow} rx="2" />
            <Rect x="270" y="95" width="10" height="35" fill="rgba(192,132,252,0.4)" rx="2" />
          </Svg>
        );
      case 'advisor':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="advGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#1E293B" />
                <Stop offset="100%" stopColor="#0c0c0c" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#advGrad)" />

            {/* Neural Brain node lines */}
            <G stroke="rgba(190, 169, 142, 0.2)" strokeWidth="1">
              <Line x1="160" y1="80" x2="110" y2="50" />
              <Line x1="160" y1="80" x2="210" y2="50" />
              <Line x1="160" y1="80" x2="110" y2="110" />
              <Line x1="160" y1="80" x2="210" y2="110" />
              
              <Line x1="110" y1="50" x2="60" y2="80" />
              <Line x1="110" y1="110" x2="60" y2="80" />
              <Line x1="210" y1="50" x2="260" y2="80" />
              <Line x1="210" y1="110" x2="260" y2="80" />
            </G>

            {/* Glow nodes */}
            <Circle cx="160" cy="80" r="10" fill="#bea98e" />
            <Circle cx="160" cy="80" r="15" fill="none" stroke="#bea98e" strokeWidth="1" strokeDasharray="3 3" />
            
            <Circle cx="110" cy="50" r="6" fill="#4a4a4a" />
            <Circle cx="210" cy="50" r="6" fill="#4a4a4a" />
            <Circle cx="110" cy="110" r="6" fill="#4a4a4a" />
            <Circle cx="210" cy="110" r="6" fill="#4a4a4a" />

            <Circle cx="60" cy="80" r="8" fill="#22C55E" />
            <Circle cx="260" cy="80" r="8" fill={Colors.hofYellow} />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Universal sub-page header */}
        <AppHeader
          title="EXECUTIVE DASHBOARD"
          subtitle="CEO Control Console"
          showBack={true}
          backText="PROFILE"
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionHeader}>CEO SYSTEM TOOLS</Text>
          
          <View style={styles.tileGrid}>
            
            {/* TILE 1: PRIME 1A TILE PROMOTION */}
            <Pressable
              style={({ pressed }) => [
                styles.tileCard,
                pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/qa-simulation');
              }}
            >
              <View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('promo')}
              </View>
              <View style={styles.tileContent}>
                <Text style={styles.tileKicker}>Prioritization</Text>
                <Text style={styles.tileTitle}>Slot 1A Tile Promotion</Text>
                <Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Configure and prioritize which premium analytical tool is pinned to the index 0 position (Prime 1A) on the homepage. Instantly shifts the grid hierarchy.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/qa-simulation');
                  }}
                >
                  <Text style={styles.tileButtonText}>LAUNCH PROMOTION PANEL</Text>
                </Pressable>
              </View>
            </Pressable>

            {/* TILE 2: HOMEPAGE FEED CONFIGURATOR */}
            <Pressable
              style={({ pressed }) => [
                styles.tileCard,
                pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                setCapperModalVisible(true);
              }}
            >
              <View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('capper')}
              </View>
              <View style={styles.tileContent}>
                <Text style={styles.tileKicker}>Feed Customization</Text>
                <Text style={styles.tileTitle}>Grid Tile Limits & News</Text>
                <Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Manage homepage clutter by setting strict total tile limits (5, 8, 10, or 12) and toggle global injury tickers or NFL news crawlers ON or OFF.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setCapperModalVisible(true);
                  }}
                >
                  <Text style={styles.tileButtonText}>OPEN GRID CONFIGURATOR</Text>
                </Pressable>
              </View>
            </Pressable>

            {/* TILE 3: SIMULATION SWEEPS & TELEMETRY */}
            <Pressable
              style={({ pressed }) => [
                styles.tileCard,
                pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                setTelemetryModalVisible(true);
              }}
            >
              <View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('telemetry')}
              </View>
              <View style={styles.tileContent}>
                <Text style={styles.tileKicker}>Monte Carlo Lab</Text>
                <Text style={styles.tileTitle}>Throughput & Strategy Telemetry</Text>
                <Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Operate dynamic CPU Monte Carlo sweepers. Graph simulated strategy win indices, inspect evolved bot army standings, and flush system run data.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setTelemetryModalVisible(true);
                  }}
                >
                  <Text style={styles.tileButtonText}>LAUNCH TELEMETRY MODULE</Text>
                </Pressable>
              </View>
            </Pressable>

            {/* TILE 4: AI ENGINE ADVISOR */}
            <Pressable
              style={({ pressed }) => [
                styles.tileCard,
                pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                setAdvisorModalVisible(true);
              }}
            >
              <View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('advisor')}
              </View>
              <View style={styles.tileContent}>
                <Text style={styles.tileKicker}>Heuristic Diagnostics</Text>
                <Text style={styles.tileTitle}>AI Engine Advisor Console</Text>
                <Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Access dynamic strategy advice, concurrency performance warnings, and real-time analytical findings generated by our diagnostic engine core.
                </Text>
                <Pressable
                  style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setAdvisorModalVisible(true);
                  }}
                >
                  <Text style={styles.tileButtonText}>OPEN ADVISOR CONSOLE</Text>
                </Pressable>
              </View>
            </Pressable>

          </View>
        </ScrollView>
      </SafeAreaView>
      <AppTabBar />

      {/* ========================================================== */}
      {/*             MODAL OVERLAYS (EXECUTIVE WORKSPACES)          */}
      {/* ========================================================== */}

      {/* 1. HOMEPAGE FEED CONFIGURATOR MODAL */}
      <Modal
        visible={capperModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCapperModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>⚙️ HOMEPAGE GRID CONFIGURATOR</Text>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setCapperModalVisible(false);
                }}
                style={styles.modalCloseIconBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.modalSectionDesc}>
                Fine-tune homepage constraints. Cap visual clutter and enable/disable injury crawlers.
              </Text>

              {/* Tile Limits setting */}
              <View style={styles.configSettingRow}>
                <View style={styles.settingDetails}>
                  <Text style={styles.settingLabel}>HOMEPAGE TILES CAP</Text>
                  <Text style={styles.settingSubLabel}>Cap final homepage feature tiles</Text>
                </View>
                <View style={styles.capperChipsRow}>
                  {capsList.map((num) => {
                    const active = homepageTileCap === num;
                    const animScale = getScale('cap_' + num);
                    return (
                      <Animated.View key={num} style={{ transform: [{ scale: animScale }] }}>
                        <Pressable
                          onPressIn={() => handlePressIn('cap_' + num)}
                          onPressOut={() => handlePressOut('cap_' + num)}
                          onPress={() => {
                            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                            setHomepageTileCap(num);
                          }}
                          style={[styles.capperChip, active && styles.capperChipActive]}
                        >
                          <Text style={[styles.capperChipText, active && styles.capperChipTextActive]}>
                            {num}
                          </Text>
                        </Pressable>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.horizontalDivider} />

              {/* News crawler toggle */}
              <View style={styles.configSettingRow}>
                <View style={styles.settingDetails}>
                  <Text style={styles.settingLabel}>NEWS STORIES ON HOMEPAGE</Text>
                  <Text style={styles.settingSubLabel}>Toggle global injury tickers or crawler blocks</Text>
                </View>
                <Switch
                  value={showNewsOnHomepage}
                  onValueChange={(val) => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setShowNewsOnHomepage(val);
                  }}
                  trackColor={{ false: '#4a4a4a', true: Colors.coltsNavy }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <Pressable
                onPress={() => {
                  triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                  setCapperModalVisible(false);
                }}
                style={styles.modalCtaBtn}
              >
                <Text style={styles.modalCtaBtnText}>APPLY CONFIGURATION</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2. SIMULATION SWEEPS & TELEMETRY MODAL */}
      <Modal
        visible={telemetryModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTelemetryModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>📊 TELEMETRY & SIMULATOR CONSOLE</Text>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setTelemetryModalVisible(false);
                }}
                style={styles.modalCloseIconBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              
              {/* Speed / Stability Gauges */}
              <View style={styles.metricsGridRow}>
                <View style={styles.metricsCard}>
                  <Text style={styles.metricsCardTitle}>THROUGHPUT SPEED</Text>
                  <View style={styles.dialContainer}>
                    <Svg width={90} height={90} viewBox="0 0 100 100">
                      <Defs>
                        <LinearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
                          <Stop offset="0%" stopColor="#4158D0" />
                          <Stop offset="100%" stopColor="#FFCD00" />
                        </LinearGradient>
                      </Defs>
                      <Circle cx="50" cy="50" r="40" fill="none" stroke="#0c0c0c" strokeWidth="8" />
                      <Circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#gaugeGrad)"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (liveSimRunning ? 0.76 : 0.05))}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </Svg>
                    <View style={styles.dialOverlay}>
                      <Text style={styles.dialMainVal}>{liveSimRunning ? 'PEAK' : 'IDLE'}</Text>
                      <Text style={styles.dialSubLabel}>THREADS</Text>
                    </View>
                  </View>
                  <Text style={styles.monoStatText}>
                    {draftsPerSec.toLocaleString()} <Text style={styles.monoStatUnit}>picks/s</Text>
                  </Text>
                </View>

                <View style={styles.metricsCard}>
                  <Text style={styles.metricsCardTitle}>SYSTEM HEALTH</Text>
                  <View style={styles.dialContainer}>
                    <Svg width={90} height={90} viewBox="0 0 100 100">
                      <Circle cx="50" cy="50" r="40" fill="none" stroke="#0c0c0c" strokeWidth="8" />
                      <Circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={Colors.hofYellow}
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * 0.999)}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </Svg>
                    <View style={styles.dialOverlay}>
                      <Text style={[styles.dialMainVal, { color: Colors.hofYellow }]}>{systemStability}%</Text>
                      <Text style={styles.dialSubLabel}>STABLE</Text>
                    </View>
                  </View>
                  <Text style={styles.monoStatText}>
                    {activeThreads} <Text style={styles.monoStatUnit}>concurrency</Text>
                  </Text>
                </View>
              </View>

              {/* Strategy Performance Bar Chart */}
              <View style={styles.chartPanel}>
                <Text style={styles.chartPanelTitle}>COHORT PERFORMANCE INDEX</Text>
                <View style={styles.chartContainer}>
                  <Svg width="100%" height={110} viewBox="0 0 200 110">
                    <Line x1="10" y1="10" x2="10" y2="90" stroke="#4a4a4a" strokeWidth="1" />
                    <Line x1="10" y1="90" x2="190" y2="90" stroke="#4a4a4a" strokeWidth="1" />
                    
                    {/* Zero RB */}
                    <Rect x="25" y={90 - (80 * 0.42)} width="14" height={80 * 0.42} fill="#ff7171" rx="2" />
                    {/* Hero RB */}
                    <Rect x="52" y={90 - (80 * 0.51)} width="14" height={80 * 0.51} fill="#4ade80" rx="2" />
                    {/* Balanced */}
                    <Rect x="79" y={90 - (80 * 0.48)} width="14" height={80 * 0.48} fill="#60a5fa" rx="2" />
                    {/* Late QB/TE */}
                    <Rect x="106" y={90 - (80 * 0.45)} width="14" height={80 * 0.45} fill="#fb923c" rx="2" />
                    {/* Robust RB */}
                    <Rect x="133" y={90 - (80 * 0.44)} width="14" height={80 * 0.44} fill="#c084fc" rx="2" />
                    {/* Elite QB/TE */}
                    <Rect x="160" y={90 - (80 * 0.46)} width="14" height={80 * 0.46} fill={Colors.hofYellow} rx="2" />
                  </Svg>
                </View>
                <View style={styles.chartLabelsRow}>
                  <Text style={styles.chartMiniLabel}>Z-RB</Text>
                  <Text style={styles.chartMiniLabel}>H-RB</Text>
                  <Text style={styles.chartMiniLabel}>BAL</Text>
                  <Text style={styles.chartMiniLabel}>L-QB</Text>
                  <Text style={styles.chartMiniLabel}>R-RB</Text>
                  <Text style={styles.chartMiniLabel}>E-QB</Text>
                </View>
              </View>

              {/* Standing bot army grid */}
              <View style={styles.standingsPanel}>
                <Text style={styles.chartPanelTitle}>EVOLVED BOT ARMY WIN SUMMARY</Text>
                <View style={styles.standingsGrid}>
                  <View style={styles.standingHeaderRow}>
                    <Text style={styles.standingHeaderLabel}>BOT NAME</Text>
                    <Text style={styles.standingHeaderLabel}>CAMP</Text>
                    <Text style={styles.standingHeaderLabel}>INDEX</Text>
                  </View>
                  {[
                    { name: 'ANDY', strategy: 'Zero RB', rate: '59.2%' },
                    { name: 'JASON', strategy: 'Hero RB', rate: '56.3%' },
                    { name: 'MIKE', strategy: 'Balanced', rate: '53.3%' },
                    { name: 'SARAH', strategy: 'Robust RB', rate: '50.8%' },
                  ].map((bot, idx) => (
                    <View key={bot.name} style={styles.standingDataRow}>
                      <Text style={styles.standingName}>#{idx + 1} {bot.name}</Text>
                      <Text style={styles.standingCamp}>{bot.strategy}</Text>
                      <Text style={styles.standingRate}>{bot.rate}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Loop Operations Controls */}
              <View style={styles.operationsCard}>
                <Text style={styles.operationsTitle}>MONTE CARLO CRAWLER CORE</Text>
                <View style={styles.operationsBtnRow}>
                  <Pressable
                    onPress={() => {
                      triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                      if (liveSimRunning) {
                        stopLiveSimulationLoop();
                      } else {
                        startLiveSimulationLoop();
                      }
                    }}
                    style={[styles.opBtn, liveSimRunning ? styles.opBtnActive : styles.opBtnDefault]}
                  >
                    <Text style={[styles.opBtnText, liveSimRunning ? styles.opBtnTextActive : styles.opBtnTextDefault]}>
                      {liveSimRunning ? 'PAUSE LOOP' : 'RUN SWEEP'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
                      clearSimulatedCohorts();
                      resetLiveSimulationStats();
                    }}
                    style={styles.opBtnWipe}
                  >
                    <Text style={styles.opBtnTextWipe}>WIPE RUNS</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 3. AI ADVISOR MODAL */}
      <Modal
        visible={advisorModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAdvisorModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalSheetTitle}>🧠 AI ENGINE STRATEGIC ADVISOR</Text>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setAdvisorModalVisible(false);
                }}
                style={styles.modalCloseIconBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.advisorHeader}>
                <Text style={styles.advisorHeaderKicker}>DIAGNOSTICS & SYSTEM HEURISTICS</Text>
                <View style={styles.flashingDotWrapper}>
                  <View style={[styles.flashingDot, liveSimRunning ? { backgroundColor: '#22C55E' } : { backgroundColor: '#EF4444' }]} />
                </View>
              </View>

              <View style={styles.horizontalDivider} />

              <View style={styles.adviceBulletsList}>
                {getAdvisorInsights().map((insight, index) => (
                  <View key={index} style={styles.adviceBulletRow}>
                    <Text style={styles.bulletSymbol}>⚡</Text>
                    <Text style={styles.adviceBulletText}>{insight}</Text>
                  </View>
                ))}
              </View>

              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setAdvisorModalVisible(false);
                }}
                style={styles.modalCtaBtn}
              >
                <Text style={styles.modalCtaBtnText}>DISMISS CONSOLE</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  );
}

export default function ExecutiveDashboardScreen() {
  return (
    <ErrorBoundary>
      <ExecutiveDashboardContent />
    </ErrorBoundary>
  );
}

function createStyles(Colors: any, theme: string) {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.four,
      paddingBottom: Spacing.six,
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      width: '100%',
    },
    sectionHeader: {
      fontFamily: 'Oswald',
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      letterSpacing: 1.2,
      marginTop: Spacing.four,
      marginBottom: Spacing.three,
    },
    
    // Homogeneous Tiles Grid
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
      fontFamily: Fonts.headings,
      color: Colors.doordashRed,
      fontSize: 11,
      letterSpacing: 1.2,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    tileTitle: {
      fontFamily: Fonts.headings,
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      marginBottom: 8,
      lineHeight: 22,
    },
    tileDescription: {
      fontFamily: Fonts.body,
      fontSize: 13,
      lineHeight: 18,
      color: Colors.secondaryAccent,
      opacity: 0.9,
      marginBottom: 16,
    },
    tileButton: {
      backgroundColor: Colors.coltsNavy,
      borderRadius: 8,
      height: 38,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    tileButtonText: {
      fontFamily: Fonts.headings,
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },

    // Modal Sheet layouts
    modalBackdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    modalSheetContainer: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderColor: Colors.coltsNavyLight,
      padding: Spacing.four,
      maxHeight: '90%',
    },
    modalHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.three,
      borderBottomWidth: 1,
      borderBottomColor: Colors.coltsNavyLight,
      paddingBottom: 10,
    },
    modalSheetTitle: {
      fontFamily: 'Oswald',
      fontSize: 15,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    modalCloseIconBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: Colors.surfaceLifted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCloseText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
    },
    modalScrollContent: {
      paddingBottom: Spacing.six,
    },
    modalSectionDesc: {
      fontFamily: 'Inter',
      fontSize: 12,
      color: Colors.secondaryAccent,
      marginBottom: Spacing.four,
      lineHeight: 16,
    },
    modalCtaBtn: {
      backgroundColor: Colors.hofYellow,
      borderRadius: 8,
      height: 42,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.five,
    },
    modalCtaBtnText: {
      fontFamily: 'Oswald',
      color: '#000000',
      fontSize: 13,
      fontWeight: 'bold',
      letterSpacing: 0.8,
    },

    // GRID & CONFIGURATOR
    configSettingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.three,
    },
    settingDetails: {
      flex: 1,
      marginRight: Spacing.three,
    },
    settingLabel: {
      fontFamily: 'Oswald',
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    settingSubLabel: {
      fontFamily: 'Inter',
      fontSize: 10,
      color: Colors.secondaryAccent,
      marginTop: 2,
    },
    capperChipsRow: {
      flexDirection: 'row',
      gap: 6,
    },
    capperChip: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
    },
    capperChipActive: {
      backgroundColor: Colors.hofYellow,
      borderColor: Colors.hofYellow,
    },
    capperChipText: {
      fontFamily: 'JetBrainsMono-Bold',
      fontSize: 12,
      color: Colors.secondaryAccent,
    },
    capperChipTextActive: {
      color: '#000000',
    },
    horizontalDivider: {
      height: 1,
      backgroundColor: Colors.coltsNavyLight,
      marginVertical: Spacing.two,
    },

    // TELEMETRY
    metricsGridRow: {
      flexDirection: 'row',
      gap: Spacing.three,
      marginBottom: Spacing.three,
    },
    metricsCard: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      alignItems: 'center',
    },
    metricsCardTitle: {
      fontFamily: 'Oswald',
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      letterSpacing: 0.8,
      marginBottom: Spacing.two,
    },
    dialContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: 90,
      height: 90,
      marginBottom: Spacing.two,
    },
    dialOverlay: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialMainVal: {
      fontFamily: 'JetBrainsMono-Bold',
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    dialSubLabel: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 7,
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    monoStatText: {
      fontFamily: 'JetBrainsMono-Bold',
      fontSize: 13,
      color: Colors.primaryAccent,
      fontVariant: ['tabular-nums'],
    },
    monoStatUnit: {
      fontSize: 9,
      color: Colors.secondaryAccent,
      fontFamily: 'Inter',
    },
    chartPanel: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      marginBottom: Spacing.three,
    },
    chartPanelTitle: {
      fontFamily: 'Oswald',
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
      marginBottom: Spacing.two,
    },
    chartContainer: {
      height: 110,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.one,
    },
    chartLabelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 4,
      paddingLeft: 10,
    },
    chartMiniLabel: {
      fontFamily: 'JetBrainsMono',
      fontSize: 8,
      color: Colors.secondaryAccent,
    },
    standingsPanel: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      marginBottom: Spacing.three,
    },
    standingsGrid: {
      flex: 1,
    },
    standingHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: Colors.coltsNavyLight,
      paddingBottom: 4,
      marginBottom: 4,
    },
    standingHeaderLabel: {
      fontFamily: 'Oswald',
      fontSize: 9,
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    standingDataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    standingName: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 10,
      color: Colors.primaryAccent,
      flex: 2,
    },
    standingCamp: {
      fontFamily: 'Inter',
      fontSize: 9,
      color: Colors.secondaryAccent,
      flex: 2,
      textAlign: 'center',
    },
    standingRate: {
      fontFamily: 'JetBrainsMono-Bold',
      fontSize: 10,
      color: Colors.hofYellow,
      flex: 1,
      textAlign: 'right',
      fontVariant: ['tabular-nums'],
    },
    operationsCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      marginTop: Spacing.two,
    },
    operationsTitle: {
      fontFamily: 'Oswald',
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.8,
      marginBottom: Spacing.two,
    },
    operationsBtnRow: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    opBtn: {
      flex: 2,
      height: 38,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    opBtnDefault: {
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
    },
    opBtnActive: {
      backgroundColor: '#22C55E',
      borderColor: '#22C55E',
    },
    opBtnText: {
      fontFamily: 'Oswald',
      fontSize: 11,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    opBtnTextDefault: {
      color: Colors.primaryAccent,
    },
    opBtnTextActive: {
      color: '#000000',
    },
    opBtnWipe: {
      flex: 1,
      height: 38,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#EF4444',
      borderWidth: 1,
    },
    opBtnTextWipe: {
      fontFamily: 'Oswald',
      fontSize: 11,
      fontWeight: 'bold',
      color: '#EF4444',
      letterSpacing: 0.5,
    },

    // AI ADVISOR
    advisorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    advisorHeaderKicker: {
      fontFamily: 'Oswald',
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.8,
    },
    flashingDotWrapper: {
      width: 14,
      height: 14,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    flashingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    adviceBulletsList: {
      gap: 10,
      marginTop: Spacing.two,
    },
    adviceBulletRow: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-start',
    },
    bulletSymbol: {
      color: Colors.hofYellow,
      fontSize: 10,
      marginTop: 2,
    },
    adviceBulletText: {
      fontFamily: 'Inter',
      fontSize: 12,
      color: Colors.primaryAccent,
      lineHeight: 16,
      flex: 1,
    },
  });
}
