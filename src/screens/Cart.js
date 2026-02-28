import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components";
import { colors, spacing, borderRadius, typography } from "../theme";

export default function Cart({ route, navigation }) {
  const cartItems = route.params?.cartItems ?? [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <AppHeader
          title="Cart"
          showBack
          onBackPress={() => navigation.goBack()}
        />
        {cartItems.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => item._id ?? String(index)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.title ?? item.name}
                </Text>
                <Text style={styles.itemMeta}>
                  {item.qty ?? 1} × ₹{item.assign_price ?? item.price}
                </Text>
              </View>
            )}
          />
        )}
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
    padding: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  row: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xs,
  },
  itemName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  itemMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
