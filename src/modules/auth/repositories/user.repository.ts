import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/frameworks/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
}
