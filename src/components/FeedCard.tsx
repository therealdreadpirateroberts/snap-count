import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Image, 
  Platform 
} from 'react-native';
import Svg, { Path, Circle, Rect, Line, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Colors } from '@/constants/theme';
import { NewsStoryItem } from '@/utils/photographyStudio';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';

export interface CoreCardItem {
  id: string;
  kicker: string;
  title: string;
  description: string;
  btnLabel: string;
  route: string;
  graphicType: 'mock' | 'news' | 'sheets' | 'swarm' | 'leaderboard';
}

interface FeedCardProps {
  tile: 
    | { type: 'core'; data: CoreCardItem }
    | { type: 'news'; data: NewsStoryItem };
  isDesktop: boolean;
  onPress: (route: string) => void;
}

export default function FeedCard({ tile, isDesktop, onPress }: FeedCardProps) {
  const themedColors = useColors();
  const isCore = tile.type === 'core';

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  const renderCardGraphic = (type: 'mock' | 'news' | 'sheets' | 'swarm' | 'leaderboard') => {
    switch (type) {
      case 'mock':
        return (
          <Image 
            source={require('../../assets/images/studio_mock_suite.png')} 
            style={{ width: '100%', height: 160 }}
            resizeMode="cover"
          />
        );
      case 'news':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="newsGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#1E293B" />
                <Stop offset="100%" stopColor="#0F172A" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#newsGrad)" />
            <Line x1="0" y1="40" x2="320" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <Line x1="0" y1="80" x2="320" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <Line x1="0" y1="120" x2="320" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <Rect x="80" y="30" width="160" height="100" rx="4" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
            <Rect x="90" y="40" width="140" height="10" fill="rgba(255,255,255,0.3)" />
            <Rect x="90" y="60" width="60" height="45" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <Line x1="160" y1="65" x2="220" y2="65" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
            <Line x1="160" y1="75" x2="210" y2="75" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <Line x1="160" y1="85" x2="225" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            <Line x1="90" y1="115" x2="230" y2="115" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
            <Circle cx="230" cy="30" r="6" fill="#EF4444" />
            <Circle cx="230" cy="30" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity={0.5} />
          </Svg>
        );
      case 'sheets':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="sheetsGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#0F172A" />
                <Stop offset="100%" stopColor="#1E293B" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#sheetsGrad)" />
            <Rect x="60" y="25" width="200" height="110" rx="6" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
            <Rect x="61" y="26" width="198" height="22" rx="4" fill="rgba(255, 255, 255, 0.05)" />
            <Line x1="110" y1="25" x2="110" y2="135" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <Line x1="210" y1="25" x2="210" y2="135" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <Line x1="60" y1="48" x2="260" y2="48" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <Line x1="60" y1="70" x2="260" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <Line x1="60" y1="92" x2="260" y2="92" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <Line x1="60" y1="114" x2="260" y2="114" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <Circle cx="85" cy="36" r="4" fill="rgba(255,255,255,0.2)" />
            <Rect x="120" y="33" width="70" height="6" rx="3" fill="rgba(255,255,255,0.2)" />
            <G transform="translate(160, 80) scale(1.4)">
              <Circle cx="0" cy="0" r="18" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" strokeDasharray="4 2" />
              <Path d="M0 -6 L2 -2 L6 -2 L3 1 L4 5 L0 3 L-4 5 L-3 1 L-6 -2 L-2 -2 Z" fill={Colors.hofYellow} />
            </G>
          </Svg>
        );
      case 'swarm':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="swarmGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#312E81" />
                <Stop offset="100%" stopColor="#0F172A" />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#swarmGrad)" />
            <G opacity={0.65}>
              <Circle cx="160" cy="80" r="8" fill="#c084fc" />
              <Circle cx="100" cy="50" r="5" fill="#60a5fa" />
              <Circle cx="220" cy="50" r="5" fill="#4ade80" />
              <Circle cx="100" cy="110" r="5" fill="#fb923c" />
              <Circle cx="220" cy="110" r="5" fill="#FFE066" />
              <Line x1="160" y1="80" x2="100" y2="50" stroke="#60a5fa" strokeWidth="1.5" />
              <Line x1="160" y1="80" x2="220" y2="50" stroke="#4ade80" strokeWidth="1.5" />
              <Line x1="160" y1="80" x2="100" y2="110" stroke="#fb923c" strokeWidth="1.5" />
              <Line x1="160" y1="80" x2="220" y2="110" stroke="#FFE066" strokeWidth="1.5" />
              <Line x1="100" y1="50" x2="220" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <Line x1="100" y1="110" x2="220" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </G>
            <Circle cx="160" cy="80" r="16" fill="none" stroke="#c084fc" strokeWidth="1" opacity={0.3} />
            <Circle cx="160" cy="80" r="24" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="3 3" opacity={0.2} />
          </Svg>
        );
      case 'leaderboard':
        return (
          <Svg width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="leadGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={Colors.deepFieldGreen} />
                <Stop offset="100%" stopColor={Colors.obsidianBlack} />
              </LinearGradient>
            </Defs>
            <Rect width="320" height="160" fill="url(#leadGrad)" />
            <G transform="translate(160, 75) scale(1.6)" opacity={0.45}>
              <Circle cx="0" cy="0" r="22" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" strokeDasharray="5,3" />
            </G>
            <G transform="translate(160, 70)">
              <Path d="M-15,-30 L15,-30 L12,-5 C12,12 -12,12 -12,-5 Z" fill="none" stroke={Colors.hofYellow} strokeWidth="3" />
              <Path d="M-4,10 L4,10 L6,22 L-6,22 Z" fill="none" stroke={Colors.hofYellow} strokeWidth="2.5" />
              <Line x1="-12" y1="22" x2="12" y2="22" stroke={Colors.hofYellow} strokeWidth="3.5" />
              <Path d="M-15,-22 C-22,-22 -22,-10 -13,-5" fill="none" stroke={Colors.hofYellow} strokeWidth="2" />
              <Path d="M15,-22 C22,-22 22,-10 13,-5" fill="none" stroke={Colors.hofYellow} strokeWidth="2" />
              <Path d="M0 -15 L1 -12 L4 -12 L2 -10 L3 -7 L0 -9 L-3 -7 L-2 -10 L-4 -12 L-1 -12 Z" fill={Colors.hofYellow} />
            </G>
          </Svg>
        );
    }
  };

  if (isCore) {
    const card = tile.data;
    return (
      <Pressable
        key={card.id}
        style={({ pressed }) => [
          styles.tileCard,
          { backgroundColor: themedColors.primaryAccent, borderColor: themedColors.midGray },
          isDesktop && styles.tileCardDesktop,
          pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
          onPress(card.route);
        }}
      >
        <View style={styles.tileImageContainer}>
          {renderCardGraphic(card.graphicType)}
        </View>

        <View style={styles.tileContent}>
          <Text style={[styles.tileKicker, { color: themedColors.obsidianBlack }]}>{card.kicker}</Text>
          <Text style={[styles.tileTitle, { color: themedColors.obsidianBlack }]}>{card.title}</Text>
          <Text style={[styles.tileDescription, { color: themedColors.obsidianBlack }]} numberOfLines={3} ellipsizeMode="tail">
            {card.description}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.tileButton,
              { backgroundColor: themedColors.pylonOrange, borderColor: themedColors.pylonOrange },
              pressed && { opacity: 0.9 }
            ]}
            onPress={() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
              onPress(card.route);
            }}
          >
            <Text style={[styles.tileButtonText, { color: themedColors.primaryAccent }]}>{card.btnLabel}</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  } else {
    const story = tile.data;
    const imageSource = story.localImage ? story.localImage : { uri: story.imageUrl };
    const trendColor = story.trend === 'up' ? '#22C55E' : '#EF4444';
    const trendIcon = story.trend === 'up' ? '▲' : '▼';
    
    return (
      <Pressable
        key={story.id}
        style={({ pressed }) => [
          styles.tileCard,
          { backgroundColor: themedColors.primaryAccent, borderColor: themedColors.midGray },
          isDesktop && styles.tileCardDesktop,
          pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
        ]}
        onPress={() => {
          triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
          onPress('/news');
        }}
      >
        <View style={styles.tileImageContainer}>
          <PlayerHeadshot 
            name={story.playerName} 
            position={story.position} 
            style={[styles.newsTileImage, { resizeMode: 'contain', backgroundColor: 'rgba(12, 12, 12, 0.05)' }]} 
          />
          <View style={styles.tileImageOverlay} />
          
          <View style={[styles.newsTrendBadge, { borderColor: Colors.hofYellow }]}>
            <Text style={[styles.newsTrendBadgeText, { color: trendColor }]}>
              {trendIcon} {story.playerName.toUpperCase()} ({story.position})
            </Text>
          </View>
        </View>

        <View style={styles.tileContent}>
          <View style={styles.newsMetaRow}>
            <View style={[styles.newsTagBadge, { backgroundColor: story.tagColor }]}>
              <Text style={styles.newsTagText}>{story.tag}</Text>
            </View>
            <Text style={[styles.newsTimeText, { color: themedColors.obsidianBlack }]}>{story.timeAgo} • {story.team}</Text>
          </View>

          <Text style={[styles.tileTitle, { color: themedColors.obsidianBlack }]} numberOfLines={2} ellipsizeMode="tail">
            {story.headline.toUpperCase()}
          </Text>
          
          <Text style={[styles.newsTakeTextKicker, { color: themedColors.obsidianBlack }]}>FANTASY IMPACT REACTION:</Text>
          <Text style={[styles.newsTakeText, { color: themedColors.obsidianBlack }]} numberOfLines={3} ellipsizeMode="tail">
            {story.take}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.tileButton,
              { backgroundColor: themedColors.pylonOrange, borderColor: themedColors.pylonOrange },
              pressed && { opacity: 0.9 }
            ]}
            onPress={() => {
              triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
              onPress('/news');
            }}
          >
            <Text style={[styles.tileButtonText, { color: themedColors.primaryAccent }]}>REACTION TELEMETRY</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  tileCard: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tileCardDesktop: {
    width: '48%',
  },
  tileImageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  newsTileImage: {
    width: '100%',
    height: '100%',
  },
  tileImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  newsTrendBadge: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(12, 12, 12, 0.85)',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  newsTrendBadgeText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
  },
  tileContent: {
    padding: 16,
    gap: 8,
  },
  tileKicker: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tileTitle: {
    fontFamily: Fonts.headings,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  tileDescription: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 16,
  },
  tileButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  tileButtonText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
  },
  newsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newsTagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newsTagText: {
    fontFamily: Fonts.stats,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  newsTimeText: {
    fontFamily: Fonts.body,
    fontSize: 9,
  },
  newsTakeTextKicker: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 4,
  },
  newsTakeText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    lineHeight: 14,
    fontStyle: 'italic',
  },
});
