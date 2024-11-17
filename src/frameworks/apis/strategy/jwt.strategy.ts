import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JWT_ACCESS_SECRET } from 'src/frameworks/environment';
import { UserContextRepository } from '../repositories/user-context.repository';
import { ERROR } from 'src/frameworks/error-code';
import { Users } from 'src/frameworks/entities';
import { BusinessRuleException } from 'src/frameworks/exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UserContextRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload): Promise<Users | object> {
    const userPlatform = req.headers['x-user-platform'];
    const userDeviceId = req.headers['x-user-device-id'];
    if (!userPlatform) {
      throw new BusinessRuleException(ERROR.INVALID_PLATFORM);
    }

    if (userDeviceId !== payload.deviceId) {
      throw new BusinessRuleException(ERROR.INVALIDATE_REQUEST);
    }

    const accessToken = req.headers['authorization']?.split(' ')[1];

    const accessTokenPayload = await this.usersRepository.verifyAccessToken(
      accessToken,
      userDeviceId,
      userPlatform,
    );

    if (!accessTokenPayload) {
      throw new BusinessRuleException(ERROR.UNAUTHORIZED);
    }

    if (payload?.userId) {
      const user = await this.usersRepository.validateUser(
        payload['userId'],
        userPlatform,
      );
      if (!user) {
        throw new BusinessRuleException(ERROR.UNAUTHORIZED);
      }
      return user;
    }
    return { id: payload['userId'], role: payload['role'] };
  }
}
