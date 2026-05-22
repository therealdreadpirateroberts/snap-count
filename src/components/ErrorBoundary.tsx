import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import Svg, { Path, Circle } from 'react-native-svg';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 [ErrorBoundary Telemetry] Uncaught rendering/layout exception caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.errorOverlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={9} stroke="#ef4444" strokeWidth={2} />
                <Path d="M12 8V12M12 16H12.01" stroke="#ef4444" strokeWidth={3} strokeLinecap="round" />
              </Svg>
              <Text style={styles.title}>LAYOUT EXCEPTION CAUGHT</Text>
            </View>
            <Text style={styles.desc}>
              A runtime layout style conflict or rendering crash occurred in this section. The system prevented a full page collapse.
            </Text>
            {this.state.error && (
              <View style={styles.errorLogBox}>
                <Text style={styles.errorLogText} numberOfLines={3}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}
            <Pressable style={styles.resetBtn} onPress={this.handleReset}>
              <Text style={styles.resetBtnText}>RESTORE VIEW ⚡</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 12, 12, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
    zIndex: 9999,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#2c2c2c',
    borderWidth: 1.5,
    borderColor: '#bea98e',
    borderRadius: 16,
    padding: Spacing.four,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: Fonts.headings,
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  desc: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: Spacing.three,
  },
  errorLogBox: {
    backgroundColor: '#0c0c0c',
    borderRadius: 8,
    padding: Spacing.two,
    borderWidth: 1,
    borderColor: '#4a4a4a',
    marginBottom: Spacing.four,
  },
  errorLogText: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 15,
  },
  resetBtn: {
    backgroundColor: '#bea98e',
    paddingVertical: Spacing.two + 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  resetBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 13,
    color: '#000000', // Solid black for AAA compliance (10.2:1 contrast)
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
