import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, spacing, borderRadius, typography } from "../theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const springConfig = { damping: 16, stiffness: 400 };

export default function ProductCard({
  item,
  quantity = 0,
  onAdd,
  onDecrease,
  index = 0,
}) {
  const scale = useSharedValue(1);

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAdd(item);
  };

  const handleDecrease = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDecrease(item);
  };

  const price = item.assign_price ?? item.price ?? 0;
  const title = item.title ?? item.name ?? "Product";

  return (
    <Animated.View
      entering={FadeIn.delay(index * 40).duration(300)}
      style={styles.card}
    >
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageFallback}>{title.charAt(0)}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.price}>₹{price}</Text>

      {quantity > 0 ? (
        <View style={styles.qtyRow}>
          <AnimatedPressable
            onPress={handleDecrease}
            onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
            onPressOut={() => (scale.value = withSpring(1, springConfig))}
            style={[styles.qtyBtn, animatedButton]}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </AnimatedPressable>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <AnimatedPressable
            onPress={handleAdd}
            onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
            onPressOut={() => (scale.value = withSpring(1, springConfig))}
            style={[styles.qtyBtn, styles.qtyBtnPrimary, animatedButton]}
          >
            <Text style={styles.qtyBtnTextPrimary}>+</Text>
          </AnimatedPressable>
        </View>
      ) : (
        <AnimatedPressable
          onPress={handleAdd}
          onPressIn={() => (scale.value = withSpring(0.96, springConfig))}
          onPressOut={() => (scale.value = withSpring(1, springConfig))}
          style={[styles.addBtn, animatedButton]}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </AnimatedPressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "47%",
    maxWidth: "47%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    marginRight: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: 1.2,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  imageFallback: {
    ...typography.h1,
    color: colors.textTertiary,
  },
  title: {
    ...typography.captionMedium,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  price: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  addBtn: {
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    ...typography.captionMedium,
    color: colors.textInverse,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnPrimary: {
    backgroundColor: colors.primary,
  },
  qtyBtnText: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  qtyBtnTextPrimary: {
    ...typography.h3,
    color: colors.textInverse,
  },
  qtyValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: "center",
  },
});
