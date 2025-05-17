import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../services/apiClient';

const TransportReportScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subCategoryOptions = [
    'Bus Late', 'Route Issue', 'Driver Complaint',
    'Overcrowding', 'Safety Concern', 'Scheduling Issue', 'Vehicle Condition'
  ];

  useEffect(() => {
    const fetchEmployeeName = async () => {
      const trimmedId = employeeId.trim();
      if (!trimmedId) {
        setEmployeeName('');
        return;
      }

      try {
        const response = await apiClient.get(`/api/users/by-employee/${trimmedId}`);
        const name = response?.data?.name;
        if (name) {
          setEmployeeName(name);
        } else {
          setEmployeeName('');
          Alert.alert("⚠️ Not Found", "No employee found with that ID.");
        }
      } catch (error) {
        console.error("❌ Error fetching name:", error.response?.data || error.message);
        setEmployeeName('');
        Alert.alert("🚨 Error", "Unable to fetch employee name.");
      }
    };

    fetchEmployeeName();
  }, [employeeId]);

  const handleSubmit = async () => {
    const trimmedId = employeeId.trim();

    if (!trimmedId || !subCategory) {
      Alert.alert("⚠️ Missing Fields", "Please enter Employee ID and select a subcategory.");
      return;
    }

    const reportData = {
      employee_id: trimmedId,
      sub_category: subCategory,
    };

    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/api/transportReports', reportData);
      const result = response?.data;

      if (result?.success) {
        Alert.alert("✅ Success", "Report submitted successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("❌ Failed", result?.message || "Submission failed.");
      }
    } catch (error) {
      console.error("❌ Submission error:", error.response?.data || error.message);
      Alert.alert("🚨 Network Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚍 Transport Report</Text>

      <Text>Employee ID:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
        keyboardType="numeric"
      />

      <Text>Employee Name:</Text>
      <TextInput
        style={styles.input}
        value={employeeName}
        editable={false}
        placeholder="Name will auto-fill"
      />

      <Text>Subcategory:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={subCategory}
          onValueChange={(value) => setSubCategory(value)}
        >
          <Picker.Item label="Select Subcategory" value="" />
          {subCategoryOptions.map(option => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>

      <Button
        title={isSubmitting ? "Submitting..." : "Submit Report"}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default TransportReportScreen;
