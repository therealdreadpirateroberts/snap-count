import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface FeaturedSlotConsoleProps {
  styles: any;
  featuredSlot1Key: string;
  setFeaturedSlot1Key: (key: string) => void;
  triggerHaptic: () => void;
  addLog: (msg: string) => void;
}

export default function FeaturedSlotConsole({
  styles,
  featuredSlot1Key,
  setFeaturedSlot1Key,
  triggerHaptic,
  addLog,
}: FeaturedSlotConsoleProps) {
  return (
    <View style={[styles.controlCard, { borderColor: '#bea98e', borderWidth: 1.5, marginTop: 20 }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeftGroup}>
          <View style={styles.consoleIndicator}>
            <View style={[styles.indicatorPulse, { backgroundColor: '#bea98e' }]} />
          </View>
          <Text style={[styles.cardHeaderTitle, { color: '#bea98e', fontFamily: 'Oswald' }]}>
            👑 EXECUTIVE PRIME 1A TILE PROMOTION CONSOLE
          </Text>
        </View>
      </View>

      <Text style={styles.consoleDescription}>
        Select which primary tool or application feature is promoted to the prime <Text style={{ color: '#bea98e', fontWeight: 'bold' }}>Slot 1 (Prime 1A Position)</Text> on the homepage. Homepage tiles are capped at 10 features, with news feeds completely suppressed.
      </Text>

      <View style={styles.executiveGrid}>
        {[
          { id: 'mock-draft', label: '🏈 Mock Draft Suite', desc: 'Elite Real-time Neural Draft Swarm' },
          { id: 'cheat-sheets', label: '📝 Cheat Sheets Builder', desc: 'Custom ECR/ADP Board Creator' },
          { id: 'leaderboard-stats', label: '🏆 Draft Leaderboards', desc: 'GPA Grades & Past Run Analytics' },
          { id: 'trade-center', label: '📬 Trade Advisor', desc: 'Live Simulated AI Trade Engine' },
          { id: 'scarcity-wizard', label: '📊 Scarcity Scanners', desc: 'Positional Scarcity Calibration' },
          { id: 'simulation-lab', label: '⚡ Simulation Lab', desc: 'Monte Carlo Genetic Harness' },
          { id: 'roster-recap', label: '🔍 Roster Recap', desc: 'Post-Draft Telemetry GPA Grade' },
          { id: 'top250', label: '📈 Top 250 Matrix', desc: 'Expert Rankings Density Comparer' },
          { id: 'user-settings', label: '⚙️ User Preferences', desc: 'System Config & Account Controls' },
          { id: 'expert-ecr', label: '🏈 Expert Rankings', desc: 'Consensus ADP Scarcity Index' }
        ].map((item) => {
          const isPinned = featuredSlot1Key === item.id;
          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.executiveOptionCard,
                isPinned && styles.executiveOptionCardPinned,
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => {
                triggerHaptic();
                setFeaturedSlot1Key(item.id);
                addLog(`👑 Executive Decision: Promoted feature "${item.label.toUpperCase()}" to homepage Slot 1 (Prime 1A Position).`);
              }}
            >
              <View style={styles.executiveOptionHeader}>
                <Text style={[styles.executiveOptionLabel, isPinned && styles.executiveOptionLabelPinned]}>
                  {item.label}
                </Text>
                <View style={[styles.pinnedBadge, isPinned ? styles.pinnedBadgeActive : styles.pinnedBadgeInactive]}>
                  <Text style={[styles.pinnedBadgeText, isPinned && styles.pinnedBadgeTextActive]}>
                    {isPinned ? 'PINNED' : 'UNPINNED'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.executiveOptionDesc, isPinned && styles.executiveOptionDescPinned]}>
                {item.desc}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
