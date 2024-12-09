import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContactDto, GetContactByPanNumbersDto } from '../dtos';
import { ContactsRepository } from '../repositories/contacts.repository';
import { Contacts, Users } from 'src/frameworks/entities';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';

@Injectable()
export class ContactsService {
  constructor(private contactRepository: ContactsRepository) {}

  getUser(loggedInUser: Users) {
    if (!loggedInUser?.id) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }
    return this.contactRepository.findUserByUserId(loggedInUser.id);
  }

  async addContact(createContactDto: CreateContactDto, loggedInUser: Users) {
    if (!loggedInUser?.id) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }
    const existingContact = await this.contactRepository.findContactByPanNumber(
      createContactDto.panNumber,
    );

    let contact: Contacts;

    if (existingContact) {
      const hasRelationship = existingContact.users.some(
        (u) => u.id === loggedInUser.id,
      );

      if (hasRelationship) {
        await this.contactRepository.updateContact(
          existingContact.id,
          createContactDto,
        );
        contact = existingContact;
      } else {
        existingContact.users.push(loggedInUser);
        await this.contactRepository.addContact(existingContact);
        contact = existingContact;
      }
    } else {
      contact = await this.contactRepository.contactCreate({
        ...createContactDto,
        users: [loggedInUser],
      });
      await this.contactRepository.addContact(contact);
    }

    return {
      success: true,
      message: 'Contact added successfully',
      data: {
        id: contact.id,
        panNumber: contact.panNumber,
      },
    };
  }

  findAll(loggedInUser: Users) {
    if (!loggedInUser?.id) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }
    return this.contactRepository.findUserWithContact(loggedInUser.id);
  }

  async findContactByPanNumber(body: GetContactByPanNumbersDto) {
    return this.contactRepository.findContactByPanNumbers(body.panNumbers);
  }

  async remove(contactId: number, loggedInUser: Users) {
    if (!loggedInUser?.id) {
      throw new BusinessRuleException(ERROR.USER_NOT_FOUND);
    }
    const contact =
      await this.contactRepository.findContactWithUserByContactId(contactId);

    if (!contact) {
      throw new BusinessRuleException(`Contact with ID ${contactId} not found`);
    }

    const user = contact.users.find((user) => user.id === loggedInUser.id);
    if (!user) {
      throw new BusinessRuleException(
        `User with ID ${loggedInUser.id} not associated with this contact`,
      );
    }

    contact.users = contact.users.filter((u) => u.id !== loggedInUser.id);

    await this.contactRepository.saveContact(contact);
  }
}
