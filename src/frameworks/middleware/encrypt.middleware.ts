import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
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
      if (res.locals.isEncrypted || expressRes.statusCode >= 400) {
        return originalSend(data);
      }
      try {
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
        Logger.error('Encryption failed:', error);
        return originalSend(data);
      }
    };

    next();
  }
}
