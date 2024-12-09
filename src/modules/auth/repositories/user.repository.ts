import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokens, Users } from 'src/frameworks/entities';
import { DefaultStatus } from 'src/frameworks/enums';
import { In, Not, Repository } from 'typeorm';

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

  async findOneByPhone(countryCode, phoneNumber): Promise<Users> {
    return this.usersRepository.findOne({
      where: {
        countryCode: countryCode,
        phone: phoneNumber,
        status: Not(In([DefaultStatus.BLOCKED])),
      },
    });
  }

  async saveToken(accessToken: Partial<AccessTokens>) {
    return this.accessTokensRepository.save(accessToken);
  }

  async update(id, payload: Partial<Users>) {
    return this.usersRepository.update(id, payload);
  }
}
