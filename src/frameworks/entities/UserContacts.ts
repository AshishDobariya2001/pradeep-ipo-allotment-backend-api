import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contacts } from './Contacts';
import { Users } from './Users';

@Entity('user_contacts', { schema: 'public' })
export class UserContacts {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;
}
