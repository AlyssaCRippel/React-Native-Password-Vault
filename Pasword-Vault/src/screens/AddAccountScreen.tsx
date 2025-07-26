import React, { useState } from 'react';
import {View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/ApiService';
import { CreateAccountRequest } from '../types/api';

interface AddAccountScreenProps {
    navigation: any;
    route: {
        params: {
            masterPassword: string;
        };
    };
}

export const AddAccountScreen: React.FC<AddAccountScreenProps> = ({ navigation, route }) => {
    const { masterPassword } = route.params;

    const [formData, setFormData] = useState({ username: '', password: '', comment: '' });
    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<typeof formData> = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Account username is required';
        } else if (formData.username.length > 100) {
            newErrors.username = 'Username must not exceed 100 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length > 256) {
            newErrors.password = 'Password must not exceed 256 characters';
        }

        if (formData.comment && formData.comment.length > 500) {
            newErrors.comment = 'Comment must not exceed 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateRandomPassword = () => {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let password = '';

        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        setFormData({ ...formData, password });
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const createAccountData: CreateAccountRequest = {
                username: formData.username,
                password: formData.password,
                comment: formData.comment || undefined,
                masterPassword,
            };

            await apiService.createAccount(createAccountData);

            Alert.alert(
                'Success',
                'Account created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="bg-white shadow-sm px-6 py-4 border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        className="bg-gray-100 p-2 rounded-full mr-4"
                    >
                        <Text className="text-gray-700 font-bold text-lg">←</Text>
                    </TouchableOpacity>
                    <View className="flex-row items-center">
                        <View className="bg-purple-100 rounded-full p-2 mr-3">
                            <View className="w-4 h-4 bg-purple-600 rounded"></View>
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">Add Account</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="p-6">
                        <View className="items-center mb-8">
                            <View className="bg-purple-100 rounded-full p-4 shadow-lg mb-4">
                                <View className="w-8 h-8 bg-purple-600 rounded"></View>
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-2">
                                Secure New Account
                            </Text>
                            <Text className="text-gray-600 text-center">
                                Add a new account to your encrypted vault
                            </Text>
                        </View>
                        <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                            <Text className="text-xl font-bold text-gray-900 mb-6">
                                Account Details
                            </Text>
                            <View className="mb-6">
                                <Text className="text-gray-700 text-base font-semibold mb-3">
                                    Account Username
                                </Text>
                                <TextInput
                                    className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                                        errors.username ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                                    }`}
                                    placeholder="e.g., john.doe@email.com"
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
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-gray-700 text-base font-semibold">
                                        Password
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={generateRandomPassword}
                                        className="bg-purple-100 px-4 py-2 rounded-lg"
                                    >
                                        <Text className="text-purple-700 text-sm font-semibold">
                                            Generate
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 ${
                                        errors.password ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                                    }`}
                                    placeholder="Enter or generate a secure password"
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.password}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, password: text })
                                    }
                                    secureTextEntry
                                />
                                {errors.password && (
                                    <Text className="text-red-500 text-sm mt-2 ml-2">
                                        {errors.password}
                                    </Text>
                                )}
                            </View>
                            <View className="mb-8">
                                <Text className="text-gray-700 text-base font-semibold mb-3">
                                    Comment (Optional)
                                </Text>
                                <TextInput
                                    className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 h-24 ${
                                        errors.comment ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                                    }`}
                                    style={{ textAlignVertical: 'top' }}
                                    placeholder="e.g., Personal email account, Work login, etc."
                                    placeholderTextColor="#9CA3AF"
                                    value={formData.comment}
                                    onChangeText={(text: string) =>
                                        setFormData({ ...formData, comment: text })
                                    }
                                    multiline
                                    numberOfLines={3}
                                />
                                {errors.comment && (
                                    <Text className="text-red-500 text-sm mt-2 ml-2">
                                        {errors.comment}
                                    </Text>
                                )}
                            </View>
                            <View className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-6">
                                <View className="flex-row items-start">
                                    <View className="bg-purple-100 rounded-full p-2 mr-4">
                                        <View className="w-4 h-4 bg-purple-600 rounded"></View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-purple-900 font-bold text-base mb-2">
                                            Security Information
                                        </Text>
                                        <Text className="text-purple-700 text-sm leading-relaxed">
                                            Your account password will be encrypted using AES encryption with a SHA1 hash
                                            of your master password as the encryption key. This ensures maximum security
                                            for your stored credentials.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                className={`${
                                    loading ? 'bg-purple-400' : 'bg-purple-600'
                                } px-8 py-5 rounded-2xl flex-row justify-center items-center shadow-lg`}
                                onPress={handleCreateAccount}
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
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
