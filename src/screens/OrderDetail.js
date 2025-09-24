import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getOrders } from "../api/auth";

export default function OrderDetail({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // ---------------- Fetch Orders ----------------
  const fetchOrders = useCallback(
    async (pageNo = 1, append = false, date = selectedDate) => {
      try {
        if (pageNo === 1) setLoading(true);
        else setLoadingMore(true);

        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        const response = await getOrders(formattedDate, formattedDate, pageNo, 10);

        if (response.status) {
          setTotalOrders(response.data.totalDocs || 0);
          const orderArray = Array.isArray(response.data.docs)
            ? response.data.docs
            : [response.data.docs];

          setOrders(prev => (append ? [...prev, ...orderArray] : orderArray));
          setHasNextPage(response.data.hasNextPage);
        } else {
          setOrders([]);
          setHasNextPage(false);
        }
      } catch (err) {
        console.log("Error fetching orders:", err);
        Toast.show({
          type: "error",
          text1: "Failed to fetch orders",
          text2: "Please try again later",
        });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedDate]
  );

  // ---------------- Initial Load ----------------
  useEffect(() => {
    fetchOrders(1, false);
  }, [fetchOrders]);

  // ---------------- Load More ----------------
  const loadMore = () => {
    if (!hasNextPage || loadingMore) return; // guard
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, true);
  };

  // ---------------- Date Picker ----------------
  const onDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setPage(1); // reset pagination
      fetchOrders(1, false, date);
    }
    setShowPicker(Platform.OS === "ios");
  };

  // ---------------- Render Single Order ----------------
  const renderOrder = ({ item, index }) => {
    const products = item.products || [];
    const totalPrice = products.reduce(
      (sum, p) => sum + ((p.productId?.assign_price || 0) * (p.quantity || 0)),
      0
    );

    const orderDate = new Date(item.updatedAt);
    const formattedDate = `${("0" + orderDate.getDate()).slice(-2)}-${(
      "0" +
      (orderDate.getMonth() + 1)
    ).slice(-2)}-${orderDate.getFullYear()}`;
    const formattedTime = orderDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate("OrderSummary", { order: item })}
      >
        <Text style={styles.orderId}>
          {formattedDate}, {formattedTime}
        </Text>
        <Text>Payment Mode: {item.paymentMode}</Text>
        <Text>Total Items: {products.length}</Text>
        <Text>Total Price: ₹{totalPrice}</Text>
      </TouchableOpacity>
    );
  };

  // ---------------- Loading State ----------------
  if (loading && page === 1) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A86B" />
      </View>
    );
  }

  // ---------------- Render ----------------
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Orders ({totalOrders})</Text>
        <TouchableOpacity
          style={styles.orderBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeBtn}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      <Button
        title={`Selected Date: ${selectedDate.toLocaleDateString()}`}
        onPress={() => setShowPicker(true)}
      />

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No orders found for this date</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, index) => `${item._id}_${index}`}
          renderItem={renderOrder}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3} // triggers earlier for better UX
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#00A86B" /> : null
          }
        />
      )}
    </View>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  orderId: { fontWeight: "bold", marginBottom: 5 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#555" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Title left, Home button right
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderBtn: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  homeBtn: {
    color: "#fff",
    fontWeight: "bold",
  },

});
