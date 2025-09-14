
import apiClient from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔹 Login
export const login = async (username, password) => {
  const response = await apiClient.post("/login", { username, password });

  // Save token / cookie
  if (response.data.token) {
    await AsyncStorage.setItem("token", response.data.token);
  }
  if (response.headers["set-cookie"]) {
    await AsyncStorage.setItem("cookie", response.headers["set-cookie"][0]);
  }

  return response.data; 
};

// 🔹 Get Categories
export const getCategories = async () => {
  const response = await apiClient.get("/category");
  return response.data;
};
