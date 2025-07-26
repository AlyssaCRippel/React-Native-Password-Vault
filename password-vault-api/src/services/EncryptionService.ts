import CryptoJS from 'crypto-js';

export class EncryptionService {
  /**
   * Encrypts the master password using AES and returns Base64 encoded result
   * @param masterPassword - The plain text master password
   * @param secretKey - The secret key for encryption
   * @returns Base64 encoded encrypted master password
   */
  static encryptMasterPassword(masterPassword: string, secretKey: string): string {
    const encrypted = CryptoJS.AES.encrypt(masterPassword, secretKey);
    return encrypted.toString(); // Returns Base64 encoded string
  }

  /**
   * Decrypts the master password from Base64 encoded AES encrypted data
   * @param encryptedMasterPassword - Base64 encoded encrypted master password
   * @param secretKey - The secret key for decryption
   * @returns Decrypted plain text master password
   */
  static decryptMasterPassword(encryptedMasterPassword: string, secretKey: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedMasterPassword, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Creates SHA1 hash of the master password to use as encryption key for account passwords
   * @param masterPassword - The plain text master password
   * @returns SHA1 hash of the master password
   */
  static createEncryptionKey(masterPassword: string): string {
    return CryptoJS.SHA1(masterPassword).toString();
  }

  /**
   * Encrypts account password using AES with SHA1 hash of master password as key
   * @param accountPassword - The plain text account password
   * @param masterPassword - The master password (used to generate encryption key)
   * @returns Base64 encoded encrypted account password
   */
  static encryptAccountPassword(accountPassword: string, masterPassword: string): string {
    const encryptionKey = this.createEncryptionKey(masterPassword);
    const encrypted = CryptoJS.AES.encrypt(accountPassword, encryptionKey);
    return encrypted.toString(); // Returns Base64 encoded string
  }

  /**
   * Decrypts account password using AES with SHA1 hash of master password as key
   * @param encryptedAccountPassword - Base64 encoded encrypted account password
   * @param masterPassword - The master password (used to generate decryption key)
   * @returns Decrypted plain text account password
   */
  static decryptAccountPassword(encryptedAccountPassword: string, masterPassword: string): string {
    const decryptionKey = this.createEncryptionKey(masterPassword);
    const decrypted = CryptoJS.AES.decrypt(encryptedAccountPassword, decryptionKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Generates a random account ID
   * @returns Random account ID string
   */
  static generateAccountId(): string {
    return CryptoJS.lib.WordArray.random(16).toString();
  }

  /**
   * Validates if the provided master password matches the stored encrypted version
   * @param inputPassword - The password input by user
   * @param storedEncryptedPassword - The stored encrypted master password
   * @param secretKey - The secret key used for encryption/decryption
   * @returns True if passwords match, false otherwise
   */
  static validateMasterPassword(
    inputPassword: string, 
    storedEncryptedPassword: string, 
    secretKey: string
  ): boolean {
    try {
      const decryptedPassword = this.decryptMasterPassword(storedEncryptedPassword, secretKey);
      return inputPassword === decryptedPassword;
    } catch (error) {
      console.error('Error validating master password:', error);
      return false;
    }
  }
}
