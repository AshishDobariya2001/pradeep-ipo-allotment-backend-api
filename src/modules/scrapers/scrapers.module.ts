import { Module } from '@nestjs/common';
import { BSESubscriptionScraperService } from './services/bse-subscription.service';
import { AllotmentAPIsModule } from 'src/connectors/allotment/allotment.module';
import {
  IpoDetails,
  Timeline,
  AllotmentStatus,
  Registrar,
  Contacts,
  IpoSubscriptionData,
} from 'src/frameworks/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IpoDetailsRepository } from './repositories/ipo-details.respository';
import { ScraperController } from './controllers/subscription.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IpoDetails,
      AllotmentStatus,
      Timeline,
      Registrar,
      Contacts,
      IpoSubscriptionData,
    ]),
    AllotmentAPIsModule,
  ],
  controllers: [ScraperController],
  providers: [BSESubscriptionScraperService, IpoDetailsRepository],
})
export class ScrapersModule {}
