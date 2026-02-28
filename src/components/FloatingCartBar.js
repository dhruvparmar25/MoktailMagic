import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, borderRadius, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const springConfig = { damping: 15, stiffness: 400 };

export default function FloatingCartBar({
  itemCount,
  totalAmount,
  onProceedToPay,
  disabled,
}) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(1);

  useEffect(() => {
    if (itemCount > 0) {
      badgeScale.value = withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, springConfig)
      );
    }
  }, [itemCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  const animatedBadge = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + spacing.sm }]}>
      <View style={styles.bar}>
        <View style={styles.left}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.amount}>₹{totalAmount}</Text>
        </View>
        <AnimatedPressable
          onPress={onProceedToPay}
          disabled={disabled}
          onPressIn={() => {
            if (!disabled) scale.value = withSpring(0.96, springConfig);
          }}
          onPressOut={() => {
            scale.value = withSpring(1, springConfig);
          }}
          style={[styles.button, disabled && styles.buttonDisabled, animatedStyle]}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Proceed to Pay</Text>
            {itemCount > 0 && (
              <Animated.View style={[styles.badge, animatedBadge]}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </Animated.View>
            )}
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  left: {},
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  amount: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 160,
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  buttonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  badge: {
    backgroundColor: colors.accent,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    ...typography.label,
    color: colors.textPrimary,
  },
});
