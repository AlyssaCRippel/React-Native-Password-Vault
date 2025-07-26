import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/ApiService';
import { Account, User } from '../types/api';

interface DashboardScreenProps {
  navigation: any;
  user: User;
  onLogout: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation, user, onLogout }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPasswordInput, setShowMasterPasswordInput] = useState(true);
  const [stats, setStats] = useState<{ totalAccounts: number } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiService.getAccountStats();
      setStats(response.stats);
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const loadAccounts = async () => {
    if (!masterPassword.trim()) {
      Alert.alert('Error', 'Please enter your master password to view accounts');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.getAccounts(masterPassword);
      setAccounts(response.accounts);
      setShowMasterPasswordInput(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load accounts');
      if (error.message.includes('Invalid master password')) {
        setMasterPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    if (!masterPassword.trim()) return;
    
    setRefreshing(true);
    try {
      const response = await apiService.getAccounts(masterPassword);
      setAccounts(response.accounts);
      await loadStats();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to refresh accounts');
    } finally {
      setRefreshing(false);
    }
  }, [masterPassword]);

  const handleDeleteAccount = (accountId: string, username: string) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete the account for "${username}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteAccount(accountId);
              setAccounts(accounts.filter(acc => acc.accountId !== accountId));
              await loadStats();
              Alert.alert('Success', 'Account deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await apiService.logout();
            onLogout();
          },
        },
      ]
    );
  };

  const resetView = () => {
    setShowMasterPasswordInput(true);
    setMasterPassword('');
    setAccounts([]);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      //mock implementation for clipboard copy
      Alert.alert('Copied', `${type} copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="bg-white shadow-sm px-6 py-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="bg-purple-100 rounded-full p-3 mr-4">
              <View className="w-6 h-6 bg-purple-600 rounded"></View>
            </View>
            <View>
              <Text className="text-2xl font-bold text-gray-900">Password Vault</Text>
              <Text className="text-sm text-purple-600 font-medium">Welcome back, {user.username}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-red-50 px-4 py-2 rounded-lg border border-red-200"
          >
            <Text className="text-red-600 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
        
        {stats && (
          <View className="mt-4 flex-row justify-center">
            <View className="bg-purple-600 rounded-2xl px-6 py-3 shadow-lg">
              <View className="flex-row items-center">
                <Text className="text-white font-bold text-lg">
                  {stats.totalAccounts} Account{stats.totalAccounts !== 1 ? 's' : ''} Secured
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showMasterPasswordInput ? (
          <View className="p-6">
            <View className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <View className="items-center mb-6">
                <View className="bg-purple-100 rounded-full p-4 mb-4">
                  <View className="w-8 h-8 bg-purple-600 rounded"></View>
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Unlock Your Vault
                </Text>
                <Text className="text-gray-600 text-center">
                  Enter your master password to access your stored accounts
                </Text>
              </View>
              <Text className="text-gray-600 text-sm mb-4">
                Your master password is required to decrypt and view your stored account passwords.
              </Text>
              
              <TextInput
                className="border-2 border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 mb-6 focus:border-purple-500"
                placeholder="Enter your master password"
                placeholderTextColor="#9CA3AF"
                value={masterPassword}
                onChangeText={setMasterPassword}
                secureTextEntry
              />
              
              <TouchableOpacity
                className={`${
                  loading ? 'bg-purple-400' : 'bg-purple-600'
                } px-8 py-4 rounded-xl flex-row justify-center items-center shadow-lg`}
                onPress={loadAccounts}
                disabled={loading}
              >
                {loading && (
                  <ActivityIndicator
                    size="small"
                    color="#ffffff"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text className="text-white text-lg font-bold">
                  {loading ? 'Unlocking...' : 'Unlock Vault'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="p-6">
            <View className="flex-row justify-between mb-6">
              <TouchableOpacity
                className="bg-purple-600 px-8 py-4 rounded-xl shadow-lg flex-1 mr-3"
                onPress={() => navigation.navigate('AddAccount', { masterPassword })}
              >
                <View className="flex-row items-center justify-center">
                  <Text className="text-white text-lg font-bold">
                    Add Account
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-50 px-6 py-4 rounded-xl border-2 border-gray-200 shadow-sm"
                onPress={resetView}
              >
                <View className="items-center">
                  <Text className="text-gray-700 text-sm font-semibold">
                    Lock
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            {accounts.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center shadow-lg border border-gray-100">
                <View className="bg-purple-100 rounded-full p-6 mb-6">
                  <View className="w-12 h-12 bg-purple-600 rounded"></View>
                </View>
                <Text className="text-gray-900 font-bold text-xl mb-3">
                  Your Vault is Empty
                </Text>
                <Text className="text-gray-600 text-center text-base leading-relaxed mb-6">
                  Start building your secure password vault by adding your first account. 
                  All passwords will be encrypted and protected.
                </Text>
                <TouchableOpacity
                  className="bg-purple-600 px-8 py-3 rounded-xl shadow-lg"
                  onPress={() => navigation.navigate('AddAccount', { masterPassword })}
                >
                  <Text className="text-white text-lg font-bold">
                    Add Your First Account
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              accounts.map((account) => (
                <View key={account.accountId} className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-gray-100">
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <View className="bg-purple-100 rounded-full p-2 mr-3">
                          <View className="w-4 h-4 bg-purple-600 rounded"></View>
                        </View>
                        <Text className="text-xl font-bold text-gray-900">
                          {account.username}
                        </Text>
                      </View>
                      {account.comment && (
                        <Text className="text-gray-600 text-sm mb-3 ml-11">
                          {account.comment}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('EditAccount', {
                            account,
                            masterPassword,
                          })
                        }
                        className="bg-purple-100 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-purple-700 font-semibold text-sm">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteAccount(account.accountId, account.username)}
                        className="bg-red-100 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-red-700 font-semibold text-sm">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="bg-gray-50 rounded-xl p-4 mb-3">
                    <Text className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Password</Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="font-mono text-base text-gray-900 flex-1 bg-white px-3 py-2 rounded-lg">
                        {account.password}
                      </Text>
                      <TouchableOpacity
                        onPress={() => copyToClipboard(account.password, 'Password')}
                        className="ml-3 bg-purple-600 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-white text-sm font-semibold">Copy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                    <View className="flex-row items-center">
                      <Text className="text-xs text-gray-400 mr-4">
                        ID: {account.accountId.substring(0, 8)}...
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400">
                      Created: {new Date(account.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
