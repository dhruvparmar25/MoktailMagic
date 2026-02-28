import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing, borderRadius } from "../theme";

export function SkeletonBox({ width, height, style }) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width ?? "100%", height: height ?? 20 },
        style,
        animatedStyle,
      ]}
    />
  );
}

export default function ProductGridSkeleton() {
  return (
    <View style={styles.grid}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.card}>
          <SkeletonBox height={100} style={styles.image} />
          <SkeletonBox width="80%" height={14} style={styles.title} />
          <SkeletonBox width="40%" height={12} style={styles.price} />
          <SkeletonBox width="100%" height={36} style={styles.button} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    marginBottom: spacing.sm,
  },
  image: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  title: {
    marginBottom: 4,
  },
  price: {
    marginBottom: spacing.xs,
  },
  button: {
    borderRadius: borderRadius.md,
    marginTop: 4,
  },
});
