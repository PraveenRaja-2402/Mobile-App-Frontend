import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiClient from "../services/apiClient";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/tickets");
      setTickets(response?.data || []);
    } catch (error) {
      console.error("🚨 Error fetching tickets:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch tickets.");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderTicket = ({ item }) => (
    <View style={styles.ticketCard}>
      <Text style={styles.ticketTitle}>
        🧑‍💼 {item.employee_name || item.employee_id} - {item.sub_category}
      </Text>
      <Text style={styles.ticketStatus}>📌 Status: {item.status}</Text>
    </View>
  );

  const navOptions = [
    { screen: "AdminDashboard", label: "🔐 Admin Dashboard" },
    { screen: "HostelReport", label: "🏠 Hostel Report" },
    { screen: "TransportReport", label: "🚍 Transport Report" },
    { screen: "CompanyReport", label: "🏢 Company Report" },
    { screen: "HarassmentReport", label: "⚖️ Harassment Report" },
  ];

  const renderNavButton = ({ item }) => (
    <TouchableOpacity
      style={styles.navButton}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Text style={styles.navButtonText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏢 Workplace Concerns Reporting</Text>
      <Text style={styles.companyName}>Sakthi Knitting Private Limited</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginVertical: 20 }} />
      ) : tickets.length > 0 ? (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.ticketList}
        />
      ) : (
        <Text style={styles.noDataText}>📭 No reports found.</Text>
      )}

      <FlatList
        data={navOptions}
        renderItem={renderNavButton}
        keyExtractor={(item) => item.screen}
        contentContainerStyle={styles.navList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f9ff", padding: 24 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  companyName: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16, color: "#374151" },
  noDataText: { textAlign: "center", fontSize: 16, color: "#6b7280", marginVertical: 20 },
  ticketList: { paddingVertical: 10 },
  ticketCard: {
    width: 260,
    padding: 16,
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    marginHorizontal: 8,
    elevation: 4,
  },
  ticketTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#1e3a8a" },
  ticketStatus: { fontSize: 14, color: "#4b5563" },
  navList: { marginTop: 20 },
  navButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 12,
    elevation: 3,
  },
  navButtonText: { color: "white", textAlign: "center", fontSize: 18 },
});

export default HomeScreen;
