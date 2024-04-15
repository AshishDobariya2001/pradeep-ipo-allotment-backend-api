import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Entity('promoter_holding', { schema: 'public' })
export class PromoterHolding {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'pre_issue', nullable: true })
  preIssue: string | null;

  @Column('character varying', { name: 'post_issue', nullable: true })
  postIssue: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.promoterHoldings)
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
