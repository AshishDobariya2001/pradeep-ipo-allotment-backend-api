import { MiddlewareConsumer, Module } from '@nestjs/common';
// import { AllotmentAPIsModule } from './connectors/allotment/allotment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dbconfig from './frameworks/config/typeorm';
// import { IpoAllotmentsModule } from './modules/ipo-allotments/ipo-allotments.module';
import { ConfigModule } from '@nestjs/config';
// import { ScrapersModule } from './modules/scrapers/scrapers.module';
import { AuthModule } from './modules/auth/auth.module';
import { IPOModule } from './modules/ipos/ipo.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionsFilter } from './frameworks/utility/filter';
import { frameworksModule } from './frameworks/framework.module';
import { DecryptMiddleware } from './frameworks/middleware/decrypt.middleware';
import { EncryptMiddleware } from './frameworks/middleware/encrypt.middleware';
import { AuthController } from './modules/auth/auth.controller';
import { IPOController } from './modules/ipos/controllers/ipo.controller';
import { CustomerModule } from './modules/customers/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbconfig.connectConfig),
    // IpoAllotmentsModule,
    // AllotmentAPIsModule,
    // ScrapersModule,
    AuthModule,
    IPOModule,
    frameworksModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionsFilter,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(DecryptMiddleware, EncryptMiddleware)
  //     .forRoutes(AuthController, IPOController);
  // }
}
