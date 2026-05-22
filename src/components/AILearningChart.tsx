import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Spacing } from '@/constants/theme';

interface AILearningChartProps {
  botTrainingSims: number;
  isSimulating: boolean;
  simProgress: number;
}

export default function AILearningChart({
  botTrainingSims,
  isSimulating,
  simProgress,
}: AILearningChartProps) {
  const Colors = useColors();
  const [exploreIdx, setExploreIdx] = useState<number | null>(null);

  // Auto-reset explore state back to standard after two seconds of idle
  useEffect(() => {
    if (exploreIdx !== null) {
      const timer = setTimeout(() => {
        setExploreIdx(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [exploreIdx]);

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {
        console.warn('Haptics failed:', err);
      }
    }
  };

  const drawBotLearningCurve = (width: number, height: number) => {
    const points: { x: number; y: number }[] = [];
    const maxSims = 10000;
    
    for (let i = 0; i <= 10; i++) {
      const simulatedPoints = i * 1000;
      const growth = (0.98 - 0.50) * (1 - Math.exp(-simulatedPoints / 3000));
      const accuracy = 0.50 + growth;
      
      const x = 25 + (i * (width - 50)) / 10;
      const y = height - 20 - ((accuracy - 0.50) / 0.50) * (height - 40);
      points.push({ x, y });
    }

    let pathString = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathString += ` L ${points[i].x} ${points[i].y}`;
    }

    const curGrowth = (0.98 - 0.50) * (1 - Math.exp(-botTrainingSims / 3000));
    const curAccuracy = 0.50 + curGrowth;
    const curX = 25 + (botTrainingSims / maxSims) * (width - 50);
    const curY = height - 20 - ((curAccuracy - 0.50) / 0.50) * (height - 40);

    return { pathString, curX, curY, curAccuracy, points };
  };

  const { pathString, curX, curY, curAccuracy, points } = useMemo(() => {
    return drawBotLearningCurve(320, 100);
  }, [botTrainingSims]);

  const exploredPoints = useMemo(() => {
    if (exploreIdx === null) return null;
    const simulatedPoints = exploreIdx * 1000;
    const growth = (0.98 - 0.50) * (1 - Math.exp(-simulatedPoints / 3000));
    const accuracy = 0.50 + growth;
    return {
      sims: simulatedPoints,
      accuracy: Math.round(accuracy * 100),
      x: points[exploreIdx]?.x ?? 25,
      y: points[exploreIdx]?.y ?? 80,
    };
  }, [exploreIdx, points]);

  const handleTouch = (event: any) => {
    const touchX = event.nativeEvent.locationX;
    const relativeX = (touchX - 25) / (320 - 50);
    const idx = Math.max(0, Math.min(10, Math.round(relativeX * 10)));
    if (idx !== exploreIdx) {
      setExploreIdx(idx);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.chartContainer}>
      <View 
        style={[styles.chartWrapper, { position: 'relative' }]}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
      >
        <Svg width="100%" height="100" viewBox="0 0 320 100">
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={Colors.hofYellow} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={Colors.hofYellow} stopOpacity={0.0} />
            </LinearGradient>
            <LinearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={Colors.hofYellow} stopOpacity={0.6} />
              <Stop offset="50%" stopColor="#ffb03a" stopOpacity={0.9} />
              <Stop offset="100%" stopColor={Colors.hofYellow} stopOpacity={1} />
            </LinearGradient>
          </Defs>

          <Line x1="25" y1="10" x2="310" y2="10" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4" />
          <Line x1="25" y1="30" x2="310" y2="30" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4" />
          <Line x1="25" y1="50" x2="310" y2="50" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4" />
          <Line x1="25" y1="80" x2="310" y2="80" stroke={Colors.glassBorder} strokeWidth="0.5" strokeDasharray="4 4" />
          
          <Line x1="25" y1="80" x2="25" y2="10" stroke={Colors.glassBorder} strokeWidth="0.5" />
          <Line x1="310" y1="80" x2="310" y2="10" stroke={Colors.glassBorder} strokeWidth="0.5" />

          <Path 
            d={`${pathString} L ${points[points.length - 1]?.x ?? 310} 80 L ${points[0]?.x ?? 25} 80 Z`} 
            fill="url(#areaGradient)" 
          />

          <Path d={pathString} fill="none" stroke="url(#lineGradient)" strokeWidth="3" />
          
          <Circle cx={curX} cy={curY} r="5" fill={Colors.hofYellow} />
          <Circle cx={curX} cy={curY} r="9" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" opacity={0.6} />
          
          {exploredPoints && (
            <>
              <Line 
                x1={exploredPoints.x} 
                y1="10" 
                x2={exploredPoints.x} 
                y2="80" 
                stroke="rgba(255, 224, 102, 0.4)" 
                strokeWidth="1" 
                strokeDasharray="2 2" 
              />
              <Circle cx={exploredPoints.x} cy={exploredPoints.y} r="6" fill="#ffffff" />
              <Circle cx={exploredPoints.x} cy={exploredPoints.y} r="10" fill="none" stroke="#ffffff" strokeWidth="1" opacity={0.5} />
            </>
          )}

          <SvgText x="32" y="22" fill="#94a3b8" fontSize="8" fontFamily={Fonts.stats}>98% Target</SvgText>
          <SvgText x="32" y="76" fill="#94a3b8" fontSize="8" fontFamily={Fonts.stats}>50% Initial</SvgText>
        </Svg>

        {exploredPoints && (
          <View style={[styles.exploreTooltip, { backgroundColor: Colors.surface, borderColor: Colors.coltsNavyLight }]}>
            <Text style={[styles.exploreTooltipText, { color: Colors.primaryAccent }]}>
              📈 SIMS: {exploredPoints.sims.toLocaleString()} | ACCURACY: {exploredPoints.accuracy}%
            </Text>
          </View>
        )}

        <View style={[
          styles.greenProgressCircleBadge,
          isSimulating && styles.greenProgressCircleBadgeActive
        ]}>
          <Text style={styles.greenProgressCircleBadgeText}>
            {isSimulating ? `${simProgress}%` : `${Math.round((botTrainingSims / 10000) * 100)}%`}
          </Text>
          <Text style={styles.greenProgressCircleBadgeSubText}>
            {isSimulating ? 'TRAINING' : botTrainingSims >= 10000 ? 'COMPLETE' : 'TRAINED'}
          </Text>
        </View>
      </View>

      <View style={styles.aiProgressMetaRow}>
        <View>
          <Text style={[styles.aiProgressLabel, { color: Colors.secondaryAccent }]}>SIMULATION RUNS</Text>
          <Text style={[styles.aiProgressVal, { color: Colors.primaryAccent }]}>{botTrainingSims.toLocaleString()} / 10,000</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.aiProgressLabel, { color: Colors.secondaryAccent }]}>STRATEGY DECISION ACCURACY</Text>
          <Text style={[styles.aiProgressVal, { color: Colors.hofYellow }]}>{Math.round(curAccuracy * 100)}%</Text>
        </View>
      </View>

      <View style={[styles.aiProgressBarBg, { backgroundColor: Colors.surfaceLifted }]}>
        <View style={[styles.aiProgressBarFill, { width: `${(botTrainingSims / 10000) * 100}%`, backgroundColor: Colors.coltsNavy }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    width: '100%',
    gap: Spacing.two,
  },
  chartWrapper: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  exploreTooltip: {
    position: 'absolute',
    bottom: -15,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  exploreTooltipText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  greenProgressCircleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  greenProgressCircleBadgeActive: {
    borderColor: '#4ade80',
    backgroundColor: '#dcfce7',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  greenProgressCircleBadgeText: {
    fontFamily: Fonts.stats,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803d',
  },
  greenProgressCircleBadgeSubText: {
    fontFamily: Fonts.body,
    fontSize: 6.5,
    color: '#166534',
    fontWeight: 'bold',
    letterSpacing: 0.2,
    marginTop: -1,
  },
  aiProgressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiProgressLabel: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    letterSpacing: 0.5,
  },
  aiProgressVal: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiProgressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 2,
  },
  aiProgressBarFill: {
    height: 8,
    borderRadius: 4,
  },
});
