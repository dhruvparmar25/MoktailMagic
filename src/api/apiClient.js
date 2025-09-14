import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://9bedeb8acdf2.ngrok-free.app/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Interceptor to attach headers automatically
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    const cookie = await AsyncStorage.getItem("cookie");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (cookie) {
      config.headers.Cookie = cookie;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
