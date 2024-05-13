import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AllotmentStatus,
  Contacts,
  IpoDetails,
  IpoSubscriptionData,
  Registrar,
  Timeline,
} from 'src/frameworks/entities';
import { Repository } from 'typeorm';
import * as moment from 'moment-timezone';

@Injectable()
export class IpoDetailsRepository {
  constructor(
    @InjectRepository(IpoDetails)
    private ipoDetailsRepository: Repository<IpoDetails>,
    @InjectRepository(Timeline)
    private ipoTimelineRepository: Repository<Timeline>,

    @InjectRepository(IpoSubscriptionData)
    private ipoSubscriptionDataRepository: Repository<IpoSubscriptionData>,

    @InjectRepository(AllotmentStatus)
    private ipoAllotmentsRepository: Repository<AllotmentStatus>,
    @InjectRepository(Contacts)
    private contactRepository: Repository<Contacts>,
  ) {}

  async findCurrentOpenIpo(): Promise<IpoDetails[]> {
    return this.ipoDetailsRepository
      .createQueryBuilder('ipo_details')
      .where('ipo_details.ipoOpenDate <= :today', {
        today: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
      })
      .andWhere('ipo_details.ipoCloseDate >= :today', {
        today: moment().tz('Asia/Kolkata').format('YYYY-MM-DD'),
      })
      .getMany();
  }

  async updateSubscription(id, payload: Partial<IpoSubscriptionData>) {
    return this.ipoSubscriptionDataRepository.update(
      {
        ipoDetails: id,
      },
      payload,
    );
  }
}
