import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { EncryptionService } from '../services/encryption.service';

@ApiTags('Encryption')
@Controller('encryption')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('encrypt')
  @ApiOperation({ summary: 'Encrypt data' })
  @ApiResponse({ status: 200, description: 'Returns encrypted data' })
  @ApiBody({
    schema: {
      type: 'object',
    },
  })
  async encrypt(@Body() data) {
    return await this.encryptionService.encrypt(data);
  }

  @Post('decrypt')
  @ApiOperation({ summary: 'Decrypt data' })
  @ApiResponse({ status: 200, description: 'Returns decrypted data' })
  async decrypt(@Body() data: { encryptedText: string }) {
    return this.encryptionService.decrypt(data.encryptedText);
  }
}
