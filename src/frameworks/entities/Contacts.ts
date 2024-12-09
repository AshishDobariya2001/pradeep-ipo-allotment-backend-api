import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AllotmentStatus } from './AllotmentStatus';
import { Users } from './Users';

@Index('contacts_pkey', ['id'], { unique: true })
@Entity('contacts', { schema: 'public' })
export class Contacts {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'pan_number',
    nullable: true,
    length: 20,
  })
  panNumber: string | null;

  @Column('character varying', {
    name: 'legal_name',
    nullable: true,
    length: 255,
  })
  legalName: string | null;

  @Column('character varying', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('character varying', { name: 'phone', nullable: true, length: 20 })
  phone: string | null;

  // @Column('character varying', {
  //   name: 'country_code ',
  //   nullable: true,
  // })
  // countryCode: string | null;

  @Column('character varying', { name: 'email', nullable: true, length: 255 })
  email: string | null;

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

  @OneToMany(
    () => AllotmentStatus,
    (allotmentStatus) => allotmentStatus.contact,
  )
  allotmentStatuses: AllotmentStatus[];

  @ManyToMany(() => Users, (users) => users.contacts)
  @JoinTable({
    name: 'user_contact',
    joinColumns: [{ name: 'contact_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    schema: 'public',
  })
  users: Users[];
}
