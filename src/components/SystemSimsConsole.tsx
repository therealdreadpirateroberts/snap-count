import React from 'react';
import { View, Text, Pressable, Animated, ActivityIndicator } from 'react-native';

interface SystemSimsConsoleProps {
  styles: any;
  Colors: any;
  isRunning: boolean;
  selectedPreset: 'UI_AUDIT' | 'STRATEGY_OPT' | 'ROSTER_STRESS' | 'DARK_MODE_QA';
  setSelectedPreset: (preset: 'UI_AUDIT' | 'STRATEGY_OPT' | 'ROSTER_STRESS' | 'DARK_MODE_QA') => void;
  handleStartSimulation: () => void;
  handleClearCohorts: () => void;
  progress: number;
  strategyWinRates: { [camp: string]: number };
  pulseAnim: Animated.Value;
}

export default function SystemSimsConsole({
  styles,
  Colors,
  isRunning,
  selectedPreset,
  setSelectedPreset,
  handleStartSimulation,
  handleClearCohorts,
  progress,
  strategyWinRates,
  pulseAnim,
}: SystemSimsConsoleProps) {
  return (
    <View style={styles.tabContentBlock}>
      
      {/* SIMULATION CARD */}
      <View style={styles.controlCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeftGroup}>
            <Animated.View style={[styles.consoleIndicator, isRunning && { opacity: pulseAnim }]}>
              <View style={[styles.indicatorPulse, { backgroundColor: isRunning ? Colors.hofYellow : '#22C55E' }]} />
            </Animated.View>
            <Text style={styles.cardHeaderTitle}>MONTE CARLO SIMULATOR CONTROLS</Text>
          </View>
          {isRunning && <ActivityIndicator color={Colors.hofYellow} size="small" />}
        </View>

        <Text style={styles.consoleDescription}>
          Trigger parallel CPU-draft engines to verify draft stability, genetics training, and scoring rules compliance.
        </Text>

        {/* Presets Grid */}
        <View style={styles.presetsGrid}>
          <Pressable
            style={[
              styles.presetCard,
              selectedPreset === 'UI_AUDIT' && styles.presetCardActive,
              isRunning && styles.presetCardDisabled
            ]}
            onPress={() => !isRunning && setSelectedPreset('UI_AUDIT')}
            disabled={isRunning}
          >
            <Text style={styles.presetEmoji}>🧪</Text>
            <Text style={styles.presetName}>UI Concurrency</Text>
            <Text style={styles.presetSummary}>Simulates 1,000 parallel sessions. Asserts HIG boundaries.</Text>
          </Pressable>

          <Pressable
            style={[
              styles.presetCard,
              selectedPreset === 'STRATEGY_OPT' && styles.presetCardActive,
              isRunning && styles.presetCardDisabled
            ]}
            onPress={() => !isRunning && setSelectedPreset('STRATEGY_OPT')}
            disabled={isRunning}
          >
            <Text style={styles.presetEmoji}>🧠</Text>
            <Text style={styles.presetName}>Strategy optimizer</Text>
            <Text style={styles.presetSummary}>Runs 2,500 parallel Monte Carlo drafts to verify genetic weights.</Text>
          </Pressable>

          <Pressable
            style={[
              styles.presetCard,
              selectedPreset === 'ROSTER_STRESS' && styles.presetCardActive,
              isRunning && styles.presetCardDisabled
            ]}
            onPress={() => !isRunning && setSelectedPreset('ROSTER_STRESS')}
            disabled={isRunning}
          >
            <Text style={styles.presetEmoji}>🛡️</Text>
            <Text style={styles.presetName}>Roster Stress</Text>
            <Text style={styles.presetSummary}>Asserts 100% positional constraints compliance across drafts.</Text>
          </Pressable>

          <Pressable
            style={[
              styles.presetCard,
              selectedPreset === 'DARK_MODE_QA' && styles.presetCardActive,
              isRunning && styles.presetCardDisabled
            ]}
            onPress={() => !isRunning && setSelectedPreset('DARK_MODE_QA')}
            disabled={isRunning}
          >
            <Text style={styles.presetEmoji}>🌙</Text>
            <Text style={styles.presetName}>Dark Mode QA</Text>
            <Text style={styles.presetSummary}>Runs 5,000 UX cycles over 50 users in Dark Mode. Chart improvement.</Text>
          </Pressable>
        </View>

        {/* Action Row */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              styles.startBtn,
              isRunning && styles.btnDisabled,
              pressed && !isRunning && styles.btnPressed
            ]}
            onPress={handleStartSimulation}
            disabled={isRunning}
          >
            <Text style={styles.startBtnText}>
              {isRunning ? 'RUNNING TEST DIRECTIVE...' : selectedPreset === 'UI_AUDIT' ? 'RUN 1,000 USER SITE SIMULATION' : selectedPreset === 'STRATEGY_OPT' ? 'RUN 2,500 STRATEGY SIMULATIONS' : selectedPreset === 'ROSTER_STRESS' ? 'RUN 1,000 ROSTER STRESS TESTS' : 'RUN 5,000 DARK MODE UX CYCLES'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.ctaBtn,
              styles.clearBtn,
              isRunning && styles.btnDisabled,
              pressed && !isRunning && styles.btnPressed
            ]}
            onPress={handleClearCohorts}
            disabled={isRunning}
          >
            <Text style={styles.clearBtnText}>CLEAR STANDINGS</Text>
          </Pressable>
        </View>

        {/* Scenario Progress */}
        {progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>SCENARIO RUN PROGRESS</Text>
              <Text style={styles.progressVal}>{Math.round(progress * 100)}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
          </View>
        )}
      </View>

      {/* COHORT STRATEGY WIN-RATES */}
      <View style={styles.dashboardCard}>
        <Text style={styles.cardHeaderTitle}>COHORT STRATEGY WIN-RATES</Text>
        <Text style={styles.cardHeaderSubtitle}>Outcome profiles across different machine learning agent configurations</Text>
        
        <View style={styles.strategyList}>
          {Object.entries(strategyWinRates).map(([camp, rate]) => (
            <View key={camp} style={styles.strategyRow}>
              <Text style={styles.strategyLabel}>{camp}</Text>
              <View style={styles.strategyBarTrack}>
                <View style={[styles.strategyBarFill, { width: `${rate}%` }]} />
              </View>
              <Text style={styles.strategyRateVal}>{rate}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
