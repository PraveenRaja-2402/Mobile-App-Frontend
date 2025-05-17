import React, { useState, useCallback } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import apiClient from "../services/apiClient";
import EncryptedStorage from "react-native-encrypted-storage";

const AdminDashboardScreen = ({ navigation }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = await EncryptedStorage.getItem("adminToken");

      if (!token) {
        handleSessionExpired("Unauthorized", "Please log in again.");
        return;
      }

      const response = await apiClient.get("/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(response?.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error.response?.data || error.message);

      if (error.response?.status === 401) {
        handleSessionExpired("Session expired", "Please log in again.");
      } else {
        Alert.alert("Error", "Failed to fetch tickets. Please try again.");
      }

      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpired = (title, message) => {
    Alert.alert(title, message, [
      {
        text: "OK",
        onPress: () =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          }),
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await EncryptedStorage.removeItem("adminToken");
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (error) {
      console.error("Logout failed:", error.message);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "#ef4444"; // red
      case "in progress":
        return "#f59e0b"; // amber
      case "resolved":
        return "#10b981"; // green
      default:
        return "#6b7280"; // gray
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const renderTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <Text style={styles.ticketText}>
        <Text style={styles.subCategory}>{item.sub_category}</Text> —{" "}
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Admin Dashboard</Text>

      {loading ? (
        <Text style={styles.loadingText}>⏳ Loading tickets...</Text>
      ) : tickets.length > 0 ? (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => String(item.id || item.ticket_id || Math.random())}
        />
      ) : (
        <Text style={styles.loadingText}>📭 No tickets found.</Text>
      )}

      <Button title="Logout" onPress={handleLogout} color="#ef4444" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1f2937",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginVertical: 20,
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  ticketText: {
    fontSize: 16,
    color: "#111827",
  },
  subCategory: {
    fontWeight: "bold",
    color: "#3b82f6",
  },
  status: {
    fontWeight: "bold",
  },
});

export default AdminDashboardScreen;
