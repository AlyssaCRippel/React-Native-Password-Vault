import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/ApiService';
import { Account, UpdateAccountRequest } from '../types/api';

interface EditAccountScreenProps {
  navigation: any;
  route: {
    params: {
      account: Account;
      masterPassword: string;
    };
  };
}

export const EditAccountScreen: React.FC<EditAccountScreenProps> = ({ navigation, route }) => {
  const { account, masterPassword } = route.params;
  
  const [formData, setFormData] = useState({
    username: account.username,
    password: account.password,
    comment: account.comment || '',
  });
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

  const hasChanges = (): boolean => {
    return (
      formData.username !== account.username ||
      formData.password !== account.password ||
      formData.comment !== (account.comment || '')
    );
  };

  const handleUpdateAccount = async () => {
    if (!validateForm()) return;

    if (!hasChanges()) {
      Alert.alert('No Changes', 'No changes were made to the account.');
      return;
    }

    setLoading(true);
    try {
      const updateData: UpdateAccountRequest = {};

      if (formData.username !== account.username) {
        updateData.username = formData.username;
      }
      
      if (formData.password !== account.password) {
        updateData.password = formData.password;
        updateData.masterPassword = masterPassword; 
      }
      
      if (formData.comment !== (account.comment || '')) {
        updateData.comment = formData.comment;
      }

      await apiService.updateAccount(account.accountId, updateData);
      
      Alert.alert(
        'Success',
        'Account updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete the account for "${account.username}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteAccount(account.accountId);
              Alert.alert('Success', 'Account deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white shadow-sm px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
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
              <Text className="text-2xl font-bold text-gray-900">Edit Account</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={handleDeleteAccount}
            className="bg-red-50 px-4 py-2 rounded-lg border border-red-200"
          >
            <Text className="text-red-600 font-semibold">Delete</Text>
          </TouchableOpacity>
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
                Edit Account Details
              </Text>
              <Text className="text-gray-600 text-center">
                Update your secure account information
              </Text>
            </View>
            <View className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Account Information
              </Text>
              <View className="bg-purple-50 rounded-xl p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm text-purple-600 font-semibold">Account ID</Text>
                  <Text className="font-mono text-sm text-purple-800">
                    {account.accountId.substring(0, 12)}...
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-purple-600 font-semibold">Created</Text>
                  <Text className="text-sm text-purple-800">
                    {new Date(account.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <Text className="text-xl font-bold text-gray-900 mb-6">
                Update Details
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
                      Generate New
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
              <View className="mb-6">
                <Text className="text-gray-700 text-base font-semibold mb-3">
                  Comment (Optional)
                </Text>
                <TextInput
                  className={`border-2 rounded-2xl px-5 py-4 text-lg bg-gray-50 h-24 ${
                    errors.comment ? 'border-red-400' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  style={{ textAlignVertical: 'top' }}
                  placeholder="e.g., Personal email account"
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

              {hasChanges() && (
                <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
                  <Text className="text-yellow-800 text-base font-bold mb-2">
                    Unsaved Changes
                  </Text>
                  <Text className="text-yellow-700 text-sm">
                    You have unsaved changes. Click "Update Account" to save them.
                  </Text>
                </View>
              )}
              <TouchableOpacity
                className={`${
                  (!hasChanges() || loading) ? 'bg-gray-400' : 'bg-purple-600'
                } px-8 py-5 rounded-2xl flex-row justify-center items-center shadow-lg`}
                onPress={handleUpdateAccount}
                disabled={!hasChanges() || loading}
              >
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text className="text-white text-xl font-bold">
                  {loading ? 'Updating...' : 'Update Account'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mt-6">
              <View className="flex-row items-start">
                <View className="bg-purple-100 rounded-full p-2 mr-4">
                  <View className="w-4 h-4 bg-purple-600 rounded"></View>
                </View>
                <View className="flex-1">
                  <Text className="text-purple-900 font-bold text-base mb-2">
                    Security Information
                  </Text>
                  <Text className="text-purple-700 text-sm leading-relaxed">
                    • Password changes require your master password for re-encryption{'\n'}
                    • All data is encrypted using AES with SHA1 key derivation{'\n'}
                    • Your master password is never stored in plain text
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
