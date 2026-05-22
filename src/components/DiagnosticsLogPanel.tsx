import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

interface DiagnosticsLogPanelProps {
  styles: any;
  isRunning: boolean;
  uxScanRunning: boolean;
  draftIntelRunning: boolean;
  logs: string[];
}

export default function DiagnosticsLogPanel({
  styles,
  isRunning,
  uxScanRunning,
  draftIntelRunning,
  logs,
}: DiagnosticsLogPanelProps) {
  const consoleEndRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      setTimeout(() => {
        consoleEndRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [logs]);

  return (
    <View style={styles.consolePanelCard}>
      <View style={styles.consoleHeaderRow}>
        <View style={styles.windowControls}>
          <View style={[styles.windowControlDot, { backgroundColor: '#ef4444' }]} />
          <View style={[styles.windowControlDot, { backgroundColor: '#fbbf24' }]} />
          <View style={[styles.windowControlDot, { backgroundColor: '#22c55e' }]} />
        </View>
        <Text style={styles.consoleTitleText}>diagnostics.log</Text>
        <Text style={styles.consoleStatusText}>
          {(isRunning || uxScanRunning || draftIntelRunning) ? 'RUNNING' : 'STANDBY'}
        </Text>
      </View>

      <ScrollView
        ref={consoleEndRef}
        style={styles.terminalScroll}
        contentContainerStyle={styles.terminalContent}
        nestedScrollEnabled={true}
      >
        {logs.length === 0 ? (
          <Text style={styles.emptyLogsText}>
            Console standby. Activate any test scan to stream dynamic heuristics.
          </Text>
        ) : (
          logs.map((log, index) => (
            <Text key={index} style={styles.logLineText}>
              {log}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}
