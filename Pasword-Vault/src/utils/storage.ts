import * as SecureStore from 'expo-secure-store';

export class StorageService {
  static async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing item:', error);
      throw new Error('Failed to store data securely');
    }
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving item:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      // Clear all auth-related items
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      await SecureStore.deleteItemAsync('master_password_temp');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
