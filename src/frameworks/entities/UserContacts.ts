import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contacts } from './Contacts';
import { Users } from './Users';

@Index('user_contacts_pkey', ['id'], { unique: true })
@Entity('user_contacts', { schema: 'public' })
export class UserContacts {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('timestamp with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @ManyToOne(() => Contacts, (contacts) => contacts.userContacts)
  @JoinColumn([{ name: 'contact_id', referencedColumnName: 'id' }])
  contact: Contacts;

  @ManyToOne(() => Contacts, (contacts) => contacts.userContacts2)
  @JoinColumn([{ name: 'contact_id', referencedColumnName: 'id' }])
  contact_2: Contacts;

  @ManyToOne(() => Users, (users) => users.userContacts)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: Users;

  @ManyToOne(() => Users, (users) => users.userContacts2)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user_2: Users;
}
