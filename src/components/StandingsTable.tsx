import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useColors, Fonts } from '@/constants/theme';

interface StandingsRow {
  name: string;
  isHuman: boolean;
  strategyCamp: string;
  totalWins: number;
  totalLosses: number;
  winRate: number;
  avgPlayoff: number;
  avgGrade: string;
}

interface StandingsTableProps {
  leaderboardData: StandingsRow[];
  userTeamName: string;
}

export default function StandingsTable({
  leaderboardData,
  userTeamName,
}: StandingsTableProps) {
  const Colors = useColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollStyle}>
      <View style={[styles.tableContainer, { borderColor: Colors.coltsNavyLight, backgroundColor: Colors.surface }]}>
        <View style={[styles.tableHeaderRow, { backgroundColor: Colors.surfaceLifted, borderBottomColor: Colors.coltsNavyLight }]}>
          <Text style={[styles.tableHeaderCell, { width: 36, textAlign: 'center', color: Colors.secondaryAccent }]}>RK</Text>
          <Text style={[styles.tableHeaderCell, { width: 90, color: Colors.secondaryAccent }]}>MANAGER</Text>
          <Text style={[styles.tableHeaderCell, { width: 100, color: Colors.secondaryAccent }]}>STRATEGY CAMP</Text>
          <Text style={[styles.tableHeaderCell, { width: 80, textAlign: 'center', color: Colors.secondaryAccent }]}>RECORD</Text>
          <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'center', color: Colors.secondaryAccent }]}>WIN %</Text>
          <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'center', color: Colors.secondaryAccent }]}>PLAYOFF%</Text>
          <Text style={[styles.tableHeaderCell, { width: 60, textAlign: 'center', color: Colors.secondaryAccent }]}>AVG GRADE</Text>
        </View>

        {leaderboardData.map((row, idx) => {
          const isHuman = row.name === userTeamName || row.name === 'Your Team';
          return (
            <View 
              key={row.name} 
              style={[
                styles.tableRow, 
                { borderBottomColor: Colors.coltsNavyLight },
                isHuman && styles.tableRowHuman
              ]}
            >
              <Text style={[styles.tableCell, { width: 36, textAlign: 'center', fontWeight: 'bold', color: isHuman ? Colors.hofYellow : '#94a3b8' }]}>
                #{idx + 1}
              </Text>
              <View style={[styles.tableNameCell, { width: 90 }]}>
                <Text style={[styles.tableCellText, { color: Colors.primaryAccent }, isHuman && styles.tableCellHumanText]} numberOfLines={1}>
                  {row.name}
                </Text>
                {!isHuman && <Text style={[styles.cpuSubLabel, { color: Colors.secondaryAccent }]}>[CPU]</Text>}
              </View>
              <Text style={[styles.tableCell, { width: 100, color: '#e2e8f0' }]} numberOfLines={1}>
                {row.strategyCamp}
              </Text>
              <Text style={[styles.tableCell, { width: 80, textAlign: 'center', fontFamily: Fonts.stats, fontSize: 10 }]}>
                {Math.round(row.totalWins)} - {Math.round(row.totalLosses)}
              </Text>
              <Text style={[styles.tableCell, { width: 60, textAlign: 'center', fontWeight: 'bold', color: isHuman ? Colors.hofYellow : '#22c55e' }]}>
                {Math.round(row.winRate * 100)}%
              </Text>
              <Text style={[styles.tableCell, { width: 60, textAlign: 'center' }]}>
                {row.avgPlayoff}%
              </Text>
              <Text style={[styles.tableCell, { width: 60, textAlign: 'center', fontWeight: 'bold', color: row.avgGrade.startsWith('A') ? Colors.hofYellow : '#ffffff' }]}>
                {row.avgGrade}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: {
    width: '100%',
  },
  tableContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    width: 530,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontFamily: Fonts.stats,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRowHuman: {
    backgroundColor: 'rgba(255, 205, 0, 0.12)',
    borderBottomColor: 'rgba(255, 205, 0, 0.25)',
    borderBottomWidth: 1,
  },
  tableCellText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: 'bold',
  },
  tableCellHumanText: {
    fontWeight: 'bold',
  },
  tableNameCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cpuSubLabel: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
  },
  tableCell: {
    fontFamily: Fonts.body,
    fontSize: 10.5,
  },
});
