import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // The encryption key should ideally be stored in a secure way
  // For simplicity, we're using a fixed key here, but in production,
  // consider more secure approaches like environment variables
  private readonly SECRET_KEY = 'YOUR_SECRET_ENCRYPTION_KEY';

  constructor() {}

  /**
   * Encrypts a string value
   * @param value The string to encrypt
   * @returns Encrypted string
   */
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.SECRET_KEY).toString();
  }

  /**
   * Decrypts an encrypted string
   * @param encrypted The encrypted string
   * @returns The decrypted string
   */
  decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
