import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserContacts } from './UserContacts';

@Entity('users', { schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'name', nullable: true })
  name: string | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  @Column('text', { name: 'email', nullable: true })
  email: string | null;

  @Column('text', { name: 'legal_name', nullable: true })
  legalName: string | null;

  @Column('character varying', { name: 'pancard', nullable: true, length: 20 })
  pancard: string | null;
}
