import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('ipo_reservation_pkey', ['id'], { unique: true })
@Entity('ipo_reservation', { schema: 'public' })
export class IpoReservation {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'anchor_investor_shares_offered',
    nullable: true,
    length: 255,
  })
  anchorInvestorSharesOffered: string | null;

  @Column('character varying', {
    name: 'qib_shares_offered',
    nullable: true,
    length: 255,
  })
  qibSharesOffered: string | null;

  @Column('character varying', {
    name: 'nii_hni_shares_offered',
    nullable: true,
    length: 255,
  })
  niiHniSharesOffered: string | null;

  @Column('character varying', {
    name: 'retail_shares_offered',
    nullable: true,
    length: 255,
  })
  retailSharesOffered: string | null;

  @Column('character varying', {
    name: 'total_shares_offered',
    nullable: true,
    length: 255,
  })
  totalSharesOffered: string | null;

  @Column('character varying', {
    name: 'market_maker_shares_offered',
    nullable: true,
    length: 255,
  })
  marketMakerSharesOffered: string | null;

  @Column('character varying', {
    name: 'other_shares_offered',
    nullable: true,
    length: 255,
  })
  otherSharesOffered: string | null;

  @Column('character varying', {
    name: 'employee_shares_offered',
    nullable: true,
    length: 255,
  })
  employeeSharesOffered: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoReservations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
