import { Module } from '@nestjs/common';
import { BigShareService, MaashitlaService } from './services';
import { AllotmentAPIsModule } from 'src/connectors/allotment/allotment.module';
import { LinkInTimeService } from './services/link-in-time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AllotmentStatus,
  Contacts,
  IpoDetails,
  Registrar,
  Timeline,
} from 'src/frameworks/entities';
import { IpoAllotmentService } from './services/ipo-allotments.service';
import { IpoDetailsRepository } from './repositories/ipo-details.repository';
import { AllotmentController } from './controllers/ipo-allotment.controller';
import { KFinTechService } from './services/kfin.service';
import { SkyLineFinancialService } from './services/skyline-finacial.service';
import { ContactMapper, IpoListMapper } from './mappers';
import { OcrService } from './services/ocr.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IpoDetails,
      AllotmentStatus,
      Timeline,
      Registrar,
      Contacts,
    ]),
    AllotmentAPIsModule,
  ],
  controllers: [AllotmentController],
  providers: [
    BigShareService,
    LinkInTimeService,
    SkyLineFinancialService,
    IpoAllotmentService,
    IpoDetailsRepository,
    KFinTechService,
    ContactMapper,
    IpoListMapper,
    MaashitlaService,
    OcrService,
  ],
  exports: [
    BigShareService,
    LinkInTimeService,
    IpoDetailsRepository,
    KFinTechService,
  ],
})
export class IpoAllotmentsModule {}
