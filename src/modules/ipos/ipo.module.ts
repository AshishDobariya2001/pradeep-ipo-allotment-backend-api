import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpoDetails, Timeline } from 'src/frameworks/entities';
import { IPOService } from './services/ipo.service';
import { IPOController } from './controllers/ipo.controller';
import { IPODetailsRepository } from './repositories/ipo-details.repository';
import { FetchIpoMapper } from './mappers/fetch-ipo-list.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([IpoDetails, Timeline])],
  controllers: [IPOController],
  providers: [IPOService, IPODetailsRepository, FetchIpoMapper],
  exports: [IPOService],
})
export class IPOModule {}
