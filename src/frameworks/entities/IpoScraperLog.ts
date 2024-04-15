import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ipo_scraper_log', { schema: 'public' })
export class IpoScraperLog {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'scraper_name' })
  scraperName: string;

  @Column('timestamp without time zone', { name: 'start_time', nullable: true })
  startTime: Date | null;

  @Column('timestamp without time zone', { name: 'end_time', nullable: true })
  endTime: Date | null;

  @Column('character varying', { name: 'status', nullable: true })
  status: string | null;

  @Column('character varying', { name: 'message', nullable: true })
  message: string | null;
}
