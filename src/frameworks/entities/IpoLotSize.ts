import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('ipo_lot_size_pkey', ['id'], { unique: true })
@Entity('ipo_lot_size', { schema: 'public' })
export class IpoLotSize {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'application',
    nullable: true,
    length: 255,
  })
  application: string | null;

  @Column('character varying', { name: 'lots', nullable: true, length: 255 })
  lots: string | null;

  @Column('character varying', { name: 'shares', nullable: true, length: 255 })
  shares: string | null;

  @Column('character varying', { name: 'amount', nullable: true, length: 255 })
  amount: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoLotSizes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
