import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/frameworks/entities';
import { AccessTokens } from 'src/frameworks/entities/AccessTokens';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(AccessTokens)
    private accessTokensRepository: Repository<AccessTokens>,
  ) {}

  async save(payload: Partial<Users>) {
    return this.usersRepository.save(payload);
  }

  async findOneByPhone(countryCode, phoneNumber) {
    return this.usersRepository.findOne({
      where: {
        countryCode: countryCode,
        phone: phoneNumber,
      },
    });
  }
  async saveToken(accessToken: Partial<AccessTokens>) {
    return this.accessTokensRepository.save(accessToken);
  }
}
