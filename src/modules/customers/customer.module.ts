import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactsController } from './controllers/contacts.controllers';
import { ContactsService } from './services/contacts.service';
import { ContactsRepository } from './repositories/contacts.repository';
import {
  AllotmentStatus,
  Contacts,
  IpoDetails,
  Registrar,
  Timeline,
  Users,
} from 'src/frameworks/entities';
import { CustomerController } from './controllers/customer.controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IpoDetails,
      AllotmentStatus,
      Timeline,
      Registrar,
      Contacts,
      Users,
    ]),
  ],
  controllers: [CustomerController, ContactsController],
  providers: [ContactsService, ContactsRepository],
  exports: [ContactsService],
})
export class CustomerModule {}
