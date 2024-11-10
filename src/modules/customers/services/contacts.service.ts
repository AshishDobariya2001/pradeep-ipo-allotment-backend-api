import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from '../dtos';
import { ContactsRepository } from '../repositories/contacts.repository';
import { Users } from 'src/frameworks/entities';

@Injectable()
export class ContactsService {
  constructor(private contactRepository: ContactsRepository) {}

  async addContact(createContactDto: CreateContactDto, user: Users) {
    const existingContact = await this.contactRepository.findByPanNumber(
      createContactDto.panNumber,
    );

    const userContact = existingContact
      ? await this.contactRepository.findUserContact(
          user?.id,
          existingContact.id,
        )
      : null;

    if (userContact) {
      if (userContact.deletedAt !== null) {
        await this.contactRepository.updateUserContact(userContact.id, {
          deletedAt: null,
          updatedAt: new Date(),
        });
      }
      console.log('inside update contact ', existingContact);
      await this.contactRepository.updateContact(existingContact.id, {
        name: createContactDto.name || existingContact.name,
        email: createContactDto.email || existingContact.email,
        phone: createContactDto.phoneNumber || existingContact.phone,
      });
      return;
    } else if (existingContact) {
      await this.contactRepository.addUserContact({
        contactId: existingContact.id,
        userId: user?.id,
      });
      return;
    }

    const contact = await this.contactRepository.addContact({
      phone: createContactDto.phoneNumber,
      email: createContactDto.email,
      name: createContactDto.name,
      panNumber: createContactDto.panNumber,
    });

    await this.contactRepository.addUserContact({
      contactId: contact.id,
      userId: user?.id,
    });
  }
  findAll(user: Users) {
    return this.contactRepository.findAll(user.id);
  }

  findOne(id: number) {
    return this.contactRepository.findOne(id);
  }
}
