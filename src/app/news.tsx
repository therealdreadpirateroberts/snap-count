import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSnapStore } from '@/store/useSnapStore';
import { NewsStory } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path } from 'react-native-svg';

export default function NewsScreen() {
  const router = useRouter();
  const news = useSnapStore((state) => state.news);

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 19L8 12L15 5" stroke="#F8FAFC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          
          <Text style={styles.title}>NEWS & NOTES</Text>
          <Text style={styles.subtitle}>FANTASY-FIRST REACTION PIECES</Text>
        </View>

        {/* News List */}
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {news.map((story) => (
            <View key={story.id} style={styles.storyCard}>
              
              {/* Meta Row: Tag & Time */}
              <View style={styles.metaRow}>
                <View style={[styles.tagPill, { backgroundColor: story.tagColor }]}>
                  <Text style={styles.tagText}>{story.tag}</Text>
                </View>
                <Text style={styles.timeAgo}>{story.timeAgo}</Text>
              </View>

              {/* Headline */}
              <Text style={styles.headline}>{story.headline}</Text>

              {/* Summary */}
              <Text style={styles.summary}>{story.summary}</Text>

              {/* Affected Players Row */}
              <View style={styles.playersWrapper}>
                {story.playersAffected.map((player, idx) => {
                  const trendUp = player.trend === 'up';
                  
                  return (
                    <View key={idx} style={[
                      styles.playerChip,
                      trendUp ? styles.trendUpChip : styles.trendDownChip
                    ]}>
                      <Text style={[
                        styles.playerChipText,
                        trendUp ? styles.trendUpText : styles.trendDownText
                      ]}>
                        {player.name} ({player.position}) {trendUp ? '▲' : '▼'}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* THE TAKE CALLOUT */}
              <View style={styles.takeCallout}>
                <Text style={styles.takeTitle}>THE TAKE</Text>
                <Text style={styles.takeBody}>{story.take}</Text>
              </View>

            </View>
          ))}
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    minHeight: 44, // HIG standard touch target
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.primaryAccent,
    letterSpacing: 1,
  },
  title: {
    fontFamily: Fonts.headings,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.positions.RB, // Green kicker highlight
    letterSpacing: 2,
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  storyCard: {
    backgroundColor: Colors.surface,
    borderColor: '#0f1d3d',
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagPill: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
  },
  tagText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.background,
    letterSpacing: 1,
  },
  timeAgo: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.secondaryAccent,
    opacity: 0.6,
  },
  headline: {
    fontFamily: Fonts.headings,
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: -0.02,
    lineHeight: 28,
  },
  summary: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.secondaryAccent,
    lineHeight: 21,
  },
  playersWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  playerChip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 50,
    borderWidth: 1,
  },
  trendUpChip: {
    backgroundColor: '#052516', // Dark green overlay
    borderColor: Colors.status.success,
  },
  trendDownChip: {
    backgroundColor: '#300f14', // Dark red overlay
    borderColor: Colors.status.danger,
  },
  playerChipText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
  },
  trendUpText: {
    color: Colors.status.success,
  },
  trendDownText: {
    color: Colors.status.danger,
  },
  takeCallout: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryAccent, // solid white left border
    backgroundColor: '#0f1d3d',
    paddingLeft: Spacing.three,
    paddingVertical: Spacing.two,
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  takeTitle: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: 2,
  },
  takeBody: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.secondaryAccent,
    lineHeight: 18,
  },
});
