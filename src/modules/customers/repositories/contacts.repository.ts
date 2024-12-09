import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contacts, Users } from 'src/frameworks/entities';
import { DefaultStatus } from 'src/frameworks/enums';
import { ERROR } from 'src/frameworks/error-code';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { In, Repository, ILike, IsNull, Not } from 'typeorm';

@Injectable()
export class ContactsRepository {
  constructor(
    @InjectRepository(Contacts)
    private contactRepository: Repository<Contacts>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async find(panNumber: string): Promise<Contacts[]> {
    return await this.contactRepository.find({
      where: {
        panNumber: panNumber,
      },
    });
  }
  async findUserById(userId: number): Promise<Users> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async findUserWithContact(userId) {
    return await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['contacts'],
      select: ['id', 'name', 'countryCode', 'phone', 'contacts'],
    });
  }

  async findUserByUserId(userId: number): Promise<Users> {
    console.log('🚀 ~ ContactsRepository ~ findUserByUserId ~ userId:', userId);
    return await this.userRepository.findOne({
      where: {
        id: userId,
        status: Not(In([DefaultStatus.BLOCKED])),
      },
      select: [
        'id',
        'name',
        'countryCode',
        'phone',
        'email',
        'legalName',
        'role',
      ],
    });
  }

  // async findUserContact(userId, contactId) {
  //   return this.UserContactRepository.findOne({
  //     where: {
  //       // userId: userId,
  //       contactId: contactId,
  //     },
  //   });
  // }

  async findContactByPanNumbers(panNumbers: string[]): Promise<Contacts[]> {
    return this.contactRepository.find({
      where: {
        panNumber: In(panNumbers),
      },
    });
  }

  async findContactByPanNumber(panNumber: string): Promise<Contacts> {
    return await this.contactRepository.findOne({
      where: {
        panNumber: panNumber,
      },
      relations: ['users'],
    });
  }
  updateContact(id, payload: Partial<Contacts>) {
    console.log('🚀 ~ ContactsRepository ~ updateContact ~ payload:', payload);
    return this.contactRepository.update(id, payload);
  }

  async findContactWithUserByContactId(contactId: number): Promise<Contacts> {
    return await this.contactRepository.findOne({
      where: {
        id: contactId,
      },
      relations: ['users'],
    });
  }
  // updateUserContact(id, payload: Partial<UserContact>) {
  //   return this.UserContactRepository.update(id, payload);
  // }

  addContact(payload: Partial<Contacts>) {
    return this.contactRepository.save(payload);
  }

  async contactCreate(payload: Partial<Contacts>) {
    return this.contactRepository.create(payload);
  }

  async saveContact(payload: Partial<Contacts>) {
    return this.contactRepository.save(payload);
  }

  // addUserContact(payload: Partial<UserContact>) {
  //   return this.UserContactRepository.save(payload);
  // }

  // async findAll(userId: number): Promise<Contacts> {
  //   return this.UserContactRepository
  //     .createQueryBuilder('user_contacts')
  //     .select(['contacts.*'])
  //     .leftJoin(
  //       'contacts',
  //       'contacts',
  //       'contacts.id = user_contacts.contact_id',
  //     )
  //     .where('user_contacts.user_id = :userId', { userId })
  //     .execute();
  // }

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
