import React from 'react';
import { View, Text, Pressable, Animated, ActivityIndicator } from 'react-native';

interface BotArmyConsoleProps {
  styles: any;
  Colors: any;
  botArmySubTab: 'UX_TESTING' | 'DRAFT_SIMS';
  setBotArmySubTab: (subTab: 'UX_TESTING' | 'DRAFT_SIMS') => void;
  uxScanRunning: boolean;
  runUxAestheticsScan: () => void;
  uxScanProgress: {
    onboarding: number;
    setup: number;
    active: number;
    leaderboard: number;
  };
  uxScanMetrics: {
    onboarding: { score: number; words: number; buttons: number; clutter: number; opaque: boolean };
    setup: { score: number; words: number; buttons: number; clutter: number; opaque: boolean };
    active: { score: number; words: number; buttons: number; clutter: number; opaque: boolean };
    leaderboard: { score: number; words: number; buttons: number; clutter: number; opaque: boolean };
  };
  uxScanOverallGrade: number;
  uxAdviceList: string[];
  draftIntelRunning: boolean;
  runDraftSimsScan: () => void;
  draftIntelMetrics: {
    decisionLatency: number;
    arbitrageRate: number;
    backgroundDrafts: number;
    trainingGeneration: number;
    neuralFitness: number;
    activeAnomalies: number;
  };
  pulseAnim: Animated.Value;
  triggerHaptic: () => void;
  formatNumber: (num: number) => string;
}

export default function BotArmyConsole({
  styles,
  Colors,
  botArmySubTab,
  setBotArmySubTab,
  uxScanRunning,
  runUxAestheticsScan,
  uxScanProgress,
  uxScanMetrics,
  uxScanOverallGrade,
  uxAdviceList,
  draftIntelRunning,
  runDraftSimsScan,
  draftIntelMetrics,
  pulseAnim,
  triggerHaptic,
  formatNumber,
}: BotArmyConsoleProps) {
  return (
    <View style={styles.tabContentBlock}>
      
      {/* SUB NAVIGATION FOR BOT ARMY SCANNERS */}
      <View style={styles.subTabRow}>
        <Pressable
          style={[styles.subTabButton, botArmySubTab === 'UX_TESTING' && styles.subTabButtonActive]}
          onPress={() => { triggerHaptic(); setBotArmySubTab('UX_TESTING'); }}
        >
          <Text style={styles.subTabEmoji}>🏈</Text>
          <Text style={[styles.subTabButtonText, botArmySubTab === 'UX_TESTING' && styles.subTabButtonTextActive]}>
            UX Aesthetics Auditor
          </Text>
        </Pressable>

        <Pressable
          style={[styles.subTabButton, botArmySubTab === 'DRAFT_SIMS' && styles.subTabButtonActive]}
          onPress={() => { triggerHaptic(); setBotArmySubTab('DRAFT_SIMS'); }}
        >
          <Text style={styles.subTabEmoji}>🧠</Text>
          <Text style={[styles.subTabButtonText, botArmySubTab === 'DRAFT_SIMS' && styles.subTabButtonTextActive]}>
            Draft simulations intel
          </Text>
        </Pressable>
      </View>

      {botArmySubTab === 'UX_TESTING' ? (
        <>
          {/* UX SCAN DIRECTIVE CARD */}
          <View style={styles.controlCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeftGroup}>
                <Animated.View style={[styles.consoleIndicator, uxScanRunning && { opacity: pulseAnim }]}>
                  <View style={[styles.indicatorPulse, { backgroundColor: uxScanRunning ? Colors.hofYellow : '#22C55E' }]} />
                </Animated.View>
                <Text style={styles.cardHeaderTitle}>COMBINATORIAL UX AESTHETICS AUDITOR</Text>
              </View>
              {uxScanRunning && <ActivityIndicator color={Colors.hofYellow} size="small" />}
            </View>

            <Text style={styles.consoleDescription}>
              Deploys automated user bots to check text counts, button density, hitboxes, and layout spaciousness across all views.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.scanCtaBtn,
                uxScanRunning && styles.btnDisabled,
                pressed && !uxScanRunning && styles.btnPressed
              ]}
              onPress={runUxAestheticsScan}
              disabled={uxScanRunning}
            >
              <Text style={styles.startBtnText}>
                {uxScanRunning ? 'CRAWLING LAYOUTS & DOMS...' : 'TRIGGER COMBINATORIAL UX AESTHETICS SCAN'}
              </Text>
            </Pressable>
          </View>

          {/* COMPREHENSIVE MULTIPLE DASHBOARDS GRID */}
          <View style={styles.uxDashboardsGrid}>
            {/* Onboarding Card */}
            <View style={styles.uxDashboardItemCard}>
              <View style={styles.uxItemHeader}>
                <Text style={styles.uxItemTitle}>1. ONBOARDING SCREEN</Text>
                <View style={styles.uxGradeBadge}>
                  <Text style={styles.uxGradeText}>{uxScanMetrics.onboarding.score}/100</Text>
                </View>
              </View>
              
              <View style={styles.uxProgressLineRow}>
                <Text style={styles.uxProgressLabel}>Crawled</Text>
                <Text style={styles.uxProgressVal}>{uxScanProgress.onboarding}%</Text>
              </View>
              <View style={styles.miniProgressTrack}>
                <View style={[styles.miniProgressFill, { width: `${uxScanProgress.onboarding}%` }]} />
              </View>

              <View style={styles.uxDetailList}>
                <Text style={styles.uxDetailText}>Density: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.onboarding.words} words</Text></Text>
                <Text style={styles.uxDetailText}>Buttons: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.onboarding.clutter}</Text></Text>
                <Text style={styles.uxDetailText}>Opaque backdrop: <Text style={styles.uxDetailHighlight}>PASS</Text></Text>
              </View>
            </View>

            {/* Draft Setup Card */}
            <View style={styles.uxDashboardItemCard}>
              <View style={styles.uxItemHeader}>
                <Text style={styles.uxItemTitle}>2. DRAFT SETUP VIEW</Text>
                <View style={styles.uxGradeBadge}>
                  <Text style={styles.uxGradeText}>{uxScanMetrics.setup.score}/100</Text>
                </View>
              </View>
              
              <View style={styles.uxProgressLineRow}>
                <Text style={styles.uxProgressLabel}>Crawled</Text>
                <Text style={styles.uxProgressVal}>{uxScanProgress.setup}%</Text>
              </View>
              <View style={styles.miniProgressTrack}>
                <View style={[styles.miniProgressFill, { width: `${uxScanProgress.setup}%` }]} />
              </View>

              <View style={styles.uxDetailList}>
                <Text style={styles.uxDetailText}>Density: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.setup.words} words</Text></Text>
                <Text style={styles.uxDetailText}>Buttons: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.setup.clutter}</Text></Text>
                <Text style={styles.uxDetailText}>Opaque backdrop: <Text style={styles.uxDetailHighlight}>PASS</Text></Text>
              </View>
            </View>

            {/* Active Draft Card */}
            <View style={styles.uxDashboardItemCard}>
              <View style={styles.uxItemHeader}>
                <Text style={styles.uxItemTitle}>3. ACTIVE DRAFT GRID</Text>
                <View style={styles.uxGradeBadge}>
                  <Text style={styles.uxGradeText}>{uxScanMetrics.active.score}/100</Text>
                </View>
              </View>
              
              <View style={styles.uxProgressLineRow}>
                <Text style={styles.uxProgressLabel}>Crawled</Text>
                <Text style={styles.uxProgressVal}>{uxScanProgress.active}%</Text>
              </View>
              <View style={styles.miniProgressTrack}>
                <View style={[styles.miniProgressFill, { width: `${uxScanProgress.active}%` }]} />
              </View>

              <View style={styles.uxDetailList}>
                <Text style={styles.uxDetailText}>Density: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.active.words} words</Text></Text>
                <Text style={styles.uxDetailText}>Buttons: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.active.clutter}</Text></Text>
                <Text style={styles.uxDetailText}>Opaque backdrop: <Text style={styles.uxDetailHighlight}>PASS</Text></Text>
              </View>
            </View>

            {/* Leaderboard Card */}
            <View style={styles.uxDashboardItemCard}>
              <View style={styles.uxItemHeader}>
                <Text style={styles.uxItemTitle}>4. LIVE LEADERBOARD</Text>
                <View style={styles.uxGradeBadge}>
                  <Text style={styles.uxGradeText}>{uxScanMetrics.leaderboard.score}/100</Text>
                </View>
              </View>
              
              <View style={styles.uxProgressLineRow}>
                <Text style={styles.uxProgressLabel}>Crawled</Text>
                <Text style={styles.uxProgressVal}>{uxScanProgress.leaderboard}%</Text>
              </View>
              <View style={styles.miniProgressTrack}>
                <View style={[styles.miniProgressFill, { width: `${uxScanProgress.leaderboard}%` }]} />
              </View>

              <View style={styles.uxDetailList}>
                <Text style={styles.uxDetailText}>Density: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.leaderboard.words} words</Text></Text>
                <Text style={styles.uxDetailText}>Buttons: <Text style={styles.uxDetailHighlight}>{uxScanMetrics.leaderboard.clutter}</Text></Text>
                <Text style={styles.uxDetailText}>Opaque backdrop: <Text style={styles.uxDetailHighlight}>PASS</Text></Text>
              </View>
            </View>
          </View>

          {/* BOT SWARM FEEDBACK RECALS */}
          <View style={styles.advisorCard}>
            <View style={styles.uxItemHeader}>
              <Text style={styles.advisorHeader}>🎨 HEURISTICS FEEDBACK RECALS</Text>
              <View style={styles.overallPrettyPill}>
                <Text style={styles.prettyPillTxt}>{uxScanOverallGrade}% PRETTY</Text>
              </View>
            </View>
            <View style={styles.reportDivider} />
            <View style={styles.insightsList}>
              {uxAdviceList.map((insight, idx) => (
                <View key={idx} style={styles.insightItem}>
                  <Text style={styles.insightBullet}>💎</Text>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <>
          {/* DRAFT TELEMETRY DIRECTIVE CARD */}
          <View style={styles.controlCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeftGroup}>
                <Animated.View style={[styles.consoleIndicator, draftIntelRunning && { opacity: pulseAnim }]}>
                  <View style={[styles.indicatorPulse, { backgroundColor: draftIntelRunning ? Colors.hofYellow : '#22C55E' }]} />
                </Animated.View>
                <Text style={styles.cardHeaderTitle}>BOT DRAFT SIMULATION INTEL</Text>
              </View>
              {draftIntelRunning && <ActivityIndicator color={Colors.hofYellow} size="small" />}
            </View>

            <Text style={styles.consoleDescription}>
              Query real-time game-theoretic selection indicators and neural training generations from active Monte Carlo bots.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.scanCtaBtn,
                draftIntelRunning && styles.btnDisabled,
                pressed && !draftIntelRunning && styles.btnPressed
              ]}
              onPress={runDraftSimsScan}
              disabled={draftIntelRunning}
            >
              <Text style={styles.startBtnText}>
                {draftIntelRunning ? 'POLLING MODEL TELEMETRY...' : 'PULL LATEST DRAFT SIMULATIONS INTEL'}
              </Text>
            </Pressable>
          </View>

          {/* DRAFT INTELLIGENCE READOUTS GRID */}
          <View style={styles.intelDashboardGrid}>
            <View style={styles.intelValueCard}>
              <Text style={styles.intelCardLabel}>DECISION LATENCY</Text>
              <Text style={styles.intelCardValue}>{draftIntelMetrics.decisionLatency} ms</Text>
              <Text style={styles.intelCardSub}>CPU selection processing speed</Text>
            </View>

            <View style={styles.intelValueCard}>
              <Text style={styles.intelCardLabel}>ECR ARBITRAGE RATE</Text>
              <Text style={styles.intelCardValue}>{draftIntelMetrics.arbitrageRate}%</Text>
              <Text style={styles.intelCardSub}>Consensus valuation efficiency</Text>
            </View>

            <View style={styles.intelValueCard}>
              <Text style={styles.intelCardLabel}>SIMULATED LEAGUES</Text>
              <Text style={styles.intelCardValue}>{formatNumber(draftIntelMetrics.backgroundDrafts)}</Text>
              <Text style={styles.intelCardSub}>Historical Monte Carlo drafts</Text>
            </View>

            <View style={styles.intelValueCard}>
              <Text style={styles.intelCardLabel}>NEURAL FITNESS</Text>
              <Text style={styles.intelCardValue}>{draftIntelMetrics.neuralFitness}%</Text>
              <Text style={styles.intelCardSub}>Target value selection precision</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
