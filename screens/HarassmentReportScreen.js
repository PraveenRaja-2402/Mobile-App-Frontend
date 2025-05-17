import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../services/api';

const HarassmentReportScreen = ({ navigation }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subCategoryOptions = [
        "Verbal Abuse", "Discrimination", "Bullying",
        "Sexual Harassment", "Cyber Harassment",
        "Workplace Intimidation", "Gender Bias"
    ];

    // Auto-fetch employee name when ID is entered
    useEffect(() => {
        const fetchEmployee = async () => {
            if (!employeeId.trim()) return;

            try {
                setLoading(true);
                setError('');
                const response = await apiClient.get(`/users/${employeeId}`);
                setEmployeeName(response.data?.name || '');
            } catch {
                setEmployeeName('');
                setError('❌ Employee not found');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId]);

    const handleSubmit = async () => {
        if (!employeeId || !subCategory) {
            Alert.alert("Validation Error", "🚨 Please enter Employee ID and select a subcategory.");
            return;
        }

        try {
            setLoading(true);
            const reportData = { employee_id: employeeId, sub_category: subCategory };
            const response = await apiClient.post('/harassment_reports', reportData);

            if (response?.data?.success) {
                Alert.alert("Success", "✅ Report submitted successfully!", [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert("Submission Failed", response?.data?.message || '❌ Unknown error occurred.');
            }
        } catch (error) {
            console.error("API Error:", error);
            Alert.alert("Error", "❌ Something went wrong while submitting the report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>⚖️ Harassment Report</Text>

            <Text style={styles.label}>Employee ID:</Text>
            <TextInput
                style={styles.input}
                value={employeeId}
                onChangeText={setEmployeeId}
                placeholder="Enter Employee ID"
                keyboardType="numeric"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.label}>Employee Name:</Text>
            <TextInput
                style={styles.input}
                value={employeeName}
                editable={false}
                placeholder="Employee name will appear here"
            />

            <Text style={styles.label}>Subcategory:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={subCategory}
                    onValueChange={setSubCategory}
                >
                    <Picker.Item label="-- Select Subcategory --" value="" />
                    {subCategoryOptions.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
            </View>

            <Button title="Submit Report" onPress={handleSubmit} color="#1e40af" />

            {loading && <ActivityIndicator size="large" color="#3b82f6" style={styles.loadingIndicator} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
        marginBottom: 20
    },
    errorText: { color: 'red', marginBottom: 10 },
    loadingIndicator: { marginTop: 20 }
});

export default HarassmentReportScreen;
