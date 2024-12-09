import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  AllotmentStatus,
  AppAdSense,
  Contacts,
  IpoDetails,
  IpoKpi,
  IpoLotSize,
  IpoReservation,
  IpoScraperLog,
  IpoSubscriptionData,
  PromoterHolding,
  Registrar,
  StockPrice,
  Timeline,
  Users,
} from 'src/frameworks/entities';

import { AccessTokens } from 'src/frameworks/entities/AccessTokens';
import { Notifications } from 'src/frameworks/entities/Notifications';
import { DATABASE_URL, ENVIRONMENT } from 'src/frameworks/environment';

const connectConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [
    AppAdSense,
    AllotmentStatus,
    AccessTokens,
    Contacts,
    IpoDetails,
    IpoKpi,
    IpoLotSize,
    IpoReservation,
    IpoScraperLog,
    IpoSubscriptionData,
    Notifications,
    PromoterHolding,
    Registrar,
    StockPrice,
    Timeline,
    Users,
  ],
  // logging: ENVIRONMENT === 'local',
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  ssl: {
    rejectUnauthorized: false,
  },
};

const config = {
  connectConfig,
};

export = config;
