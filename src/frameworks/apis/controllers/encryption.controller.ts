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
      properties: {
        payload: { type: 'object' },
      },
      required: ['payload'],
    },
  })
  async encrypt(@Body() data: { payload: string }) {
    return await this.encryptionService.encrypt(data.payload);
  }

  @Post('decrypt')
  @ApiOperation({ summary: 'Decrypt data' })
  @ApiResponse({
    status: 200,
    description: 'Returns decrypted data',
    type: String,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        payload: { type: 'string' },
      },
      required: ['payload'],
    },
  })
  async decrypt(@Body() data: { payload: string }) {
    return this.encryptionService.decrypt(data.payload);
  }
}
