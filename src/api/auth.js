import apiClient from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Login
export const login = async (username, password) => {
  const response = await apiClient.post("/login", { username, password });

  if (response.data.jwt) {
    await AsyncStorage.setItem("token", response.data.jwt);
  }

  return response.data;
};

// 🔹 Get Categories
export const getCategories = async () => {
  const response = await apiClient.get("/category");
  return response.data;
};
// 🔹 Get Products by Category
export const getProductsByCategory = async (categoryId) => {
  const response = await apiClient.post("/products", { categoryId });
  return response.data;
};

// 🔹 Place Order
export const placeOrder = async (paymentMode, products) => {
  const response = await apiClient.post("/orders", {
    paymentMode,
    products: products.map((item) => ({
      productId: item._id,
      quantity: item.qty,
    })),
  });

  return response.data;
};


