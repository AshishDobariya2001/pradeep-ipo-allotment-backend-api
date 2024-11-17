import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BigShareService } from './services';
import { AllotmentAPIsModule } from 'src/connectors/allotment/allotment.module';
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
import { KFinTechService } from './services/repository/kfin.service';
import { SkyLineFinancialService } from './services/repository/skyline-finacial.service';
import { ContactMapper, IpoListMapper } from './mappers';
import { MaashitlaSecuritiesService } from './services/repository/maashitla-security.service';
import { LinkInTimeService } from './services/repository/link-in-time.service';
import { CameoIndiaService } from './services/repository/cemeo-india.service';
import { IntegratedSecuritiesService } from './services/repository/integrated-security.service';
import { MassSecuritiesService } from './services/repository/mass.service';
import { PurvaShareService } from './services/repository/purva-share.service';
import { ApiKeyMiddleware } from 'src/frameworks/middleware';
import { PuppeteerService } from './services/puppeteer.service';

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
  // controllers: [AllotmentController],
  providers: [
    IpoAllotmentService,
    BigShareService,
    LinkInTimeService,
    SkyLineFinancialService,
    IpoDetailsRepository,
    KFinTechService,
    ContactMapper,
    IpoListMapper,
    MaashitlaSecuritiesService,
    CameoIndiaService,
    IntegratedSecuritiesService,
    MassSecuritiesService,
    PurvaShareService,
    PuppeteerService,
  ],
  exports: [
    BigShareService,
    IpoDetailsRepository,
    KFinTechService,
    IpoAllotmentService,
  ],
})
export class IpoAllotmentsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes(AllotmentController);
  }
}
