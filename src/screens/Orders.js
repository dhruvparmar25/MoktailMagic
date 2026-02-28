import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { placeOrder } from "../api/auth";
import { PrimaryButton, AppHeader } from "../components";
import { colors, spacing, borderRadius, typography } from "../theme";

export default function Orders({ route, navigation }) {
  const { cart, total, paymentMode } = route.params ?? {};
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!cart?.length) return;
    setLoading(true);
    try {
      await placeOrder(
        (paymentMode || "CASH").toString().toUpperCase(),
        cart,
        total
      );
      Toast.show({
        type: "success",
        text1: "Order placed",
        text2: `Payment: ${paymentMode}. Thank you!`,
      });
      setTimeout(() => navigation.replace("OrderDetail"), 600);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Order failed",
        text2: err.response?.data?.message ?? err.message ?? "Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    Toast.show({ type: "info", text1: "Order cancelled" });
    setTimeout(() => navigation.replace("Home"), 400);
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 40).duration(280)}
      style={styles.row}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.title ?? item.name}
        </Text>
        <Text style={styles.itemMeta}>
          {item.qty} × ₹{item.assign_price ?? item.price}
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        ₹{(item.assign_price ?? item.price) * item.qty}
      </Text>
    </Animated.View>
  );

  const paymentLabel = (paymentMode || "Cash").toString();
  const isOnline = paymentLabel.toLowerCase() === "online";

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <AppHeader
          title="Confirm order"
          showBack
          onBackPress={() => navigation.goBack()}
        />

        <FlatList
          data={cart ?? []}
          keyExtractor={(item) => item._id + (item.qty ?? 0)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.paymentBadgeWrap}>
              <View
                style={[
                  styles.paymentBadge,
                  isOnline && styles.paymentBadgeOnline,
                ]}
              >
                <Text
                  style={[
                    styles.paymentBadgeText,
                    isOnline && styles.paymentBadgeTextOnline,
                  ]}
                >
                  {paymentLabel}
                </Text>
              </View>
            </View>
          }
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{total ?? 0}</Text>
          </View>
          <View style={styles.buttons}>
            <PrimaryButton
              label="Complete"
              onPress={handleComplete}
              loading={loading}
              variant="success"
              style={styles.btn}
            />
            <PrimaryButton
              label="Cancel"
              onPress={handleRemove}
              variant="ghost"
              style={styles.btn}
            />
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
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  paymentBadgeWrap: {
    marginBottom: spacing.md,
  },
  paymentBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryMuted,
  },
  paymentBadgeOnline: {
    backgroundColor: colors.accentMuted,
  },
  paymentBadgeText: {
    ...typography.captionMedium,
    color: colors.secondary,
  },
  paymentBadgeTextOnline: {
    color: colors.accent,
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
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  totalLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  totalAmount: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  btn: {
    flex: 1,
  },
});
