import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AllotmentStatus,
  Contacts,
  IpoDetails,
  Registrar,
  Timeline,
} from 'src/frameworks/entities';
import { IPOService } from './services/ipo.service';
import { IPOController } from './controllers/ipo.controller';
import { IPODetailsRepository } from './repositories/ipo-details.repository';
import { FetchIpoMapper } from './mappers/fetch-ipo-list.mapper';
import { IpoAllotmentsModule } from '../ipo-allotments/ipo-allotments.module';
import { FetchAllotmentStatusMapper } from './mappers/fetch-allotment-status.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IpoDetails,
      Timeline,
      AllotmentStatus,
      Registrar,
      Contacts,
    ]),
    IpoAllotmentsModule,
  ],
  controllers: [IPOController],
  providers: [
    IPOService,
    IPODetailsRepository,
    FetchIpoMapper,
    FetchAllotmentStatusMapper,
  ],
  exports: [IPOService],
})
export class IPOModule {}
