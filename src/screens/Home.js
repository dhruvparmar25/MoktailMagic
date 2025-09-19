import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { getCategories, getProductsByCategory, placeOrder } from "../api/auth";

export default function Home({ navigation }) {
  const [cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);   // 👈 products state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Category select hote hi products fetch karna
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category._id);
    setLoading(true);
    try {
      const res = await getProductsByCategory(category._id);
      setProducts(res.data);  // 👈 API se products
      console.log("Produt", res.data);

    } catch (err) {
      console.log("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cart me add karna
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem.qty === 1) {
      setCart(cart.filter((item) => item._id !== product._id));
    } else {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty - 1 } : item
        )
      );
    }
  };

  const renderProduct = ({ item }) => {
    console.log(item);

    const cartItem = cart.find((c) => c._id === item._id);

    return (
      <View style={styles.productCard}>
        <Text style={styles.productText}>
          {item.title} - ₹{item.assign_price}
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

  const totalPrice = cart.reduce((sum, item) => sum + item.assign_price * item.qty, 0);

  return (
    <View style={styles.container}>
      {/* Categories Box */}
      <View style={styles.categoryBox}>
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                selectedCategory === item._id && styles.activeCategory,
              ]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item._id && styles.activeCategoryText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products Box */}
      <View style={styles.productBox}>
        {loading ? (
          <Text style={{ marginTop: 20 }}>Loading products...</Text>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
          />
        ) : (
          <Text style={{ marginTop: 20 }}>
            {selectedCategory ? "No products found" : "Select a category"}
          </Text>
        )}
      </View>

      {/* Cart Summary */}
      <View style={styles.cartSummary}>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Cart: {cart.length} items | Total: ₹{totalPrice}
        </Text>

        {cart.length > 0 && (
          <>
            {/* Payment Mode */}
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

            {/* Checkout */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={async () => {
                try {
                  // Home.js me checkout ke baad
const res = await placeOrder(paymentMode.toUpperCase(), cart);
setCart([]); // cart clear
navigation.navigate("Orders", { orderDetails: res });

                } catch (err) {
                  console.log("Error placing order:", err);
                }
              }}
            >
              <Text style={styles.checkoutText}>
                Proceed to Pay ({paymentMode})
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
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
              </TouchableOpacity> */}
          </>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },

  // ✅ Category Box
  categoryBox: {
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginBottom: 15,
  },
  categoryList: { paddingRight: 10 },
  categoryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#000",
    marginRight: 10,
    backgroundColor: "#fff",
  },
  activeCategory: { backgroundColor: "#000" },
  categoryText: { color: "#000", fontWeight: "600" },
  activeCategoryText: { color: "#fff" },

  // ✅ Product Box
  productBox: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  productCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  productText: { fontSize: 16, fontWeight: "500" },

  // ✅ Cart Summary (neeche same)
  cartSummary: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
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
