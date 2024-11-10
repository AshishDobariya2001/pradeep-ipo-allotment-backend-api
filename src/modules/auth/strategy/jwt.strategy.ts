// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { Request } from 'express';
// import { JWT_ACCESS_SECRET } from 'src/frameworks/environment';
// import { UserRepository } from '../repositories/user.repository';
// import { Users } from 'src/frameworks/entities';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly userRepository: UserRepository) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: JWT_ACCESS_SECRET,
//       passReqToCallback: true,
//     });
//   }

//   async validate(req: Request, payload) {
//     const accessToken = await req.headers.authorization.substring(7);
//     // const user = await this.userService.findById(
//     //   payload['https://hasura.io/jwt/claims']['x-hasura-user-id'],
//     // );

//     // // check token validate or not provided
//     // const validateToken = await getRepository(AccessTokenEntity).findOne({
//     //   userId: user.id,
//     //   token: accessToken,
//     // });

//     // if (!user || !validateToken) {
//     //   throw new UnauthorizedException(
//     //     'You are unauthorized to access',
//     //     ERROR_CODES.UNAUTHORIZED,
//     //   );
//     // }
//     // return user;
//   }
// }
