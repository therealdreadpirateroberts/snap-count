import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { useColors } from '@/constants/theme';

export default function BackgroundTexture() {
  const Colors = useColors();
  
  // Alternating lawn bands: we divide the viewport into 10 bands
  const bands = Array.from({ length: 10 });
  const yardLines = Array.from({ length: 9 });

  return (
    <View style={[StyleSheet.absoluteFill, styles.container, { backgroundColor: Colors.background }]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {/* Draw alternating turf stripes */}
        {bands.map((_, index) => {
          // Alternating slightly lighter and darker turf stripes
          const isLighter = index % 2 === 0;
          const fill = isLighter ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.03)';
          const y = `${index * 10}%`;
          const height = '10%';
          return (
            <Rect
              key={`band-${index}`}
              x="0"
              y={y}
              width="100%"
              height={height}
              fill={fill}
            />
          );
        })}

        {/* Draw subtle turf yard lines */}
        {yardLines.map((_, index) => {
          const y = `${(index + 1) * 10}%`;
          const isFifty = index === 4; // 50-yard line
          const opacity = isFifty ? 0.07 : 0.04;
          const strokeWidth = isFifty ? 2 : 1;
          return (
            <React.Fragment key={`line-group-${index}`}>
              {/* Main yard line */}
              <Line
                x1="0"
                y1={y}
                x2="100%"
                y2={y}
                stroke="#F4F5F7"
                strokeWidth={strokeWidth}
                opacity={opacity}
              />
              {/* Optional tiny hash marks on the sides to complete the gridiron look */}
              <Line
                x1="12"
                y1={y}
                x2="12"
                y2={parseFloat(y) + 1.5 + '%'}
                stroke="#F4F5F7"
                strokeWidth={1}
                opacity={opacity * 1.5}
              />
              <Line
                x1="95%"
                y1={y}
                x2="95%"
                y2={parseFloat(y) + 1.5 + '%'}
                stroke="#F4F5F7"
                strokeWidth={1}
                opacity={opacity * 1.5}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: -10,
  },
});

