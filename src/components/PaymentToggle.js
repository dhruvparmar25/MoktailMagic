import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { colors, spacing, borderRadius, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const springConfig = { damping: 20, stiffness: 300 };

export default function PaymentToggle({ value, onChange }) {
  const isCash = value === "CASH" || value === "Cash";

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onChange("Cash")}
        style={[styles.option, isCash && styles.optionSelected]}
      >
        <View style={[styles.dot, isCash && styles.dotSelected]} />
        <Text style={[styles.optionLabel, isCash && styles.optionLabelSelected]}>
          Cash
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange("Online")}
        style={[styles.option, !isCash && styles.optionSelected]}
      >
        <View style={[styles.dot, !isCash && styles.dotSelected]} />
        <Text style={[styles.optionLabel, !isCash && styles.optionLabelSelected]}>
          Online
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xxs,
  },
  optionSelected: {
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  optionLabelSelected: {
    color: colors.textPrimary,
  },
});
