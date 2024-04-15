import { Injectable } from '@nestjs/common';
import { Contacts } from 'src/frameworks/entities';
import { GetContactResponseDto } from '../models';

@Injectable()
export class ContactMapper {
  mapOne(contact) {
    return {
      id: contact.id,
      panNumber: contact.panNumber,
      legalName: contact.legalName,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
    };
  }
  mapAll(contacts: Contacts[]) {
    return contacts.map((contact) => {
      return {
        id: contact.id,
        panNumber: contact.panNumber,
        legalName: contact.legalName,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
      };
    });
  }
}
