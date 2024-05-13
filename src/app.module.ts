import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AllotmentAPIsModule } from './connectors/allotment/allotment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dbconfig from './frameworks/config/typeorm';
import { IpoAllotmentsModule } from './modules/ipo-allotments/ipo-allotments.module';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyMiddleware } from './frameworks/middleware';
import { ScrapersModule } from './modules/scrapers/scrapers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbconfig.connectConfig),
    IpoAllotmentsModule,
    AllotmentAPIsModule,
    ScrapersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*');
  }
}
