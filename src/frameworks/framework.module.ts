import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_ACCESS_EXPIRES_IN_DAYS,
  JWT_ACCESS_SECRET,
} from 'src/frameworks/environment';
import { Users } from 'src/frameworks/entities';
import { JwtStrategy } from './apis/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserContextRepository } from './apis/repositories/user-context.repository';
import { ApiModule } from './apis/api.module';

@Module({
  imports: [
    ApiModule,
    PassportModule,
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: JWT_ACCESS_SECRET,
      verifyOptions: {
        algorithms: ['RS256'],
      },
      signOptions: { expiresIn: `${JWT_ACCESS_EXPIRES_IN_DAYS}d` },
    }),
  ],
  controllers: [],
  providers: [UserContextRepository, JwtStrategy],
  exports: [JwtStrategy, ApiModule],
})
export class frameworksModule {}
