import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as CryptoJS from 'crypto-js';
import { UserPlatformType } from '../enums';
import { ENCRYPTION_SECRET_KEY } from '../environment';

@Injectable()
export class DecryptMiddleware implements NestMiddleware {
  // private readonly secretKey = 'your-secret-key';

  use(req: Request, res: Response, next: NextFunction) {
    console.log('inside decryptions headers', req.headers['x-user-platform']);
    if (
      req.body &&
      req.body.payload &&
      req.headers['x-user-platform'] === UserPlatformType.SCREENER_WEB
    ) {
      try {
        console.log('req.body', req.body.payload);
        const bytes = CryptoJS.AES.decrypt(
          req.body.payload,
          ENCRYPTION_SECRET_KEY,
        );
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        req.body = decryptedData;
        console.log(req.body);
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
