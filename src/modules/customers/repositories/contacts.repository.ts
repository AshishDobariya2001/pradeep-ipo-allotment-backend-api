import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacts, UserContacts, Users } from 'src/frameworks/entities';
import { ERROR } from 'src/frameworks/error-code';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { In, Repository, ILike, IsNull } from 'typeorm';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectRepository(Contacts)
    private contactRepository: Repository<Contacts>,

    @InjectRepository(UserContacts)
    private userContactsRepository: Repository<UserContacts>,
  ) {}

  async find(panNumber: string): Promise<Contacts[]> {
    return await this.contactRepository.find({
      where: {
        panNumber: panNumber,
      },
    });
  }

  // async findUserContact(userId, contactId) {
  //   return this.userContactsRepository.findOne({
  //     where: {
  //       // userId: userId,
  //       contactId: contactId,
  //     },
  //   });
  // }

  async findByPanNumber(panNumber: string): Promise<Contacts> {
    return await this.contactRepository.findOne({
      where: {
        panNumber: panNumber,
      },
    });
  }
  updateContact(id, payload: Partial<Contacts>) {
    return this.contactRepository.update(id, payload);
  }

  updateUserContact(id, payload: Partial<UserContacts>) {
    return this.userContactsRepository.update(id, payload);
  }

  addContact(payload: Partial<Contacts>) {
    return this.contactRepository.save(payload);
  }

  addUserContact(payload: Partial<UserContacts>) {
    return this.userContactsRepository.save(payload);
  }

  async findAll(userId: number): Promise<Contacts> {
    return this.userContactsRepository
      .createQueryBuilder('user_contacts')
      .select(['contacts.*'])
      .leftJoin(
        'contacts',
        'contacts',
        'contacts.id = user_contacts.contact_id',
      )
      .where('user_contacts.user_id = :userId', { userId })
      .execute();
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({
      where: {
        id: id,
      },
    });
    console.log('🚀 ~ ContactsRepository ~ findOne ~ contact:', contact);
    if (!contact) {
      throw new BusinessRuleException(ERROR.CONTACT_IS_NOT_FOUND);
    }
    return contact;
  }
}
