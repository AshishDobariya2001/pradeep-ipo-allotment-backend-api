import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('ipo_subscription_data_pkey', ['id'], { unique: true })
@Entity('ipo_subscription_data', { schema: 'public' })
export class IpoSubscriptionData {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('json', { name: 'subscription_status_live', nullable: true })
  subscriptionStatusLive: object | null;

  @Column('json', { name: 'day_wise_subscription_details', nullable: true })
  dayWiseSubscriptionDetails: object | null;

  @Column('json', { name: 'ipo_shares_offered', nullable: true })
  ipoSharesOffered: object | null;

  @Column('json', { name: 'bse_ipo_subscription', nullable: true })
  bseIpoSubscription: object | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoSubscriptionData)
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
