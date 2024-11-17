import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('ipo_gmp_data_pkey', ['id'], { unique: true })
@Entity('ipo_gmp_data', { schema: 'public' })
export class IpoGmpData {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'kpi_name', nullable: true })
  kpiName: string | null;

  @Column('character varying', { name: 'kpi_value', nullable: true })
  kpiValue: string | null;

  // @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoGmpData2)
  // @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  // ipoDetails: IpoDetails;
}
