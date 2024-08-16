import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { compareHash, generateHash } from 'src/frameworks/utility/bycrypt';
import { UserRepository } from './repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ROLES, UserPlatformType } from 'src/frameworks/enums';
import { SignUpDto } from './dto';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {
    this.createTestUserData();
  }

  createTestUserData() {
    console.log('🚀 ~ AuthService ~ createTestUserData ~ createTestUserData:');
    console.log('inside create');
    const secretKey = 'your-secret-key';

    const data = {
      countryCode: '+91',
      phoneNumber: '7285860835',
      pin: '123456',
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secretKey,
    ).toString();

    console.log(encryptedData);
    const descryptData =
      'U2FsdGVkX19WQ8XTeEvaVzb+nx8JuJcsMLvcp2wkzCBIq5ccEiaqYC3MiNgQosAHbKcFiK24rKd8M5n7ARJCMqaerWzqOpm29fww6RDXT0kVQlxkxemX90OyFx54+gCrC+/YEPmoRX36WRAcQJmyc1CmNCS7grhQYJ8gK8+w0sMN4zY6AEYU1fISsGWD4ZUF';
    const decryptedData = CryptoJS.AES.decrypt(
      descryptData,
      secretKey,
    ).toString(CryptoJS.enc.Utf8);

    console.log(JSON.parse(decryptedData));
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
      accessToken: await this.generatePayload(user.id, user.role),
      data: {
        userId: user.id,
        role: user.role,
      },
    };
  }

  async generatePayload(userId: number, role: string) {
    return this.jwtService.signAsync({
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
      accessToken: await this.generatePayload(user.id, user.role),
      data: {
        userId: user.id,
        role: user.role,
      },
    };
  }
}
