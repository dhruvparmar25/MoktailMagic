import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { getCategories, getProductsByCategory, placeOrder } from "../api/auth";


export default function Orders({ route, navigation }) {
  const { cart, total, paymentMode } = route.params;
  console.log({
  paymentMode: paymentMode.toUpperCase(),
  products: cart.map(item => ({ productId: item._id, quantity: item.qty })),
  totalAmount: total
});


const handleComplete = async () => {
  try {
    const res = await placeOrder(paymentMode.toUpperCase(), cart, total); // total ko pass karo

    Toast.show({
      type: "success",
      text1: "Order Completed ✅",
      text2: `Your order with ${paymentMode} payment is placed successfully.`,
      position: "bottom",
      visibilityTime: 2000,
    });

    setTimeout(() => navigation.replace("OrderDetail"), 2100);
  } catch (err) {
    console.log("Error placing order:", err);
    console.log(err.response?.data);

    Toast.show({
      type: "error",
      text1: "Order Failed ❌",
      text2: "Something went wrong. Try again.",
      position: "bottom",
      visibilityTime: 2000,
    });
  }
};



  const handleRemove = () => {
    Toast.show({
      type: "error",
      text1: "Order Removed ❌",
      text2: "Your order has been removed.",
      position: "bottom",
      visibilityTime: 2000,
    });
    setTimeout(() => navigation.replace("Home"), 2100);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.title || item.name}</Text>
      <Text style={styles.productQty}>Qty: {item.qty}</Text>
      <Text style={styles.productPrice}>₹{item.assign_price * item.qty || item.price * item.qty}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Order</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item._id || item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Payment Mode: {paymentMode}</Text>
        <Text style={styles.summaryText}>Total Price: ₹{total}</Text>
      </View>

  <View style={styles.btnRow}>
  <TouchableOpacity style={[styles.btn, { backgroundColor: "green" }]} onPress={handleComplete}>
    <Text style={styles.btnText}>Complete</Text>
  </TouchableOpacity>

  <TouchableOpacity style={[styles.btn, { backgroundColor: "red" }]} onPress={handleRemove}>
    <Text style={styles.btnText}>Remove</Text>
  </TouchableOpacity>
</View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  productQty: {
    fontSize: 14,
    color: "#555",
    marginHorizontal: 10,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  summaryContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
        marginBottom:30,

  },
  btn: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
