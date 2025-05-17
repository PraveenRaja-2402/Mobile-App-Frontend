import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import apiClient from '../services/apiClient';

const HostelReportScreen = ({ navigation }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingName, setFetchingName] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const subCategoryOptions = [
        'Room Maintenance',
        'Food Quality',
        'Noise Issues',
        'Security',
        'Internet Problems',
        'Electricity Issue',
    ];

    useEffect(() => {
        const fetchEmployeeName = async () => {
            if (!employeeId.trim()) {
                setEmployeeName('');
                return;
            }

            try {
                setFetchingName(true);
                setErrorMessage('');
                const response = await apiClient.get(`/users/${employeeId}`);
                setEmployeeName(response?.data?.name || '');
            } catch (error) {
                console.error('❌ Error fetching employee name:', error.message);
                setEmployeeName('');
                setErrorMessage('Employee not found');
            } finally {
                setFetchingName(false);
            }
        };

        fetchEmployeeName();
    }, [employeeId]);

    const handleSubmit = async () => {
        if (!employeeId.trim() || !subCategory) {
            Alert.alert('⚠️ Incomplete Form', 'Please enter Employee ID and select a subcategory.');
            return;
        }

        const reportData = {
            employee_id: employeeId.trim(),
            sub_category: subCategory,
        };

        try {
            setLoading(true);
            const response = await apiClient.post('/hostel_reports', reportData);
            const res = response?.data;

            if (res?.success) {
                Alert.alert('✅ Success', 'Report submitted successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('❌ Submission Failed', res?.message || 'Unknown error occurred.');
            }
        } catch (error) {
            console.error('🚨 API Error:', {
                message: error.message,
                url: error.config?.url,
                status: error.response?.status || 'No Status',
                data: error.response?.data || 'No Response Data',
            });

            Alert.alert('🚨 Error', 'Network or server error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>🏠 Hostel Report</Text>

            <Text style={styles.label}>Employee ID:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Employee ID"
                value={employeeId}
                onChangeText={setEmployeeId}
                keyboardType="numeric"
            />

            {fetchingName ? (
                <ActivityIndicator size="small" color="#1e40af" />
            ) : (
                <>
                    <Text style={styles.label}>Employee Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={employeeName}
                        editable={false}
                        placeholder="Auto-filled name"
                    />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                </>
            )}

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
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    loadingIndicator: {
        marginTop: 20,
    },
});

export default HostelReportScreen;
