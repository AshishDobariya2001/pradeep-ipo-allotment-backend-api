import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityBase } from './base';

@Entity('user_contacts', { schema: 'public' })
export class UserContacts extends EntityBase {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('integer', { name: 'user_id', nullable: true })
  userId: number | null;

  @Column('integer', { name: 'contact_id', nullable: true })
  contactId: number | null;

  @Column('time with time zone', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
