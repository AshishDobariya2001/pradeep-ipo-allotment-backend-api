import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Entity('timeline', { schema: 'public' })
export class Timeline {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('date', { name: 'ipo_open_date', nullable: true })
  ipoOpenDate: string | null;

  @Column('date', { name: 'ipo_close_date', nullable: true })
  ipoCloseDate: string | null;

  @Column('date', { name: 'basis_of_allotment', nullable: true })
  basisOfAllotment: string | null;

  @Column('date', { name: 'initiation_of_refunds', nullable: true })
  initiationOfRefunds: string | null;

  @Column('date', { name: 'credit_of_shares_to_demat', nullable: true })
  creditOfSharesToDemat: string | null;

  @Column('date', { name: 'listing_date', nullable: true })
  listingDate: string | null;

  @Column('character varying', {
    name: 'cut_off_time_for_upi_mandate_confirmation',
    nullable: true,
  })
  cutOffTimeForUpiMandateConfirmation: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.timelines)
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
