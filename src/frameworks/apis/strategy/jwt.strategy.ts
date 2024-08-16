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

  async validate(req: Request, payload): Promise<Users> {
    const userPlatform = req.headers['x-user-platform'];
    if (!userPlatform) {
      throw new BusinessRuleException(ERROR.INVALID_PLATFORM);
    }
    const user = await this.usersRepository.validateUser(
      payload['userId'],
      userPlatform,
    );

    if (!user) {
      throw new BusinessRuleException(ERROR.UNAUTHORIZED);
    }
    return user;
  }
}
