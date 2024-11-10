import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AllotmentStatus,
  Contacts,
  IpoDetails,
  Registrar,
  Timeline,
  UserContacts,
} from 'src/frameworks/entities';
import { ContactsController } from './controllers/contacts.controllers';
import { ContactsService } from './services/contacts.service';
import { ContactsRepository } from './repositories/contacts.repository';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([
//       IpoDetails,
//       AllotmentStatus,
//       Timeline,
//       Registrar,
//       Contacts,
//       UserContacts,
//     ]),
//   ],
//   controllers: [ContactsController],
//   providers: [ContactsService, ContactsRepository],
//   exports: [ContactsService],
// })
// export class CustomerModule {}
