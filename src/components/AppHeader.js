import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, typography } from "../theme";

export default function AppHeader({
  title,
  subtitle,
  rightAction,
  onRightPress,
  showBack,
  onBackPress,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing.xs }]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable
            onPress={onBackPress}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {rightAction && (
        <Pressable
          onPress={onRightPress}
          style={({ pressed }) => [styles.rightBtn, pressed && styles.pressed]}
        >
          <Text style={styles.rightLabel}>{rightAction}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backBtn: {
    marginRight: spacing.xs,
    padding: spacing.xxs,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightBtn: {
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
  },
  rightLabel: {
    ...typography.captionMedium,
    color: colors.primary,
  },
});
