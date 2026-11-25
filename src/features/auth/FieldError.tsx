import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../theme';

/** Inline validation error displayed directly beneath an invalid form field. */
export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" style={[styles.text, { color: colors.danger }]}>
      {message}
    </Text>
  );
}

/**
 * Wraps a form field so it gives a brief horizontal attention shake whenever
 * `shakeKey` increments (> 0), drawing the user's eye right to the invalid field.
 */
export function ShakeableField({
  shakeKey,
  style,
  onLayout,
  children,
}: {
  shakeKey: number;
  style?: StyleProp<ViewStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
  children: ReactNode;
}) {
  const [translateX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (shakeKey <= 0) return;
    translateX.setValue(0);
    const anim = Animated.sequence([
      Animated.timing(translateX, { toValue: -7, duration: 45, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 7, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -5, duration: 45, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 5, duration: 45, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [shakeKey, translateX]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={[style, { transform: [{ translateX }] }]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
    fontFamily: 'Inter_600SemiBold',
  },
});
