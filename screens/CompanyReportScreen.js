import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, Button, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import apiClient from "../services/api";

const CompanyReportScreen = ({ navigation }) => {
    const [employeeId, setEmployeeId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const subCategoryOptions = [
        "Salary Issue", "Restroom Cleanliness", "Workplace Harassment",
        "Infrastructure Problem", "Office Supplies", "Security Concern"
    ];

    // 🔹 Fetch Employee Name Debounced to Avoid Excess API Calls
    useEffect(() => {
        if (!employeeId.trim()) return;
        
        const timer = setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                const response = await apiClient.get(`/users/${employeeId.trim()}`);
                setEmployeeName(response.data?.name || "");
            } catch (error) {
                setEmployeeName("");
                setError("❌ Employee not found.");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [employeeId]);

    // 🔹 Handle Form Submission
    const handleSubmit = async () => {
        if (!employeeId.trim() || !subCategory) {
            Alert.alert("🚨 Missing Details", "Please enter Employee ID and select a subcategory.");
            return;
        }

        try {
            setLoading(true);
            const reportData = { employee_id: employeeId.trim(), sub_category: subCategory };

            const response = await apiClient.post("/company_reports", reportData);

            if (response?.data?.success) {
                Alert.alert("✅ Success", "Report submitted successfully!");
                navigation.goBack();
            } else {
                Alert.alert("❌ Submission Failed", response?.data?.message || "Unknown error.");
            }
        } catch (error) {
            console.error("🚨 API Error:", error);
            Alert.alert("❌ Error", "An issue occurred while submitting the report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>🏢 Company Report</Text>

                <Text>Employee ID:</Text>
                <TextInput
                    style={styles.input}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                    placeholder="e.g., 101"
                    keyboardType="numeric"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Text>Employee Name:</Text>
                <TextInput style={[styles.input, styles.disabledInput]} value={employeeName} editable={false} />

                <Text>Subcategory:</Text>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={subCategory} onValueChange={setSubCategory}>
                        <Picker.Item label="-- Select Subcategory --" value="" enabled={false} />
                        {subCategoryOptions.map((option) => (
                            <Picker.Item key={option} label={option} value={option} />
                        ))}
                    </Picker>
                </View>

                <Button title={loading ? "Submitting..." : "Submit Report"} onPress={handleSubmit} disabled={loading} />
                {loading && <ActivityIndicator size="large" color="#3b82f6" style={styles.loadingIndicator} />}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, justifyContent: "center" },
    header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
    disabledInput: { backgroundColor: "#f0f0f0" },
    pickerContainer: { borderWidth: 1, borderRadius: 5, marginVertical: 10 },
    errorText: { color: "red", marginVertical: 5 },
    loadingIndicator: { marginTop: 20 },
});

export default CompanyReportScreen;
