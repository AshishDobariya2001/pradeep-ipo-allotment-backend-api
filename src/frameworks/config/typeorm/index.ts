import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  AllotmentStatus,
  Contacts,
  IpoDetails,
  IpoKpi,
  IpoLotSize,
  IpoReservation,
  IpoSubscriptionData,
  PromoterHolding,
  Registrar,
  StockPrice,
  Timeline,
  UserContacts,
  Users,
} from 'src/frameworks/entities';

import { DATABASE_URL, ENVIRONMENT } from 'src/frameworks/environment';

const connectConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: [
    IpoDetails,
    Timeline,
    IpoKpi,
    IpoLotSize,
    IpoReservation,
    IpoSubscriptionData,
    PromoterHolding,
    StockPrice,
    Registrar,
    UserContacts,
    Contacts,
    AllotmentStatus,
    Users,
    UserContacts,
  ],
  logging: ENVIRONMENT === 'local',
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
};

const config = {
  connectConfig,
};

export = config;
