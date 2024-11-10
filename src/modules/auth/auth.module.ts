import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_ACCESS_EXPIRES_IN_DAYS,
  JWT_ACCESS_SECRET,
} from 'src/frameworks/environment';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { Users } from 'src/frameworks/entities';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      global: true,
      secret: JWT_ACCESS_SECRET,
      verifyOptions: {
        algorithms: ['HS256'],
      },
      signOptions: { expiresIn: `${JWT_ACCESS_EXPIRES_IN_DAYS}d` },
    }),
  ],
  controllers: [],
  providers: [AuthService, UserRepository],
  exports: [],
})
export class AuthModule {}
