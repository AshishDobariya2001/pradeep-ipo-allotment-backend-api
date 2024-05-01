import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('allotment_status', { schema: 'public' })
export class AllotmentStatus {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'company_id', length: 255 })
  companyId: string;

  @Column({ type: 'int', name: 'contact_id' })
  contactId: number;

  @Column('character varying', { name: 'company_name', length: 255 })
  companyName: string;

  @Column('character varying', { name: 'allotment_status', length: 20 })
  allotmentStatus: string;

  @Column('jsonb', { name: 'data', nullable: true })
  data: object | null;

  @Column('boolean', {
    name: 'whatsapp_is_sent',
    nullable: true,
    default: () => 'false',
  })
  whatsappIsSent: boolean | null;

  @Column('boolean', {
    name: 'notification_is_sent',
    nullable: true,
    default: () => 'false',
  })
  notificationIsSent: boolean | null;

  @Column('character varying', { name: 'pancard', length: 255 })
  pancard: string;

  @Column('character varying', {
    name: 'applied_stock',
    length: 255,
    nullable: false,
  })
  appliedStock: string;

  @Column('character varying', { name: 'alloted_stock', length: 255 })
  allotedStock: string;
}
