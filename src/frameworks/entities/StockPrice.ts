import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoDetails } from './IpoDetails';

@Index('stock_price_pkey', ['id'], { unique: true })
@Entity('stock_price', { schema: 'public' })
export class StockPrice {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('jsonb', { name: 'stock_information', nullable: true })
  stockInformation: object | null;

  @Column('character varying', {
    name: 'exchange_type',
    nullable: true,
    length: 100,
  })
  exchangeType: string | null;

  @Column('numeric', { name: 'open', nullable: true, precision: 12, scale: 2 })
  open: string | null;

  @Column('numeric', { name: 'high', nullable: true, precision: 12, scale: 2 })
  high: string | null;

  @Column('numeric', { name: 'low', nullable: true, precision: 12, scale: 2 })
  low: string | null;

  @Column('numeric', {
    name: 'previous',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  previous: string | null;

  @Column('numeric', {
    name: 'previous_day_close',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  previousDayClose: string | null;

  @Column('bigint', { name: 'total_traded_shares', nullable: true })
  totalTradedShares: string | null;

  @Column('bigint', { name: 'total_number_of_trades', nullable: true })
  totalNumberOfTrades: string | null;

  @Column('numeric', {
    name: 'net_turnover',
    nullable: true,
    precision: 15,
    scale: 2,
  })
  netTurnover: string | null;

  @Column('numeric', {
    name: 'current_price',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  currentPrice: string | null;

  @Column('numeric', {
    name: 'current_price_movement',
    nullable: true,
    precision: 12,
    scale: 2,
  })
  currentPriceMovement: string | null;

  @Column('numeric', {
    name: 'current_price_movement_percentage',
    nullable: true,
    precision: 6,
    scale: 2,
  })
  currentPriceMovementPercentage: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.stockPrices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ipo_details_id', referencedColumnName: 'id' }])
  ipoDetails: IpoDetails;
}
