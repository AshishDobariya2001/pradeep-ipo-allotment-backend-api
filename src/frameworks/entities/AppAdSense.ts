import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('app_ad_sense', { schema: 'public' })
export class AppAdSense {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'app_name', nullable: true })
  appName: string | null;

  @Column('json', { name: 'ad_list', nullable: true })
  adList: object | null;

  @Column('boolean', { name: 'ad_status', nullable: true })
  adStatus: boolean | null;
}
