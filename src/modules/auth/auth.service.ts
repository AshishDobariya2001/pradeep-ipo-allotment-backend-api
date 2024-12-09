import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import {
  compareHash,
  generateHash,
  generateOtp,
} from 'src/frameworks/utility/bycrypt';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { DefaultStatus, ROLES, UserPlatformType } from 'src/frameworks/enums';
import { AccessTokenDto, SignUpDto, VerifyOtpDto } from './dto';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';
import { v4 as uuidv4 } from 'uuid';
import { JWT_ACCESS_EXPIRES_IN_DAYS } from 'src/frameworks/environment';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async getAccessToken(
    accessTokenDto: AccessTokenDto,
    userAccessPlatform: UserPlatformType,
    role: string = ROLES.ANONYMOUS,
    userId = null,
  ) {
    const deviceTokenId = uuidv4();
    const token = await this.generatePayload(deviceTokenId, userId, role);

    const payload = {
      id: deviceTokenId,
      token: token,
      deviceInfo: accessTokenDto.device,
      devicePlatform: userAccessPlatform,
      uuid: uuidv4(),
      userId: userId,
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
    console.log("🚀 ~ AuthService ~ signUp ~ signUpDto:", signUpDto)
    const existingUser = await this.userRepository.findOneByPhone(
      signUpDto.countryCode,
      signUpDto.phoneNumber,
    );

    if (existingUser && existingUser.status !== DefaultStatus.PENDING) {
      throw new BusinessRuleException(ERROR.USER_ALREADY_EXISTS);
    }

    const hashedPin = await generateHash(signUpDto.pin);
    const tempOtp = await generateOtp(true);

    const payload = {
      phone: signUpDto.phoneNumber,
      pin: hashedPin,
      role: ROLES.CUSTOMER,
      isIpoAllotmentAccess:
        userAccessPlatform === UserPlatformType.ALLOTMENT_MOBILE_APPLICATION,
      countryCode: signUpDto.countryCode,
      status: DefaultStatus.PENDING,
      tempOtp: tempOtp,
      tempOtpExpireTime: new Date(new Date().getTime() + 10 * 60000),
    };

    let user;
    if (existingUser) {
      Object.assign(existingUser, payload);
      user = await this.userRepository.save(existingUser);
    } else {
      user = await this.userRepository.save(payload);
    }

    return {
      message: 'OTP sent successfully',
      data: {
        id: user.id,
        role: user.role,
      },
    };
  }

  async generatePayload(
    deviceTokenId: string,
    userId: number = 0,
    role: string = 'Anonymous',
  ) {
    const expiresIn = userId ? '365d' : `${JWT_ACCESS_EXPIRES_IN_DAYS}d`;

    return this.jwtService.signAsync(
      {
        deviceId: deviceTokenId,
        role: role,
        userId: userId,
        personal: userId ? true : false,
      },
      {
        expiresIn,
      },
    );
  }

  async login(loginDto: LoginDto, userAccessPlatform: UserPlatformType) {
    const user = await this.userRepository.findOneByPhone(
      loginDto.countryCode,
      loginDto.phoneNumber,
    );
    if (!user) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }

    if (user.status == DefaultStatus.PENDING) {
      throw new BusinessRuleException(ERROR.USER_IS_NOT_VERIFIED);
    }

    const isPinValid = await compareHash(loginDto.pin, user.pin);

    if (!isPinValid) {
      throw new BusinessRuleException(ERROR.INVALID_PIN);
    }

    const token = await this.getAccessToken(
      { device: loginDto.device },
      userAccessPlatform,
      user.role,
      user.id,
    );

    return {
      accessToken: token.accessToken,
      data: {
        deviceId: token.data.deviceId,
        userId: user.id,
        role: user.role,
      },
    };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
    userAccessPlatform: UserPlatformType,
  ) {
    console.log("🚀 ~ AuthService ~ verifyOtpDto:", verifyOtpDto)
    const user = await this.userRepository.findOneByPhone(
      verifyOtpDto.countryCode,
      verifyOtpDto.phoneNumber,
    );
    if (!user) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }

    const isOtpValid = await compareHash(verifyOtpDto.tempOtp, user.tempOtp);

    if (!isOtpValid) {
      throw new BusinessRuleException(ERROR.INVALID_OTP);
    }

    if (user.tempOtpExpireTime < new Date()) {
      throw new BusinessRuleException(ERROR.INVALID_OTP);
    }

    const token = await this.getAccessToken(
      { device: verifyOtpDto.device },
      userAccessPlatform,
      user.role,
      user.id,
    );
    await this.userRepository.update(user.id, {
      status: DefaultStatus.ACTIVE,
    });
    return {
      accessToken: token.accessToken,
      data: {
        deviceId: token.data.deviceId,
        userId: user.id,
        role: user.role,
      },
    };
  }
}
