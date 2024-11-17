import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { compareHash, generateHash } from 'src/frameworks/utility/bycrypt';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ROLES, UserPlatformType } from 'src/frameworks/enums';
import { AccessTokenDto, SignUpDto } from './dto';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getAccessToken(
    accessTokenDto: AccessTokenDto,
    userAccessPlatform: UserPlatformType,
  ) {
    const deviceTokenId = uuidv4();
    const token = await this.generatePayload(deviceTokenId);

    const payload = {
      id: deviceTokenId,
      token: token,
      deviceInfo: accessTokenDto.device,
      devicePlatform: userAccessPlatform,
      uuid: uuidv4(),
    };

    const accessToken = await this.userRepository.saveToken(payload);

    return {
      accessToken: token,
      data: {
        deviceId: accessToken.id,
      },
    };
  }

  async signUp(signUpDto: SignUpDto, userAccessPlatform: UserPlatformType) {
    const existingUser = await this.userRepository.findOneByPhone(
      signUpDto.countryCode,
      signUpDto.phoneNumber,
    );

    if (existingUser) {
      throw new BusinessRuleException(ERROR.USER_ALREADY_EXISTS);
    }

    const hashedPin = await generateHash(signUpDto.pin);

    const user = await this.userRepository.save({
      phone: signUpDto.phoneNumber,
      pin: hashedPin,
      role: ROLES.CUSTOMER,
      isIpoScreenerWebAccess:
        userAccessPlatform === UserPlatformType.SCREENER_WEB,
      countryCode: signUpDto.countryCode,
    });

    return {
      // accessToken: await this.generatePayload(user.id, user.role),
      data: {
        userId: user.id,
        role: user.role,
      },
    };
  }

  async generatePayload(
    deviceTokenId: string,
    userId: number = 0,
    role: string = 'Anonymous',
  ) {
    return this.jwtService.signAsync({
      deviceId: deviceTokenId,
      role: role,
      userId: userId,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOneByPhone(
      loginDto.countryCode,
      loginDto.phoneNumber,
    );
    console.log('user:', user);
    if (!user) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }

    const isPinValid = await compareHash(loginDto.pin, user.pin);

    if (!isPinValid) {
      throw new BusinessRuleException(ERROR.INVALID_PIN);
    }

    return {
      // accessToken: await this.generatePayload(user.id, user.role),
      data: {
        userId: user.id,
        role: user.role,
      },
    };
  }
}
