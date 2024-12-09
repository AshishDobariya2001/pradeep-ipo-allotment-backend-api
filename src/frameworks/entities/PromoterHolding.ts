import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('promoter_holding_pkey', ['id'], { unique: true })
@Entity('promoter_holding', { schema: 'public' })
export class PromoterHolding {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'pre_issue', length: 50 })
  preIssue: string;

  @Column('character varying', { name: 'post_issue', length: 50 })
  postIssue: string;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.promoterHoldings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
