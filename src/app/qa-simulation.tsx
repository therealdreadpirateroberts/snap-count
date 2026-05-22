import React from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/constants/theme';
import { useQaSimulations } from '@/hooks/useQaSimulations';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import BackgroundTexture from '@/components/BackgroundTexture';
import FeaturedSlotConsole from '@/components/FeaturedSlotConsole';
import TelemetryCharts from '@/components/TelemetryCharts';
import SystemSimsConsole from '@/components/SystemSimsConsole';
import BotArmyConsole from '@/components/BotArmyConsole';
import RecentActivityTable from '@/components/RecentActivityTable';
import DiagnosticsLogPanel from '@/components/DiagnosticsLogPanel';
import { qaStyles as styles } from './qa-simulation.styles';

function QaSimulationContent() {
  const Colors = useColors();
  const router = useRouter();
  
  const {
    featuredSlot1Key,
    setFeaturedSlot1Key,
    activeTab,
    botArmySubTab,
    setBotArmySubTab,
    isRunning,
    selectedPreset,
    setSelectedPreset,
    progress,
    logs,
    successCount,
    failCount,
    explorationCount,
    leaderboardCount,
    simsPerSec,
    concurrencyRate,
    strategyWinRates,
    advisorInsights,
    uxScanRunning,
    uxScanProgress,
    uxScanOverallGrade,
    uxScanMetrics,
    uxAdviceList,
    draftIntelRunning,
    draftIntelProgress,
    draftIntelMetrics,
    pulseAnim,
    triggerHaptic,
    handleStartSimulation,
    handleTabChange,
    handleClearCohorts,
    runAllAudits,
    formatNumber,
  } = useQaSimulations();

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* PREMIUM SPLIT PANE NAVIGATION SYSTEM */}
        <View style={styles.mainSplitWrapper}>
          
          {/* SIDEBAR NAVIGATION COLUMN (Web/Desktop Viewports) */}
          {Platform.OS === 'web' && (
            <View style={styles.sidebarColumn}>
              <View style={styles.sidebarBrand}>
                <View style={styles.brandDot} />
                <Text style={styles.brandText}>MOCKMAXXING</Text>
              </View>

              <View style={styles.sidebarSectionTitle}>TEAMS & AUDITS</View>
              
              <View style={styles.sidebarLinksContainer}>
                <Pressable
                  style={[styles.sidebarLink, activeTab === 'SYSTEM_SIMS' && styles.sidebarLinkActive]}
                  onPress={() => handleTabChange('SYSTEM_SIMS')}
                >
                  <Text style={styles.sidebarLinkEmoji}>🏈</Text>
                  <Text style={[styles.sidebarLinkText, activeTab === 'SYSTEM_SIMS' && styles.sidebarLinkTextActive]}>
                    Simulations
                  </Text>
                  {isRunning && <View style={styles.activePill} />}
                </Pressable>

                <Pressable
                  style={[styles.sidebarLink, activeTab === 'BOT_ARMY' && styles.sidebarLinkActive]}
                  onPress={() => handleTabChange('BOT_ARMY')}
                >
                  <Text style={styles.sidebarLinkEmoji}>🧠</Text>
                  <Text style={[styles.sidebarLinkText, activeTab === 'BOT_ARMY' && styles.sidebarLinkTextActive]}>
                    Bot Swarms
                  </Text>
                  {(uxScanRunning || draftIntelRunning) && <View style={styles.activePill} />}
                </Pressable>

                <View style={styles.sidebarSectionTitle}>DEV CONTROLS</View>

                <Pressable
                  style={styles.sidebarLink}
                  onPress={() => { triggerHaptic(); }}
                >
                  <Text style={styles.sidebarLinkEmoji}>⚙️</Text>
                  <Text style={styles.sidebarLinkText}>Settings</Text>
                </Pressable>

                <Pressable
                  style={styles.sidebarLink}
                  onPress={() => { triggerHaptic(); }}
                >
                  <Text style={styles.sidebarLinkEmoji}>❓</Text>
                  <Text style={styles.sidebarLinkText}>Help Center</Text>
                </Pressable>
              </View>

              {/* SIDEBAR FOOTER USER CARD */}
              <View style={styles.sidebarCoachCard}>
                <View style={styles.coachAvatarCircle}>
                  <Text style={styles.coachAvatarText}>C</Text>
                </View>
                <View style={styles.coachCardInfo}>
                  <Text style={styles.coachCardName}>Coach Dashboard</Text>
                  <Text style={styles.coachCardFormat}>PPR • PICK #5</Text>
                </View>
              </View>
            </View>
          )}

          {/* MAIN TELEMETRY CONTENT BOARD */}
          <View style={styles.rightWorkspace}>
            
            {/* COMPACT BREADCRUMB HEADER */}
            <View style={styles.workspaceHeader}>
              <View style={styles.headerTitleArea}>
                <Pressable onPress={() => router.push('/')} style={styles.backLinkBtn}>
                  <Text style={styles.backLinkTxt}>🏠 HOME</Text>
                </Pressable>
                <Text style={styles.breadDivider}>/</Text>
                <Text style={styles.breadcrumbActive}>CEO EXECUTIVE & IT CONTROL CENTER</Text>
              </View>
              
              <View style={styles.headerRightActions}>
                <View style={styles.shieldBadge}>
                  <View style={styles.shieldDot} />
                  <Text style={styles.shieldText}>ACTIVE SHIELD</Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryRunBtn,
                    pressed && styles.btnPressed
                  ]}
                  onPress={runAllAudits}
                >
                  <Text style={styles.primaryRunBtnText}>RUN ALL AUDITS</Text>
                </Pressable>
              </View>
            </View>

            <ScrollView 
              style={styles.scrollArea} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              
              {/* HALO LAB STYLE METRICS OVERVIEW STRIP */}
              <View style={styles.metricsStrip}>
                
                {/* Metric 1 */}
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>TOTAL COHORTS RUN</Text>
                    <View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                      <Text style={[styles.trendText, { color: '#22C55E' }]}>+12.4% ▲</Text>
                    </View>
                  </View>
                  <Text style={styles.metricValue}>{formatNumber(successCount + failCount + 286600)}</Text>
                  <Text style={styles.metricComparison}>vs last week baseline</Text>
                </View>

                {/* Metric 2 */}
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>SUCCESS RATE</Text>
                    <View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                      <Text style={[styles.trendText, { color: '#22C55E' }]}>+0.5% ▲</Text>
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: '#22C55E' }]}>
                    {successCount + failCount > 0 ? `${Math.round((successCount / (successCount + failCount)) * 100)}%` : '100%'}
                  </Text>
                  <Text style={styles.metricComparison}>100% z-index safety</Text>
                </View>

                {/* Metric 3 */}
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>AESTHETICS GRADE</Text>
                    <View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                      <Text style={[styles.trendText, { color: '#22C55E' }]}>+1.8% ▲</Text>
                    </View>
                  </View>
                  <Text style={[styles.metricValue, { color: Colors.hofYellow }]}>{uxScanOverallGrade}%</Text>
                  <Text style={styles.metricComparison}>Heuristics Rating: PRETTY</Text>
                </View>

                {/* Metric 4 */}
                <View style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <Text style={styles.metricLabel}>ECR ARBITRAGE</Text>
                    <View style={[styles.trendBadge, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                      <Text style={[styles.trendText, { color: '#22C55E' }]}>+3.2% ▲</Text>
                    </View>
                  </View>
                  <Text style={styles.metricValue}>{draftIntelMetrics.arbitrageRate}%</Text>
                  <Text style={styles.metricComparison}>Genetic exploitation efficiency</Text>
                </View>
              </View>

              {/* DATA VISUALIZATION GRAPH ROW (Line & Donut charts side-by-side) */}
              <TelemetryCharts
                styles={styles}
                Colors={Colors}
                successCount={successCount}
                failCount={failCount}
                draftIntelMetrics={draftIntelMetrics}
                uxScanOverallGrade={uxScanOverallGrade}
              />

              {/* 👑 EXECUTIVE FEATURE PROMOTION CONSOLE */}
              <FeaturedSlotConsole
                styles={styles}
                featuredSlot1Key={featuredSlot1Key}
                setFeaturedSlot1Key={setFeaturedSlot1Key}
                triggerHaptic={triggerHaptic}
                addLog={() => {}}
              />

              {/* SEGMENTED TAB SELECTOR (Toggles Simulation Harness vs. Bot Army Controls) */}
              <View style={styles.segmentContainer}>
                <Pressable
                  style={[styles.segmentBtn, activeTab === 'SYSTEM_SIMS' && styles.segmentBtnActive]}
                  onPress={() => handleTabChange('SYSTEM_SIMS')}
                >
                  <Text style={[styles.segmentText, activeTab === 'SYSTEM_SIMS' && styles.segmentTextActive]}>
                    ⚡ SYSTEM SIMULATION HARNESS
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.segmentBtn, activeTab === 'BOT_ARMY' && styles.segmentBtnActive]}
                  onPress={() => handleTabChange('BOT_ARMY')}
                >
                  <Text style={[styles.segmentText, activeTab === 'BOT_ARMY' && styles.segmentTextActive]}>
                    🧠 BOT ARMY CRAWLERS
                  </Text>
                </Pressable>
              </View>

              {/* --- ACTIVE TAB RENDER ENGINE --- */}
              {activeTab === 'SYSTEM_SIMS' ? (
                <SystemSimsConsole
                  styles={styles}
                  Colors={Colors}
                  isRunning={isRunning}
                  selectedPreset={selectedPreset}
                  setSelectedPreset={setSelectedPreset}
                  handleStartSimulation={handleStartSimulation}
                  handleClearCohorts={handleClearCohorts}
                  progress={progress}
                  strategyWinRates={strategyWinRates}
                  pulseAnim={pulseAnim}
                />
              ) : (
                <BotArmyConsole
                  styles={styles}
                  Colors={Colors}
                  botArmySubTab={botArmySubTab}
                  setBotArmySubTab={setBotArmySubTab}
                  uxScanRunning={uxScanRunning}
                  runUxAestheticsScan={handleStartSimulation}
                  uxScanProgress={uxScanProgress}
                  uxScanMetrics={uxScanMetrics}
                  uxScanOverallGrade={uxScanOverallGrade}
                  uxAdviceList={uxAdviceList}
                  draftIntelRunning={draftIntelRunning}
                  runDraftSimsScan={handleStartSimulation}
                  draftIntelMetrics={draftIntelMetrics}
                  pulseAnim={pulseAnim}
                  triggerHaptic={triggerHaptic}
                  formatNumber={formatNumber}
                />
              )}

              {/* RECENT CRAWLER ACTIVITY TABLE & DIAGNOSTICS LOG PANEL GRID */}
              <View style={styles.activityGridRow}>
                
                {/* Recent Activity Table (Left Panel) */}
                <RecentActivityTable styles={styles} />

                {/* Diagnostics Log scroll stream (Right Panel) */}
                <DiagnosticsLogPanel
                  styles={styles}
                  isRunning={isRunning}
                  uxScanRunning={uxScanRunning}
                  draftIntelRunning={draftIntelRunning}
                  logs={logs}
                />
              </View>

              {/* FOOTER BINDING BRANDING */}
              <View style={styles.footerBranding}>
                <Text style={styles.footerText}>MOCKMAXXING CEO EXECUTIVE & IT CONTROL CENTER</Text>
                <Text style={styles.footerVersion}>V2.5 • NFL 2026 ANALYTICS BINDING</Text>
              </View>

            </ScrollView>
          </View>

        </View>

      </SafeAreaView>
    </View>
  );
}

export default function QaSimulationScreen() {
  return (
    <ErrorBoundary>
      <QaSimulationContent />
    </ErrorBoundary>
  );
}
