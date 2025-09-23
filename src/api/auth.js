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
export const placeOrder = async (paymentMode, products,totalAmount) => {
  // const totalAmount = products.reduce((sum, item) => sum + (item.assign_price || item.price) * item.qty, 0);

  const response = await apiClient.post("/orders", {
    paymentMode,
    products: products.map((item) => ({
      productId: item._id || item.id,
      quantity: item.qty,
    })),
    totalAmount, // ✅ totalAmount API me bheja
  });

  return response.data;
};

// 🔹 Get Orders (new)
export const getOrders = async () => {
  const token = await AsyncStorage.getItem("token"); // token fetch from storage
  console.log("token",token);
  
  const response = await apiClient.get("/orders", {
    
    headers: {
      Authorization: `Token ${token}`, // ✅ Token header
    },
  });

  return response.data;};
  // 🔹 Get single order by ID
export const getOrderById = async (orderId) => {
  const token = await AsyncStorage.getItem("token");

  const response = await apiClient.get(`/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Bearer token
    },
  });

  return response.data;
};




