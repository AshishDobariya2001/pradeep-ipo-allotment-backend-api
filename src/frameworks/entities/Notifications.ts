import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications', { schema: 'public' })
export class Notifications {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'type' })
  type: string;

  @Column('character varying', { name: 'message' })
  message: string;

  @Column('timestamp without time zone', { name: 'created_at' })
  createdAt: Date;

  @Column('json', { name: 'data', nullable: true })
  data: object | null;

  @Column('boolean', { name: 'is_read', nullable: true })
  isRead: boolean | null;

  @Column('boolean', { name: 'is_send', nullable: true })
  isSend: boolean | null;

  @Column('integer', { name: 'ipo_details_id', nullable: true })
  ipoDetailsId: number | null;
}
