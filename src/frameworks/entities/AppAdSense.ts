import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('app_ad_sense_pkey', ['id'], { unique: true })
@Entity('app_ad_sense', { schema: 'public' })
export class AppAdSense {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'app_name', nullable: true })
  appName: string | null;

  @Column('jsonb', { name: 'ad_list', nullable: true })
  adList: object | null;

  @Column('boolean', { name: 'ad_status', nullable: true })
  adStatus: boolean | null;

  @Column('boolean', { name: 'is_app_maintains', nullable: true })
  isAppMaintains: boolean | null;
}
