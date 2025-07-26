import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/ApiService';
import { RegisterRequest } from '../types/api';

interface RegisterScreenProps {
  navigation: any;
  onRegisterSuccess: (user: any) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation, onRegisterSuccess }) => {
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string }>({
    username: '',
    masterPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterRequest & { confirmPassword: string }>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterRequest & { confirmPassword: string }> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
    } else if (formData.username.length > 50) {
      newErrors.username = 'Username must not exceed 50 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username must only contain alphanumeric characters';
    }

    // Master password validation
    if (!formData.masterPassword) {
      newErrors.masterPassword = 'Master password is required';
    } else if (formData.masterPassword.length < 8) {
      newErrors.masterPassword = 'Master password must be at least 8 characters long';
    } else if (formData.masterPassword.length > 128) {
      newErrors.masterPassword = 'Master password must not exceed 128 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your master password';
    } else if (formData.masterPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerData: RegisterRequest = {
        username: formData.username,
        masterPassword: formData.masterPassword,
      };

      const response = await apiService.register(registerData);
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => onRegisterSuccess(response.user),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
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
            <View className="items-center mb-12">
              <View className="bg-purple-100 rounded-3xl p-8 mb-8">
                <Text className="text-7xl">🔐</Text>
              </View>
              <Text className="text-4xl font-bold text-gray-900 mb-3">
                Join Password Vault
              </Text>
              <Text className="text-gray-500 text-center text-lg font-medium">
                Your digital security starts here
              </Text>
            </View>
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Create Account
              </Text>
              <View className="mb-6">
                <Text className="text-gray-700 text-base font-semibold mb-3">
                  Username
                </Text>
                <TextInput
                  className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                    errors.username ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Choose a username (3-50 characters)"
                  placeholderTextColor="#9CA3AF"
                  value={formData.username}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, username: text })
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-2 ml-2">
                    {errors.username}
                  </Text>
                )}
              </View>
              <View className="mb-6">
                <Text className="text-gray-700 text-base font-semibold mb-3">
                  Master Password
                </Text>
                <TextInput
                  className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                    errors.masterPassword ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Create a strong master password (8+ characters)"
                  placeholderTextColor="#9CA3AF"
                  value={formData.masterPassword}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, masterPassword: text })
                  }
                  secureTextEntry
                />
                {errors.masterPassword && (
                  <Text className="text-red-500 text-sm mt-2 ml-2">
                    {errors.masterPassword}
                  </Text>
                )}
              </View>
              <View className="mb-8">
                <Text className="text-gray-700 text-base font-semibold mb-3">
                  Confirm Master Password
                </Text>
                <TextInput
                  className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                    errors.confirmPassword ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Confirm your master password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.confirmPassword}
                  onChangeText={(text: string) =>
                    setFormData({ ...formData, confirmPassword: text })
                  }
                  secureTextEntry
                />
                {errors.confirmPassword && (
                  <Text className="text-red-500 text-sm mt-2 ml-2">
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                className={`${
                  loading ? 'bg-purple-400' : 'bg-purple-600'
                } px-8 py-5 rounded-2xl flex-row justify-center items-center shadow-lg mb-6`}
                onPress={handleRegister}
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
              <View className="items-center">
                <TouchableOpacity onPress={navigateToLogin}>
                  <Text className="text-gray-600 text-base">
                    Already have an account?{' '}
                    <Text className="text-purple-600 font-semibold">Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <View className="flex-row items-start">
                <View className="bg-purple-100 rounded-full p-2 mr-4">
                  <Text className="text-purple-600 text-lg">🔒</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-purple-900 font-bold text-base mb-2">
                    Advanced Security Features
                  </Text>
                  <Text className="text-purple-700 text-sm leading-relaxed">
                    • AES-256 encryption for maximum protection{'\n'}
                    • Zero-knowledge architecture{'\n'}
                    • Local encryption keys{'\n'}
                    • Secure password generation
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
