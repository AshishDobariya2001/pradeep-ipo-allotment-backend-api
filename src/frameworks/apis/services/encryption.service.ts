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
    // data = {
    //   countryCode: '+91',
    //   phoneNumber: '7285860835',
    //   pin: '123456',
    // };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_SECRET_KEY,
    ).toString();

    console.log('encryptedData: ', encryptedData);
    return {
      success: true,
      data: encryptedData,
    };
  }

  async decrypt(encryptedText: string) {
    const bytes = await CryptoJS.AES.decrypt(
      encryptedText,
      ENCRYPTION_SECRET_KEY,
    );
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log('decryptedData:', decryptedData);
    return {
      success: true,
      data: JSON.parse(decryptedData),
    };
  }
}
