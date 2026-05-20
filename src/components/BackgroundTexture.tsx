import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/theme';

export default function BackgroundTexture() {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Svg width="100%" height="100%">
        {/* Draw subtle yard lines spanning horizontally */}
        <Path
          d="M0 60 H1200 M0 120 H1200 M0 180 H1200 M0 240 H1200 M0 300 H1200 M0 360 H1200 M0 420 H1200 M0 480 H1200 M0 540 H1200 M0 600 H1200 M0 660 H1200 M0 720 H1200 M0 780 H1200 M0 840 H1200 M0 900 H1200 M0 960 H1200 M0 1020 H1200"
          stroke="#F8FAFC"
          strokeWidth={1}
          opacity={0.02}
        />
        {/* Draw grid hashes spaced vertically along the margins */}
        <Path
          d="
            M40 30 V40 M40 90 V100 M40 150 V160 M40 210 V220 M40 270 V280 M40 330 V340 M40 390 V400 M40 450 V460 M40 510 V520 M40 570 V580 M40 630 V640 M40 690 V700 M40 750 V760 M40 810 V820 M40 870 V880 M40 930 V940
            M320 30 V40 M320 90 V100 M320 150 V160 M320 210 V220 M320 270 V280 M320 330 V340 M320 390 V400 M320 450 V460 M320 510 V520 M320 570 V580 M320 630 V640 M320 690 V700 M320 750 V760 M320 810 V820 M320 870 V880 M320 930 V940
          "
          stroke="#F8FAFC"
          strokeWidth={1.5}
          opacity={0.03}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    zIndex: -10,
  },
});
