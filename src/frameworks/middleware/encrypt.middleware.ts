import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as CryptoJS from 'crypto-js';
import { Response as ExpressResponse } from 'express'; // Import Express Response type

@Injectable()
export class EncryptMiddleware implements NestMiddleware {
  private readonly secretKey = 'your-secret-key'; // Securely manage this

  use(req: Request, res: Response, next: NextFunction) {
    const expressRes = res as ExpressResponse; // Cast the response to Express Response

    const originalSend = expressRes.send.bind(expressRes); // Bind the original send method

    expressRes.send = (data: any) => {
      if (res.locals.isEncrypted || expressRes.statusCode >= 400) {
        return originalSend(data); // If yes, send it without reprocessing
      }
      try {
        console.log('data before encryption:', data);

        // Encrypt the response data
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(data),
          this.secretKey,
        ).toString();

        res.locals.isEncrypted = true;
        // Send the encrypted response
        return originalSend({
          success: true,
          data: encryptedData,
        });
      } catch (error) {
        console.error('Encryption failed:', error);
        // In case of encryption failure, send the original data
        return originalSend(data);
      }
    };

    next();
  }
}
