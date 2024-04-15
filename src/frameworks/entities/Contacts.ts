import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('character varying', { name: 'email', nullable: true, length: 255 })
  email: string | null;
}
