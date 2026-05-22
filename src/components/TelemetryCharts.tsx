import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

interface TelemetryChartsProps {
  styles: any;
  Colors: any;
  successCount: number;
  failCount: number;
  draftIntelMetrics: {
    arbitrageRate: number;
    backgroundDrafts: number;
    decisionLatency: number;
    neuralFitness: number;
    trainingGeneration: number;
    activeAnomalies: number;
  };
  uxScanOverallGrade: number;
}

export default function TelemetryCharts({
  styles,
  Colors,
  successCount,
  failCount,
  draftIntelMetrics,
  uxScanOverallGrade,
}: TelemetryChartsProps) {
  return (
    <View style={styles.chartsGridRow}>
      {/* 1. Continuous Performance & Latency Line Chart */}
      <View style={styles.chartPanelCard}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelTitle}>PERFORMANCE LATENCY & ACCURACY TREND</Text>
            <Text style={styles.panelSubtitle}>Consensus arbitrage capture vs CPU selection cycles</Text>
          </View>
          <View style={styles.legendIndicatorRow}>
            <View style={styles.legendDotItem}>
              <View style={[styles.legendIndicatorDot, { backgroundColor: Colors.hofYellow }]} />
              <Text style={styles.legendIndicatorLabel}>Arbitrage</Text>
            </View>
            <View style={styles.legendDotItem}>
              <View style={[styles.legendIndicatorDot, { backgroundColor: '#60a5fa' }]} />
              <Text style={styles.legendIndicatorLabel}>Latency</Text>
            </View>
          </View>
        </View>

        <View style={styles.svgChartContainer}>
          <Svg width="100%" height={170} viewBox="0 0 320 170" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="yellowAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={Colors.hofYellow} stopOpacity={0.25} />
                <Stop offset="100%" stopColor={Colors.hofYellow} stopOpacity={0.0} />
              </LinearGradient>
              <LinearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#60a5fa" stopOpacity={0.15} />
                <Stop offset="100%" stopColor="#60a5fa" stopOpacity={0.0} />
              </LinearGradient>
            </Defs>
            
            {/* Grid Lines */}
            <Line x1="10" y1="30" x2="310" y2="30" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <Line x1="10" y1="70" x2="310" y2="70" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <Line x1="10" y1="110" x2="310" y2="110" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <Line x1="10" y1="140" x2="310" y2="140" stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

            {/* Area 2: Latency underlay */}
            <Path
              d="M 10 140 C 50 120, 90 90, 130 110 S 210 50, 250 80 S 290 40, 310 30 L 310 140 Z"
              fill="url(#blueAreaGradient)"
            />

            {/* Area 1: Arbitrage underlay */}
            <Path
              d="M 10 140 C 40 100, 80 50, 120 70 S 200 30, 240 45 S 280 20, 310 15 L 310 140 Z"
              fill="url(#yellowAreaGradient)"
            />

            {/* Curve 2: Latency line */}
            <Path
              d="M 10 140 C 50 120, 90 90, 130 110 S 210 50, 250 80 S 290 40, 310 30"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2.5"
            />

            {/* Curve 1: Arbitrage line */}
            <Path
              d="M 10 140 C 40 100, 80 50, 120 70 S 200 30, 240 45 S 280 20, 310 15"
              fill="none"
              stroke={Colors.hofYellow}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Point Nodes */}
            <Circle cx="120" cy="70" r="5" fill="#18181b" stroke={Colors.hofYellow} strokeWidth="2.5" />
            <Circle cx="200" cy="30" r="5" fill="#18181b" stroke={Colors.hofYellow} strokeWidth="2.5" />
            <Circle cx="310" cy="15" r="5" fill="#18181b" stroke={Colors.hofYellow} strokeWidth="2.5" />

            <Circle cx="130" cy="110" r="4" fill="#18181b" stroke="#60a5fa" strokeWidth="2" />
            <Circle cx="210" cy="50" r="4" fill="#18181b" stroke="#60a5fa" strokeWidth="2" />
          </Svg>
        </View>
      </View>

      {/* 2. Swarm Cohort Distribution Donut Chart */}
      <View style={styles.chartPanelCard}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.panelTitle}>BOT ARMY SWARM COHORT DISTRIBUTION</Text>
            <Text style={styles.panelSubtitle}>Allocation of our 50,000 active testing agents</Text>
          </View>
        </View>

        <View style={styles.donutChartContainer}>
          {/* Donut graphic */}
          <View style={styles.donutWrapper}>
            <Svg width={120} height={120} viewBox="0 0 120 120">
              {/* Circle Base track */}
              <Circle cx="60" cy="60" r="45" stroke="#1f2937" strokeWidth="12" fill="none" />
              
              {/* Segment 1: Onboarding 20% */}
              <Circle
                cx="60"
                cy="60"
                r="45"
                stroke="#f87171"
                strokeWidth="12"
                strokeDasharray="56.5 282.7"
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 60 60)"
              />

              {/* Segment 2: Setup 20% */}
              <Circle
                cx="60"
                cy="60"
                r="45"
                stroke={Colors.hofYellow}
                strokeWidth="12"
                strokeDasharray="56.5 282.7"
                strokeDashoffset="-56.5"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 60 60)"
              />

              {/* Segment 3: Active Draft 40% */}
              <Circle
                cx="60"
                cy="60"
                r="45"
                stroke="#60a5fa"
                strokeWidth="12"
                strokeDasharray="113.1 282.7"
                strokeDashoffset="-113.1"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 60 60)"
              />

              {/* Segment 4: Leaderboard 20% */}
              <Circle
                cx="60"
                cy="60"
                r="45"
                stroke="#22C55E"
                strokeWidth="12"
                strokeDasharray="56.5 282.7"
                strokeDashoffset="-226.2"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 60 60)"
              />
            </Svg>
            
            {/* Donut hole center content */}
            <View style={styles.donutCenterContent}>
              <Text style={styles.donutCenterValue}>50K</Text>
              <Text style={styles.donutCenterLabel}>BOTS</Text>
            </View>
          </View>

          {/* Donut Legend */}
          <View style={styles.donutLegendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#f87171' }]} />
              <Text style={styles.legendName}>Onboarding</Text>
              <Text style={styles.legendVal}>20%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.hofYellow }]} />
              <Text style={styles.legendName}>Draft Setup</Text>
              <Text style={styles.legendVal}>20%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#60a5fa' }]} />
              <Text style={styles.legendName}>Active Draft</Text>
              <Text style={styles.legendVal}>40%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendName}>Leaderboard</Text>
              <Text style={styles.legendVal}>20%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
