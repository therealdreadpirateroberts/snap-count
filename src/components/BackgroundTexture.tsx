import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useColors } from '@/constants/theme';

interface BackgroundTextureProps {
  backgroundColor?: string;
}

export default function BackgroundTexture({ backgroundColor }: BackgroundTextureProps) {
  const Colors = useColors();
  
  return (
    <View style={[StyleSheet.absoluteFill, styles.container, { backgroundColor: backgroundColor || Colors.primaryAccent }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: -10,
  },
});

