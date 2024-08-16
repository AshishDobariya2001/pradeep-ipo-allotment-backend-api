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
import { KFinTechService } from './services/kfin.service';
import { SkyLineFinancialService } from './services/skyline-finacial.service';
import { ContactMapper, IpoListMapper } from './mappers';
import { MaashitlaSecuritiesService } from './services/maashitla-security.service';
import { LinkInTimeService } from './services/link-in-time.service';
import { CameoIndiaService } from './services/cemeo-india.service';
import { IntegratedSecuritiesService } from './services/integrated-security.service';
import { MassSecuritiesService } from './services/mass.service';
import { PurvaShareService } from './services/purva-share.service';
import { ApiKeyMiddleware } from 'src/frameworks/middleware';

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
    consumer
      .apply(ApiKeyMiddleware)
      // .exclude('v1/auth/(.*)', 'v1/user/contacts/(.*)')
      .forRoutes(AllotmentController);
  }
}
