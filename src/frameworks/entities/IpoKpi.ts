import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('ipo_kpi_pkey', ['id'], { unique: true })
@Entity('ipo_kpi', { schema: 'public' })
export class IpoKpi {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'kpi_name', length: 255 })
  kpiName: string;

  @Column('character varying', { name: 'kpi_value', length: 255 })
  kpiValue: string;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoKpis, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
