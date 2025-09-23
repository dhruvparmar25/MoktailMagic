import React, { useEffect, useState } from "react";
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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // ✅ default today
  const [showPicker, setShowPicker] = useState(false);

  // Filter orders by selected date
  const filterOrdersByDate = (date, ordersList = orders) => {
    const filtered = ordersList.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getFullYear() === date.getFullYear() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getDate() === date.getDate()
      );
    });
    setFilteredOrders(filtered);
  };

  // Fetch orders from API
  const fetchOrders = async (pageNo = 1, append = false) => {
    try {
      if (pageNo === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await getOrders(pageNo, 10);

      if (response.status) {
        const orderArray = Array.isArray(response.data.docs)
          ? response.data.docs
          : [response.data.docs];

        setOrders((prev) => (append ? [...prev, ...orderArray] : orderArray));
        filterOrdersByDate(selectedDate, append ? [...orders, ...orderArray] : orderArray);
        setHasNextPage(response.data.hasNextPage);
      } else {
        setOrders([]);
        setFilteredOrders([]);
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
  };

  useEffect(() => {
    fetchOrders(1, false); // ✅ load orders on component mount
  }, []);

  const loadMore = () => {
    if (hasNextPage && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage, true);
    }
  };

  const onDateChange = (event, date) => {
    if (date) {
      setSelectedDate(date);
      filterOrdersByDate(date); // ✅ filter by new selected date
    }
    setShowPicker(Platform.OS === "ios"); // hide picker for Android
  };

  const renderOrder = ({ item }) => {
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
  onPress={() => navigation.navigate("OrderSummary", { order: item })} // ✅ selected order send
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

  if (loading && page === 1) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A86B" />
      </View>
    );
  }

  return (
<View style={styles.container}>
  {/* Header row: Title + Home button */}
  <View style={styles.headerRow}>
    <Text style={styles.title}>My Orders</Text>
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
  {filteredOrders.length === 0 ? (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No orders found for this date</Text>
    </View>
  ) : (
    <FlatList
      data={filteredOrders}
      keyExtractor={(item, index) => `${item._id}_${index}`}
      renderItem={renderOrder}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMore ? <ActivityIndicator size="small" color="#00A86B" /> : null
      }
    />
  )}
</View>

  );
}

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
