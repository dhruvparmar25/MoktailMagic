import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function OrderSummary({ route }) {
  const { order } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.title || item.name}</Text>
      <Text>Qty: {item.quantity}</Text>
      <Text>Price: ₹{(item.assign_price || item.price) * item.quantity}</Text>
    </View>
  );

  const totalPrice = order.products.reduce(
    (sum, p) => sum + (p.assign_price || p.price) * p.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>
      <FlatList
        data={order.products}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.summary}>
        <Text>Payment Mode: {order.paymentMode}</Text>
        <Text>Total Price: ₹{totalPrice}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  itemCard: { padding: 12, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, marginBottom: 12 },
  itemName: { fontWeight: "bold", marginBottom: 4 },
  summary: { padding: 16, borderTopWidth: 1, borderColor: "#ddd", marginTop: 12 },
});
