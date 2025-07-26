import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/ApiService';
import { LoginRequest } from '../types/api';

interface LoginScreenProps {
  navigation: any;
  onLoginSuccess: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    masterPassword: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.masterPassword) {
      newErrors.masterPassword = 'Master password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiService.login(formData);
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => onLoginSuccess(response.user),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8">
            <View className="items-center mb-16">
              <View className="bg-purple-100 rounded-3xl p-8 mb-8">
                <Text className="text-7xl">🔐</Text>
              </View>
              <Text className="text-4xl font-bold text-gray-900 mb-3">
                Password Vault
              </Text>
              <Text className="text-gray-500 text-center text-lg font-medium">
                Secure • Simple • Smart
              </Text>
            </View>
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Welcome Back
              </Text>
              <View className="mb-6">
                <Text className="text-gray-700 text-base font-semibold mb-3">
                  Username
                </Text>
                <View className="relative">
                  <TextInput
                    className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                      errors.username ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="Enter your username"
                    placeholderTextColor="#9CA3AF"
                    value={formData.username}
                    onChangeText={(text: string) =>
                      setFormData({ ...formData, username: text })
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-2 ml-2">
                    {errors.username}
                  </Text>
                )}
              </View>
              <View className="mb-8">
                <Text className="text-gray-700 text-base font-semibold mb-3">
                  Master Password
                </Text>
                <View className="relative">
                  <TextInput
                    className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                      errors.masterPassword ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                    }`}
                    placeholder="Enter your master password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.masterPassword}
                    onChangeText={(text: string) =>
                      setFormData({ ...formData, masterPassword: text })
                    }
                    secureTextEntry
                  />
                </View>
                {errors.masterPassword && (
                  <Text className="text-red-500 text-sm mt-2 ml-2">
                    {errors.masterPassword}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                className={`${
                  loading ? 'bg-purple-400' : 'bg-purple-600'
                } px-8 py-5 rounded-2xl flex-row justify-center items-center shadow-lg mb-6`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text className="text-white text-xl font-bold">
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
              <View className="items-center">
                <TouchableOpacity onPress={navigateToRegister}>
                  <Text className="text-gray-600 text-base">
                    Don't have an account?{' '}
                    <Text className="text-purple-600 font-semibold">Sign Up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <View className="flex-row items-start">
                <View className="bg-purple-100 rounded-full p-2 mr-4">
                  <Text className="text-purple-600 text-lg">🛡️</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-purple-900 font-bold text-base mb-2">
                    Bank-Level Security
                  </Text>
                  <Text className="text-purple-700 text-sm leading-relaxed">
                    Your passwords are protected with military-grade AES encryption. 
                    Your master password is never stored and cannot be recovered.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
