import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppHeader } from "../components";
import { colors, spacing, borderRadius, typography } from "../theme";

export default function OrderSummary({ route, navigation }) {
  const { order } = route.params ?? {};
  const products = order?.products ?? [];

  const totalPrice =
    order?.totalAmount ??
    products.reduce(
      (sum, p) =>
        sum +
        ((p.productId?.assign_price ?? p.productId?.price ?? 0) *
          (p.quantity ?? 0)),
      0
    );

  const paymentMode = order?.paymentMode ?? "Cash";
  const isOnline = paymentMode.toString().toLowerCase() === "online";

  const renderItem = ({ item, index }) => {
    const prod = item.productId;
    const price = prod?.assign_price ?? prod?.price ?? 0;
    const qty = item.quantity ?? 0;

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 40).duration(260)}
        style={styles.row}
      >
        <View style={styles.rowLeft}>
          <Text style={styles.itemName} numberOfLines={2}>
            {prod?.title ?? prod?.name ?? "—"}
          </Text>
          <Text style={styles.itemMeta}>
            {qty} × ₹{price}
          </Text>
        </View>
        <Text style={styles.itemTotal}>₹{price * qty}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <AppHeader
          title="Order details"
          showBack
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.badgeWrap}>
          <View
            style={[styles.badge, isOnline ? styles.badgeOnline : styles.badgeCash]}
          >
            <Text
              style={[
                styles.badgeText,
                isOnline && styles.badgeTextOnline,
              ]}
            >
              {paymentMode}
            </Text>
          </View>
        </View>

        <FlatList
          data={products}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{totalPrice}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  badgeWrap: {
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryMuted,
  },
  badgeOnline: {
    backgroundColor: colors.accentMuted,
  },
  badgeText: {
    ...typography.captionMedium,
    color: colors.secondary,
  },
  badgeTextOnline: {
    color: colors.accent,
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  },
  rowLeft: {
    flex: 1,
  },
  itemName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemTotal: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.sm,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  totalAmount: {
    ...typography.h1,
    color: colors.textPrimary,
  },
});
