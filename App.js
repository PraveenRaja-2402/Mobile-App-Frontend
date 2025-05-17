import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ✅ Corrected Imports
import HomeScreen from './screens/HomeScreen';
import AdminLoginScreen from './screens/AdminLoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import HostelReportScreen from './screens/HostelReportScreen';
import TransportReportScreen from './screens/TransportReportScreen';
import CompanyReportScreen from './screens/CompanyReportScreen';
import HarassmentReportScreen from './screens/HarassmentReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false, // ✅ Hide headers for a cleaner UI
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Stack.Screen name="HostelReport" component={HostelReportScreen} />
                <Stack.Screen name="TransportReport" component={TransportReportScreen} />
                <Stack.Screen name="CompanyReport" component={CompanyReportScreen} />
                <Stack.Screen name="HarassmentReport" component={HarassmentReportScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
