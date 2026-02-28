import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getOrders } from "../api/auth";
import { AppHeader } from "../components";
import { colors, spacing, borderRadius, typography } from "../theme";

export default function OrderDetail({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const fetchOrders = useCallback(
    async (pageNo = 1, append = false, date = selectedDate) => {
      try {
        if (pageNo === 1) setLoading(true);
        else setLoadingMore(true);
        const formatted = date.toISOString().split("T")[0];
        const response = await getOrders(formatted, formatted, pageNo, 10);
        if (response.status) {
          setTotalOrders(response.data?.totalDocs ?? 0);
          const arr = Array.isArray(response.data?.docs)
            ? response.data.docs
            : response.data?.docs
            ? [response.data.docs]
            : [];
          setOrders((prev) => (append ? [...prev, ...arr] : arr));
          setHasNextPage(response.data?.hasNextPage ?? false);
        } else {
          setOrders([]);
          setHasNextPage(false);
        }
      } catch (err) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Could not load orders",
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedDate]
  );

  useEffect(() => {
    fetchOrders(1, false);
  }, [fetchOrders]);

  const loadMore = () => {
    if (!hasNextPage || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchOrders(next, true);
  };

  const onDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setPage(1);
      fetchOrders(1, false, date);
    }
    if (Platform.OS === "android") setShowPicker(false);
  };

  const renderOrder = ({ item, index }) => {
    const products = item.products ?? [];
    const totalPrice =
      item.totalAmount ??
      products.reduce(
        (sum, p) =>
          sum + ((p.productId?.assign_price ?? 0) * (p.quantity ?? 0)),
        0
      );
    const updated = new Date(item.updatedAt ?? item.createdAt);
    const dateStr = updated.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeStr = updated.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 30).duration(260)}
        style={styles.cardWrap}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.card}
          onPress={() => navigation.navigate("OrderSummary", { order: item })}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardDate}>{dateStr}, {timeStr}</Text>
            <View
              style={[
                styles.badge,
                (item.paymentMode || "").toLowerCase() === "online"
                  ? styles.badgeOnline
                  : styles.badgeCash,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  (item.paymentMode || "").toLowerCase() === "online" &&
                    styles.badgeTextOnline,
                ]}
              >
                {item.paymentMode ?? "Cash"}
              </Text>
            </View>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardMeta}>
              {products.length} item{products.length !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.cardTotal}>₹{totalPrice}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <AppHeader
          title="Orders"
          subtitle={`${totalOrders} on selected date`}
          rightAction="Home"
          onRightPress={() => navigation.navigate("Home")}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {orders.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No orders for this date
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrder}
            contentContainerStyle={styles.list}
            onEndReached={loadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={styles.footerLoader}
                />
              ) : null
            }
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
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  dateButton: {
    marginHorizontal: spacing.sm,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dateButtonText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  cardWrap: {
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  cardDate: {
    ...typography.captionMedium,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.secondaryMuted,
  },
  badgeOnline: {
    backgroundColor: colors.accentMuted,
  },
  badgeText: {
    ...typography.label,
    color: colors.secondary,
  },
  badgeTextOnline: {
    color: colors.accent,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cardTotal: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLoader: {
    marginVertical: spacing.sm,
  },
});
