import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { getCategories } from "../api/auth";



const productsData = {
  Fruits: [
    { id: 1, name: "Apple", price: 100 },
    { id: 2, name: "Banana", price: 50 },
  ],
  Vegetables: [
    { id: 3, name: "Carrot", price: 40 },
    { id: 4, name: "Tomato", price: 30 },
  ],
  Snacks: [
    { id: 5, name: "Chips", price: 20 },
    { id: 6, name: "Biscuits", price: 35 },
  ],
};

export default function Home({ navigation }) {
  const [cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash"); // default Cash

   const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };
    fetchData();
  }, []);

  // Product ko cart me qty ke sath add karna
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem.qty === 1) {
      setCart(cart.filter((item) => item.id !== product.id));
    } else {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty - 1 } : item
        )
      );
    }
  };

  const renderProduct = ({ item }) => {
    const cartItem = cart.find((c) => c.id === item.id);

    return (
      <View style={styles.productCard}>
        <Text style={styles.productText}>
          {item.name} - ₹{item.price}
        </Text>

        {cartItem ? (
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decreaseQty(item)}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{cartItem.qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <View style={styles.container}>
      {/* Categories */}
       <Text style={styles.title}>Categories</Text>

      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => navigation.navigate("Products", { category: item })}
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Products */}
      {categories ? (
        <FlatList
          data={productsData[categories]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
        />
      ) : (
        <Text style={{ marginTop: 20 }}>
          Select a category to view products
        </Text>
      )}

      {/* Cart Summary */}
      <View style={styles.cartSummary}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Cart: {cart.length} items | Total: ₹{totalPrice}
        </Text>

        {cart.length > 0 && (
          <>
            {/* Payment Mode Selection */}
            <View style={styles.paymentContainer}>
              <Text style={{ fontWeight: "600", marginBottom: 5 }}>
                Select Payment Mode:
              </Text>

              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => setPaymentMode("Cash")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      paymentMode === "Cash" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.paymentText}>Cash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.paymentOption}
                  onPress={() => setPaymentMode("Online")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      paymentMode === "Online" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.paymentText}>Online</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() =>
                navigation.navigate("Orders", {
                  cart,
                  total: totalPrice,
                  paymentMode,
                })
              }
            >
              <Text style={styles.checkoutText}>
                Proceed to Pay ({paymentMode})
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  categoryContainer: { flexDirection: "row", justifyContent: "space-around" },
  categoryBtn: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#000",
  },
  activeCategory: { backgroundColor: "#000" },
  categoryText: { color: "#000", fontWeight: "bold" },
  activeCategoryText: { color: "#fff" },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
  },
  productText: { fontSize: 16, fontWeight: "500" },
  cartBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cartBtnText: { color: "#fff", fontWeight: "bold" },
  qtyContainer: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  qtyText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  qtyValue: { marginHorizontal: 10, fontSize: 16, fontWeight: "600" },
  cartSummary: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
  },
  paymentContainer: { marginVertical: 10 },
  paymentOptions: { flexDirection: "row", marginTop: 5 },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#000",
  },
  paymentText: { fontSize: 14 },
  checkoutBtn: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
