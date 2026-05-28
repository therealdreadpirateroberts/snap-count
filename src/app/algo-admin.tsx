import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useQaSimulations } from '@/hooks/useQaSimulations';
import { resetBotIntelligence, BOT_OPTIMIZED_PARAMS, getCurrentBotParams } from '@/store/_helpers';
import { ADMIN_ALLOWLIST } from '@/constants/admin';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const PARAMETERS_LIST = [
  { camp: 'Zero RB' as const, param: 'earlyRoundRB_penalty' as const },
  { camp: 'Zero RB' as const, param: 'earlyRoundWRTE_bonus' as const },
  { camp: 'Zero RB' as const, param: 'roundLimit' as const },
  
  { camp: 'Hero RB' as const, param: 'anchorRB_bonus' as const },
  { camp: 'Hero RB' as const, param: 'earlyRB2_penalty' as const },
  { camp: 'Hero RB' as const, param: 'roundLimitAnchor' as const },
  { camp: 'Hero RB' as const, param: 'roundLimitRB2' as const },
  
  { camp: 'Late QB/TE Focus' as const, param: 'earlyQB_penalty' as const },
  { camp: 'Late QB/TE Focus' as const, param: 'earlyTE_penalty' as const },
  { camp: 'Late QB/TE Focus' as const, param: 'roundLimit' as const },
  
  { camp: 'Balanced' as const, param: 'adpSteal_multiplier' as const },
  { camp: 'Balanced' as const, param: 'adpSteal_cap' as const },
  { camp: 'Balanced' as const, param: 'adpGapThreshold' as const },
  
  { camp: 'Robust RB' as const, param: 'earlyRB_bonus' as const },
  { camp: 'Robust RB' as const, param: 'earlyQBTEWR_penalty' as const },
  { camp: 'Robust RB' as const, param: 'roundLimit' as const },
  
  { camp: 'Elite QB/TE Premium' as const, param: 'earlyQB_bonus' as const },
  { camp: 'Elite QB/TE Premium' as const, param: 'earlyTE_bonus' as const },
  { camp: 'Elite QB/TE Premium' as const, param: 'roundLimit' as const }
];

function AlgoAdminContent() {
  const router = useRouter();
  const Colors = useColors();
  const { user, isInitialized } = useAuthStore();

  const {
    isRunning,
    progress,
    logs,
    runBotTrainingSession,
  } = useQaSimulations();

  const [lastTraining, setLastTraining] = useState<string>('never');
  const [currentParams, setCurrentParams] = useState(getCurrentBotParams());

  // Deep link gate protection
  useEffect(() => {
    if (isInitialized && (!user || !ADMIN_ALLOWLIST.includes(user.email))) {
      router.replace('/');
    }
  }, [isInitialized, user]);

  const updateLastTrainingTime = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem('mockmaxxing_last_bot_training');
      if (val) {
        try {
          const date = new Date(val);
          setLastTraining(date.toLocaleString());
        } catch (e) {
          setLastTraining('never');
        }
      } else {
        setLastTraining('never');
      }
    }
  };

  useEffect(() => {
    updateLastTrainingTime();
  }, []);

  useEffect(() => {
    setCurrentParams(getCurrentBotParams());
    if (!isRunning) {
      updateLastTrainingTime();
    }
  }, [isRunning]);

  // Reactive updates for parameter mutations while training runs
  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentParams(getCurrentBotParams());
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const handleResetBotIntelligence = () => {
    const message = "This will restore factory default bot parameters. Continue?";
    if (Platform.OS === 'web') {
      const confirmReset = window.confirm(message);
      if (confirmReset) {
        resetBotIntelligence();
        setCurrentParams(getCurrentBotParams());
        updateLastTrainingTime();
        window.alert("Bot intelligence reset to defaults.");
      }
    } else {
      Alert.alert(
        "Reset Bot Intelligence",
        message,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Reset", 
            style: "destructive", 
            onPress: () => {
              resetBotIntelligence();
              setCurrentParams(getCurrentBotParams());
              updateLastTrainingTime();
              Alert.alert("Success", "Bot intelligence reset to defaults.");
            } 
          }
        ]
      );
    }
  };

  const handleStartTraining = () => {
    runBotTrainingSession();
  };

  const formatParamValue = (param: string, val: number) => {
    if (param === 'adpSteal_multiplier') {
      return `${val.toFixed(2)}x`;
    }
    if (param.includes('Limit') || param.includes('roundLimit')) {
      return `Round ${Math.round(val)}`;
    }
    if (param === 'adpGapThreshold') {
      return `${Math.round(val)} picks`;
    }
    if (param === 'earlyRoundWRTE_bonus' || param.includes('bonus') || param.includes('penalty')) {
      if (val > 0) {
        return `+${val.toFixed(2)}`;
      }
      return val.toFixed(2);
    }
    return val.toString();
  };

  const styles = createStyles(Colors);

  // Guard view during redirect transition
  if (!user || !ADMIN_ALLOWLIST.includes(user.email)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.pylonOrange} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        <AppHeader
          title="ALGO ADMIN"
          subtitle="Bot Parameter Configuration & Calibration"
          showBack={true}
          backText="SETTINGS"
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SECTION 1: BOT TRAINING */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>BOT TRAINING</Text>
            <Text style={styles.sectionSubCopy}>
              Run a training session to evolve bot parameters. Sessions are bounded; results persist across sessions.
            </Text>

            <View style={styles.timestampRow}>
              <Text style={styles.timestampLabel}>
                {lastTraining !== 'never' ? `Last trained: ${lastTraining}` : 'Last trained: never'}
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Pressable
                onPress={handleStartTraining}
                disabled={isRunning}
                style={[
                  styles.primaryButton,
                  isRunning && styles.disabledButton
                ]}
              >
                <Text style={styles.primaryButtonText}>START TRAINING SESSION</Text>
              </Pressable>

              <Pressable
                onPress={handleResetBotIntelligence}
                disabled={isRunning}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>RESET BOT INTELLIGENCE</Text>
              </Pressable>
            </View>

            {/* PROGRESS INDICATOR */}
            {isRunning && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress * 100)}% Complete</Text>
              </View>
            )}

            {/* LOG STREAM PANEL */}
            {logs && logs.length > 0 && (
              <View style={styles.logStreamPanel}>
                <Text style={styles.logPanelTitle}>Live Training Logs</Text>
                <ScrollView 
                  nestedScrollEnabled={true} 
                  style={styles.logScrollView}
                  contentContainerStyle={styles.logScrollContent}
                >
                  {logs.slice(-15).map((log, index) => (
                    <Text key={index} style={styles.logText}>{log}</Text>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* SECTION 2: BOT PARAMETERS */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>BOT PARAMETERS</Text>
            <Text style={styles.sectionSubCopy}>
              Current bot parameter values compared to factory defaults. Drift shows how far training has moved each parameter from baseline.
            </Text>

            {/* PARAMETERS TABLE */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, { width: '16%' }]}>Archetype</Text>
                <Text style={[styles.tableHeaderCell, { width: '34%' }]}>Parameter</Text>
                <Text style={[styles.tableHeaderCell, { width: '16%' }]}>Baseline</Text>
                <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Current</Text>
                <Text style={[styles.tableHeaderCell, { width: '16%', textAlign: 'right' }]}>Drift %</Text>
              </View>

              {PARAMETERS_LIST.map(({ camp, param }, index) => {
                const baseline = (BOT_OPTIMIZED_PARAMS as any)[camp][param];
                const current = (currentParams as any)[camp]?.[param] ?? baseline;
                const driftPct = baseline !== 0 ? ((current - baseline) / baseline) * 100 : 0;
                
                let driftColor: string = Colors.slate;
                let driftSign = '';
                if (Math.abs(driftPct) > 0.05) {
                  if (driftPct > 0) {
                    driftColor = Colors.status.success;
                    driftSign = '+';
                  } else {
                    driftColor = Colors.status.danger;
                  }
                }

                return (
                  <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
                    <Text style={[styles.tableCellBody, { width: '16%', fontWeight: '600' }]} numberOfLines={1}>
                      {camp}
                    </Text>
                    <Text style={[styles.tableCellMono, { width: '34%', fontSize: 9 }]} numberOfLines={1}>
                      {param}
                    </Text>
                    <Text style={[styles.tableCellMono, { width: '16%', color: Colors.slate }]}>
                      {formatParamValue(param, baseline)}
                    </Text>
                    <Text style={[styles.tableCellMono, { width: '18%', fontWeight: '600', paddingRight: 8 }]}>
                      {formatParamValue(param, current)}
                    </Text>
                    <Text style={[styles.tableCellMono, { width: '16%', textAlign: 'right', color: driftColor, fontWeight: 'bold' }]}>
                      {Math.abs(driftPct) <= 0.05 ? '0.0%' : `${driftSign}${driftPct.toFixed(1)}%`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
      <AppTabBar />
    </View>
  );
}

export default function AlgoAdminScreen() {
  return (
    <ErrorBoundary>
      <AlgoAdminContent />
    </ErrorBoundary>
  );
}

function createStyles(Colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primaryAccent,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.primaryAccent,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.four,
      paddingTop: Spacing.four,
      paddingBottom: 140,
      maxWidth: MaxContentWidth,
      alignSelf: 'center',
      width: '100%',
      gap: Spacing.four,
    },
    sectionCard: {
      backgroundColor: Colors.liftedCanvas,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 12,
      padding: Spacing.four,
      gap: Spacing.three,
      ...Colors.shadows,
    },
    sectionHeader: {
      fontFamily: Fonts.headings,
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
      letterSpacing: 0.5,
    },
    sectionSubCopy: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.slate,
      lineHeight: 16,
    },
    timestampRow: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.midGray,
      paddingBottom: Spacing.two,
      marginBottom: Spacing.one,
    },
    timestampLabel: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.slate,
    },
    buttonRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.three,
      marginTop: Spacing.one,
    },
    primaryButton: {
      backgroundColor: Colors.pylonOrange,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.three,
      borderRadius: 8,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      minWidth: 180,
    },
    primaryButtonText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    secondaryButton: {
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.three,
      borderRadius: 8,
      minHeight: 44,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      minWidth: 180,
    },
    secondaryButtonText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
      letterSpacing: 0.5,
    },
    disabledButton: {
      opacity: 0.5,
    },
    progressContainer: {
      gap: Spacing.one,
      marginTop: Spacing.one,
    },
    progressBarTrack: {
      height: 10,
      backgroundColor: Colors.midGray,
      borderRadius: 5,
      overflow: 'hidden',
      width: '100%',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: Colors.hofYellow,
      borderRadius: 5,
    },
    progressText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
      textAlign: 'right',
    },
    logStreamPanel: {
      backgroundColor: Colors.deepGraphite,
      borderRadius: 8,
      padding: Spacing.three,
      gap: Spacing.two,
      marginTop: Spacing.two,
    },
    logPanelTitle: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    logScrollView: {
      height: 150,
    },
    logScrollContent: {
      gap: Spacing.one,
    },
    logText: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      color: Colors.primaryAccent,
      lineHeight: 13,
    },
    tableContainer: {
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 8,
      overflow: 'hidden',
      marginTop: Spacing.two,
    },
    tableHeaderRow: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      paddingVertical: 8,
      paddingHorizontal: Spacing.three,
      alignItems: 'center',
      borderBottomWidth: 1.5,
      borderBottomColor: Colors.midGray,
    },
    tableHeaderCell: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: Spacing.three,
      alignItems: 'center',
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.midGray,
    },
    tableRowAlt: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    tableCellBody: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.obsidianBlack,
    },
    tableCellMono: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.obsidianBlack,
    },
  });
}
