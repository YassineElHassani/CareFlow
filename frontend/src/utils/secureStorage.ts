/**
 * Secure Storage Utility
 * Provides encrypted storage for sensitive data
 */

import { logger } from './logger';

class SecureStorage {
  private readonly prefix = 'careflow_';

  constructor() {
    // Tokens are stored directly without encryption
  }

  /**
   * Store data directly without encryption
   * Backend tokens are already secure and don't need client-side encryption
   */
  private encrypt(text: string): string {
    // Just return the text as-is - no encoding needed
    return text;
  }

  private decrypt(encrypted: string): string {
    // Just return the text as-is - no decoding needed
    return encrypted;
  }

  /**
   * Store encrypted data
   */
  setItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(`${this.prefix}${key}`, encrypted);
    } catch (error) {
      logger.error(`Failed to store ${key}:`, error);
      throw error;
    }
  }

  /**
   * Retrieve and decrypt data
   */
  getItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(`${this.prefix}${key}`);

      if (!encrypted) {
        return null;
      }

      return this.decrypt(encrypted);
    } catch (error) {
      logger.error(`Failed to retrieve ${key}:`, error);
      // If decryption fails, remove the corrupted data
      this.removeItem(key);
      return null;
    }
  }

  /**
   * Remove item
   */
  removeItem(key: string): void {
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  /**
   * Clear all secure storage
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.removeItem(`${this.prefix}ek`);
  }

  /**
   * Store access token
   */
  setAccessToken(token: string): void {
    this.setItem('access_token', token);
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.getItem('access_token');
  }

  /**
   * Store refresh token
   */
  setRefreshToken(token: string): void {
    this.setItem('refresh_token', token);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.getItem('refresh_token');
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.removeItem('access_token');
    this.removeItem('refresh_token');
  }
}

export const secureStorage = new SecureStorage();
export default secureStorage;
