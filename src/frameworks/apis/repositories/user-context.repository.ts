import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/frameworks/entities';
import { UserPlatformType } from 'src/frameworks/enums';
import { Repository } from 'typeorm';

@Injectable()
export class UserContextRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
}
