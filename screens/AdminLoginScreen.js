import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import apiClient from "../services/apiClient";
import EncryptedStorage from "react-native-encrypted-storage";

const AdminLoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!employeeId.trim()) {
      Alert.alert("Validation Error", "Employee ID cannot be empty.");
      return false;
    }
    if (!password) {
      Alert.alert("Validation Error", "Password cannot be empty.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      const payload = { employee_id: employeeId.trim(), password };
      const response = await apiClient.post("/api/auth/login", payload);

      console.log("✅ Login API response:", response.data);

      const token = response?.data?.token;
      const role = response?.data?.role;

      if (token && role === "admin") {
        await EncryptedStorage.setItem("adminToken", token);
        console.log("✅ Token stored in EncryptedStorage");

        const savedToken = await EncryptedStorage.getItem("adminToken");
        console.log("🔐 Saved token (for debug):", savedToken);

        Alert.alert("Login Successful", "Welcome back!", [
          {
            text: "Continue",
            onPress: () => navigation.replace("AdminDashboard"),
          },
        ]);
      } else {
        Alert.alert("Login Failed", "Invalid credentials or unauthorized role.");
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      Alert.alert(
        "Login Error",
        "Could not connect to server. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <Text style={styles.label}>Employee ID</Text>
      <TextInput
        style={styles.input}
        value={employeeId}
        onChangeText={setEmployeeId}
        placeholder="Enter Employee ID"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <View style={styles.buttonWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          <Button title="Login" onPress={handleLogin} color="#2563eb" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    fontSize: 16,
    borderColor: "#cbd5e1",
    borderWidth: 1,
  },
  buttonWrapper: {
    marginTop: 32,
  },
});

export default AdminLoginScreen;
