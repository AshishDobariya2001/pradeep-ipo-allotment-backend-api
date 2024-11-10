import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EncryptionController } from './controllers/encryption.controller';
import { EncryptionService } from './services/encryption.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { ApiKeyMiddleware } from '../middleware';

@Module({
  imports: [AuthModule],
  controllers: [EncryptionController],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(EncryptionController);
  }
}
