import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Toast from "react-native-toast-message";

export default function Orders({ route, navigation }) {
  const { cart, paymentMode } = route.params;

  const handleComplete = () => {
    Toast.show({
    type: "success",
    text1: "Order Completed ✅",
    text2: `Your order with ${paymentMode} payment is placed successfully.`,
    position: "bottom",
    visibilityTime: 2000,
  });
  setTimeout(() => {
    navigation.replace("Home"); // Home pe wapas
  }, 2100);
  };

  const handleRemove = () => {
   Toast.show({
    type: "error",
    text1: "Order Removed ❌",
    text2: "Your order has been removed.",
    position: "bottom",
    visibilityTime: 2000,
  });
  setTimeout(() => {
    navigation.replace("Home"); // Home pe wapas
  }, 2100);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <Text style={styles.itemText}>
        {item.name} x {item.qty} = ₹{item.price * item.qty}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Order</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={{ marginVertical: 10 }}
      />

      <Text style={styles.summaryText}>Payment: {paymentMode}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "green" }]}
          onPress={handleComplete}
        >
          <Text style={styles.btnText}>Complete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "red" }]}
          onPress={handleRemove}
        >
          <Text style={styles.btnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  itemRow: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  itemText: { fontSize: 16 },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  btn: {
    padding: 12,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  summaryText: { fontSize: 16, fontWeight: "600", marginTop: 10 },
});
