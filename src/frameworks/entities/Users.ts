import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ROLES } from '../enums';
import { EntityBase } from './base';

@Entity('users', { schema: 'public' })
export class Users extends EntityBase {
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

  @Column('text', { name: 'pin', nullable: true })
  pin: string | null;

  @Column('text', { name: 'reset_pin_code_link', nullable: true })
  reset_pin_code_link: string | null;

  @Column('text', { name: 'role', nullable: true, default: ROLES.CUSTOMER })
  role: string | null;

  @Column('text', { name: 'sub_role', nullable: true })
  sub_role: string | null;

  @Column('character varying', { name: 'pancard', nullable: true, length: 20 })
  pancard: string | null;

  @Column('boolean', { name: 'is_ipo_screener_access', default: false })
  isIpoScreenerAccess: boolean;

  @Column('boolean', { name: 'is_ipo_allotment_access', default: false })
  isIpoAllotmentAccess: boolean;

  @Column('boolean', { name: 'is_ipo_screener_web_access', default: false })
  isIpoScreenerWebAccess: boolean;

  @Column('character varying', {
    name: 'country_code',
    nullable: true,
    length: 10,
  })
  countryCode: string | null;
}
