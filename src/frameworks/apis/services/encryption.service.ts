import { Injectable, Logger } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ENCRYPTION_SECRET_KEY } from 'src/frameworks/environment';

@Injectable()
export class EncryptionService {
  constructor() {
    this.encrypt();
  }

  async encrypt(data?) {
    Logger.log('data: ', data);
    data = {
      countryCode: '+91',
      phoneNumber: '7285860835',
      pin: '123456',
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_SECRET_KEY,
    ).toString();

    console.log('encryptedData: ', encryptedData);
    return encryptedData;
  }

  async decrypt(encryptedText: string) {
    return CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_SECRET_KEY).toString(
      CryptoJS.enc.Utf8,
    );
  }
}
