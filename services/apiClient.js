import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";

// 🌐 Base API client configuration for Android emulator
const apiClient = axios.create({
  baseURL: "http://10.0.2.2:3000", // ✅ Host machine IP for Android emulator
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token securely before every request
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await EncryptedStorage.getItem("adminToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Auth token attached.");
      } else {
        console.warn("⚠️ No token found in EncryptedStorage.");
      }
    } catch (error) {
      console.error("❌ Error retrieving token:", error.message || error);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error.message || error);
    return Promise.reject(error);
  }
);

export default apiClient;
