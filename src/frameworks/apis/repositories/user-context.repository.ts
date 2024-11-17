import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/frameworks/entities';
import { AccessTokens } from 'src/frameworks/entities/AccessTokens';

import { UserPlatformType } from 'src/frameworks/enums';
import { Repository } from 'typeorm';

@Injectable()
export class UserContextRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(AccessTokens)
    private accessTokensRepository: Repository<AccessTokens>,
  ) {}

  validateUser(id: number, userPlatform: UserPlatformType) {
    const whereConditions: any = { id: id };
    switch (userPlatform) {
      case UserPlatformType.SCREENER_WEB:
        whereConditions.isIpoScreenerWebAccess = true;
        break;
      case UserPlatformType.ALLOTMENT:
        whereConditions.isIpoAllotmentAccess = true;
      case UserPlatformType.SCREENER:
        whereConditions.isIpoScreenerAccess = true;
    }
    return this.usersRepository.findOne({
      where: whereConditions,
    });
  }

  async verifyAccessToken(
    accessToken: string,
    deviceId: string,
    userPlatform: UserPlatformType,
  ) {
    console.log("🚀 ~ UserContextRepository ~ userPlatform:", userPlatform)
    console.log("🚀 ~ UserContextRepository ~ deviceId:", deviceId)
    console.log("🚀 ~ UserContextRepository ~ accessToken:", accessToken)
    const isAccessTokenValid = await this.accessTokensRepository.findOne({
      where: {
        token: accessToken,
        id: deviceId,
        devicePlatform: userPlatform,
      },
    });

    if (!isAccessTokenValid) {
      return false;
    }

    await this.accessTokensRepository.update(deviceId, {
      requestCount: isAccessTokenValid.requestCount + 1,
    });

    return isAccessTokenValid;
  }
}
