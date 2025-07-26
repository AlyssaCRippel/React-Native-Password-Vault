import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddAccountScreen } from './src/screens/AddAccountScreen';
import { EditAccountScreen } from './src/screens/EditAccountScreen';
import { apiService } from './src/services/ApiService';
import { User } from './src/types/api';
import "./global.css";

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await apiService.getStoredToken();
      const storedUser = await apiService.getStoredUser();
      
      if (token && storedUser) {
        // Verify token is still valid
        const verification = await apiService.verifyToken();
        if (verification.valid) {
          setIsAuthenticated(true);
          setUser(storedUser);
        } else {
          // Token is invalid, clear storage
          await apiService.logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await apiService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <View className="bg-white rounded-3xl p-8 shadow-2xl items-center">
            <View className="bg-blue-100 rounded-full p-4 mb-4">
              <Text className="text-4xl">🔐</Text>
            </View>
            <ActivityIndicator size={50} color="#3b82f6" />
            <Text className="text-xl font-bold text-gray-800 mt-4">Password Vault</Text>
            <Text className="text-gray-500 mt-2">Securing your digital life...</Text>
          </View>
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
        >
          {isAuthenticated && user ? (
            // Authenticated stack
            <>
              <Stack.Screen name="Dashboard">
                {(props) => (
                  <DashboardScreen
                    {...props}
                    user={user}
                    onLogout={handleLogout}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AddAccount">
                {(props: any) => <AddAccountScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="EditAccount">
                {(props: any) => <EditAccountScreen {...props} />}
              </Stack.Screen>
            </>
          ) : (
            // Authentication stack
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    {...props}
                    onLoginSuccess={handleLoginSuccess}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register">
                {(props) => (
                  <RegisterScreen
                    {...props}
                    onRegisterSuccess={handleLoginSuccess}
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
