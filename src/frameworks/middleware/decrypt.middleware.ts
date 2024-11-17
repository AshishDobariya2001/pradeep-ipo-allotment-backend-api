import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as CryptoJS from 'crypto-js';
import { ENCRYPTION_SECRET_KEY } from '../environment';
import { ERROR } from '../error-code';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.method !== 'GET') {
      try {
        if (!req.body.payload) {
          return res.status(402).send(ERROR.NO_PAYLOAD_FOUND);
        }
        Logger.log('req.body', req.body.payload);
        const bytes = CryptoJS.AES.decrypt(
          req.body.payload,
          ENCRYPTION_SECRET_KEY,
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        // Logger.log('decryptedData:', decryptedData);

        req.body = decryptedData;
        next();
      } catch (error) {
        console.error('Decryption failed:', error);
        return res.status(400).send('Invalid encrypted data');
      }
    } else {
      next();
    }
  }
}
