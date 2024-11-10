import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as CryptoJS from 'crypto-js';
import { Response as ExpressResponse } from 'express';
import { UserPlatformType } from '../enums';
import { ENCRYPTION_SECRET_KEY } from '../environment';

@Injectable()
export class EncryptMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const expressRes = res as ExpressResponse;

    const originalSend = expressRes.send.bind(expressRes);

    expressRes.send = (data: any) => {
      if (
        res.locals.isEncrypted ||
        expressRes.statusCode >= 400 ||
        req.headers['x-user-platform'] !== UserPlatformType.SCREENER_WEB
      ) {
        // console.log('inside encryption', req.headers['x-user-platform'], data);
        return originalSend(data);
      }
      try {
        // console.log('data before encryption:', data);

        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          ENCRYPTION_SECRET_KEY,
        ).toString();

        res.locals.isEncrypted = true;
        return originalSend({
          success: true,
          data: encryptedData,
        });
      } catch (error) {
        console.error('Encryption failed:', error);
        return originalSend(data);
      }
    };

    next();
  }
}
