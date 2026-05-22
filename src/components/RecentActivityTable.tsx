import React from 'react';
import { View, Text } from 'react-native';

interface RecentActivityTableProps {
  styles: any;
}

export default function RecentActivityTable({ styles }: RecentActivityTableProps) {
  return (
    <View style={styles.tablePanelCard}>
      <Text style={styles.panelTitle}>RECENT CRAWLER ACTIVITY</Text>
      <Text style={styles.panelSubtitle}>Detailed breakdown of crawled layouts and metrics</Text>
      
      <View style={styles.activityTable}>
        {/* Header */}
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>SCREEN VIEW</Text>
          <Text style={styles.tableCellHeader}>WORDS</Text>
          <Text style={styles.tableCellHeader}>BUTTONS</Text>
          <Text style={styles.tableCellHeader}>BACKDROP</Text>
          <Text style={[styles.tableCellHeader, { textAlign: 'right' }]}>GRADE</Text>
        </View>

        {/* Row 1 */}
        <View style={styles.tableBodyRow}>
          <Text style={[styles.tableCellBody, { flex: 1.5, fontWeight: 'bold' }]}>OnboardingScreen</Text>
          <Text style={styles.tableCellBody}>18</Text>
          <Text style={styles.tableCellBody}>3</Text>
          <Text style={styles.tableCellBody}>PASS</Text>
          <View style={styles.tableCellBadgeWrap}>
            <View style={styles.tablePrettyBadge}><Text style={styles.tablePrettyBadgeTxt}>98</Text></View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.tableBodyRow}>
          <Text style={[styles.tableCellBody, { flex: 1.5, fontWeight: 'bold' }]}>DraftSetupView</Text>
          <Text style={styles.tableCellBody}>24</Text>
          <Text style={styles.tableCellBody}>4</Text>
          <Text style={styles.tableCellBody}>PASS</Text>
          <View style={styles.tableCellBadgeWrap}>
            <View style={styles.tablePrettyBadge}><Text style={styles.tablePrettyBadgeTxt}>96</Text></View>
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.tableBodyRow}>
          <Text style={[styles.tableCellBody, { flex: 1.5, fontWeight: 'bold' }]}>ActiveDraftGrid</Text>
          <Text style={styles.tableCellBody}>46</Text>
          <Text style={styles.tableCellBody}>8</Text>
          <Text style={styles.tableCellBody}>PASS</Text>
          <View style={styles.tableCellBadgeWrap}>
            <View style={styles.tablePrettyBadge}><Text style={styles.tablePrettyBadgeTxt}>94</Text></View>
          </View>
        </View>

        {/* Row 4 */}
        <View style={styles.tableBodyRow}>
          <Text style={[styles.tableCellBody, { flex: 1.5, fontWeight: 'bold' }]}>LiveLeaderboard</Text>
          <Text style={styles.tableCellBody}>32</Text>
          <Text style={styles.tableCellBody}>6</Text>
          <Text style={styles.tableCellBody}>PASS</Text>
          <View style={styles.tableCellBadgeWrap}>
            <View style={styles.tablePrettyBadge}><Text style={styles.tablePrettyBadgeTxt}>95</Text></View>
          </View>
        </View>
      </View>
    </View>
  );
}
