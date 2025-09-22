import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { getOrders } from "../api/auth";

export default function OrderDetail({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders(); // API response {status:true, data:[...orders]}
        if (response.status) {
          // Agar API ek object me single order de raha hai
          const orderArray = Array.isArray(response.data) ? response.data : [response.data];
          console.log("orderArray",orderArray);
          
          setOrders(orderArray);
        } else {
          setOrders([]);
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
      }
    };

    fetchOrders();
  }, []);

const renderOrder = ({ item }) => {
  console.log("item",item);
  const products = item.products || []; // fallback
  const totalPrice = products.reduce(
    (sum, p) => sum + ((p.assign_price || p.price || 0) * (p.quantity || 0)),
    0
  );


  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate("OrderSummary", { order: item })}
    >
     
      
      <Text style={styles.orderId}>Order ID: {item._id}</Text>
      <Text>Payment Mode: {item.paymentMode}</Text>
      <Text>Total Items: {products.length}</Text>
      <Text>Total Price: ₹{totalPrice}</Text>
    </TouchableOpacity>
  );
};


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00A86B" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No orders found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
   <FlatList
  data={orders}
  keyExtractor={(item) => item._id || Math.random().toString()} // fallback
  renderItem={renderOrder}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  orderCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  orderId: { fontWeight: "bold", marginBottom: 4 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#999" },
});
