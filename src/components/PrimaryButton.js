import React from "react";
import { Text, StyleSheet, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";
import { colors, borderRadius, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const springConfig = { damping: 15, stiffness: 400 };

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = "primary",
  size = "md",
  disabled = false,
  style,
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  const handlePressIn = () => {
    if (!disabled) scale.value = withSpring(0.96, springConfig);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const isGradient = variant === "primary" || variant === "success";
  const textColor = variant === "ghost" ? colors.primary : colors.textInverse;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        size === "sm" && styles.sm,
        variant === "danger" && styles.dangerBg,
        variant === "ghost" && styles.ghostBg,
        animatedStyle,
        style,
      ]}
    >
      {isGradient && !disabled && (
        <LinearGradient
          colors={
            variant === "primary"
              ? ["#5B5FEF", "#4A4ED9"]
              : ["#22C55E", "#16A34A"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text
          style={[
            styles.label,
            size === "sm" && styles.labelSmall,
            { color: textColor },
          ]}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minWidth: 120,
  },
  sm: {
    height: 44,
    borderRadius: borderRadius.md,
  },
  dangerBg: {
    backgroundColor: colors.danger,
  },
  ghostBg: {
    backgroundColor: "transparent",
  },
  label: {
    ...typography.button,
  },
  labelSmall: {
    ...typography.buttonSmall,
  },
});
