import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { styles } from './OnboardingScreen.styles';

const FEATURES = [
  {
    icon: (
      <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12V9H17C17 7.9 16.1 7 15 7H13.82C13.4 5.27 11.85 4 10 4C7.79 4 6 5.79 6 8V12H4V12.01C4 16.1 7.12 19.46 11.1 19.95C10.4 18.73 10 17.28 10 15.68V14H12V15.68C12 17.65 12.75 19.44 14 20.73V22C14.55 22 15 21.55 15 21V20.1C18.9 19.16 21.8 15.86 21.98 12H22V12C22 6.48 17.52 2 12 2Z" fill={Colors.hofYellow} />
      </Svg>
    ),
    kicker: 'AI DRAFT WIZARD',
    title: 'DRAFT AGAINST ADVANCED BOTS',
    desc: 'Simulate drafts against machine-learning opponents configured to mimic real experts. Zero latency, instant feedback.'
  },
  {
    icon: (
      <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
        <Path d="M5 19h14v2H5v-2zm10-4h4v2h-4v-2zm-5-5h4v7h-4v-7zM5 5h4v12H5V5z" fill={Colors.primaryAccent} />
      </Svg>
    ),
    kicker: 'CHEAT SHEET BUILDER',
    title: 'CUSTOMIZE YOUR TOP 250 CHEAT SHEETS',
    desc: 'Scout half-PPR consensus rankings, build custom sheets, and track player trends to build a roster bully.'
  },
  {
    icon: (
      <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
        <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.2 1.8 4 4 4h2.2c.8 1.9 2.5 3.2 4.8 3.4V20H9v2h6v-2h-3v-2.6c2.3-.2 4-1.5 4.8-3.4H19c2.2 0 4-1.8 4-4V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 1.1-.9 2-2 2zm14 0c-1.1 0-2-.9-2-2V7h2v3zm-7 4c-1.7 0-3-1.3-3-3V5h6v6c0 1.7-1.3 3-3 3z" fill={Colors.hofYellow} />
      </Svg>
    ),
    kicker: 'MODEL TELEMETRY',
    title: 'LIVE LEADERBOARDS & MUTATIONS',
    desc: 'Explore real-time bot performance metrics, draft position success records, and advanced fantasy analytics.'
  }
];

export default function OnboardingShowcase() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setSlideIndex((prev) => (prev + 1) % FEATURES.length);
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true
        }).start();
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [slideAnim]);

  return (
    <Animated.View style={[styles.showcaseCard, { opacity: slideAnim }]}>
      <View style={styles.slideIconCircle}>
        {FEATURES[slideIndex].icon}
      </View>
      <View style={styles.slideTextGroup}>
        <Text style={styles.slideKicker}>{FEATURES[slideIndex].kicker}</Text>
        <Text style={styles.slideTitle}>{FEATURES[slideIndex].title}</Text>
        <Text style={styles.slideDesc}>{FEATURES[slideIndex].desc}</Text>
      </View>
      
      <View style={styles.dotIndicatorRow}>
        {FEATURES.map((_, idx) => (
          <View 
            key={idx} 
            style={[
              styles.dot, 
              slideIndex === idx && { backgroundColor: Colors.hofYellow, width: 14 }
            ]} 
          />
        ))}
      </View>
    </Animated.View>
  );
}
