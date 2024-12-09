import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IpoKpi } from './IpoKpi';
import { IpoLotSize } from './IpoLotSize';
import { IpoReservation } from './IpoReservation';
import { IpoSubscriptionData } from './IpoSubscriptionData';
import { PromoterHolding } from './PromoterHolding';
import { StockPrice } from './StockPrice';
import { Timeline } from './Timeline';

@Index('ipo_details_pkey', ['id'], { unique: true })
@Entity('ipo_details', { schema: 'public' })
export class IpoDetails {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'company_name',
    nullable: true,
    length: 255,
  })
  companyName: string | null;

  @Column('character varying', {
    name: 'logo_url',
    nullable: true,
    length: 255,
  })
  logoUrl: string | null;

  @Column('date', { name: 'ipo_open_date', nullable: true })
  ipoOpenDate: string | null;

  @Column('date', { name: 'ipo_close_date', nullable: true })
  ipoCloseDate: string | null;

  @Column('character varying', { name: 'ipo_date', nullable: true, length: 50 })
  ipoDate: string | null;

  @Column('date', { name: 'listing_date', nullable: true })
  listingDate: string | null;

  @Column('character varying', {
    name: 'face_value',
    nullable: true,
    length: 50,
  })
  faceValue: string | null;

  @Column('jsonb', { name: 'price_band', nullable: true })
  priceBand: object | null;

  @Column('character varying', { name: 'lot_size', nullable: true, length: 50 })
  lotSize: string | null;

  @Column('character varying', {
    name: 'offer_for_sale',
    nullable: true,
    length: 255,
  })
  offerForSale: string | null;

  @Column('jsonb', { name: 'total_issue_size', nullable: true })
  totalIssueSize: object | null;

  @Column('jsonb', { name: 'fresh_issue', nullable: true })
  freshIssue: object | null;

  @Column('character varying', {
    name: 'issue_type',
    nullable: true,
    length: 50,
  })
  issueType: string | null;

  @Column('character varying', {
    name: 'listing_at',
    nullable: true,
    length: 255,
  })
  listingAt: string | null;

  @Column('character varying', {
    name: 'pre_issue',
    nullable: true,
    length: 50,
  })
  preIssue: string | null;

  @Column('character varying', {
    name: 'post_issue',
    nullable: true,
    length: 50,
  })
  postIssue: string | null;

  @Column('character varying', {
    name: 'market_maker_portion',
    nullable: true,
    length: 50,
  })
  marketMakerPortion: string | null;

  @Column('character varying', {
    name: 'ipo_details_url',
    nullable: true,
    length: 255,
  })
  ipoDetailsUrl: string | null;

  @Column('character varying', {
    name: 'ipo_allotment_status_url',
    nullable: true,
    length: 255,
  })
  ipoAllotmentStatusUrl: string | null;

  @Column('character varying', {
    name: 'ipo_live_subscription_url',
    nullable: true,
    length: 255,
  })
  ipoLiveSubscriptionUrl: string | null;

  @Column('character varying', {
    name: 'ipo_stock_price_url',
    nullable: true,
    length: 255,
  })
  ipoStockPriceUrl: string | null;

  @Column('character varying', {
    name: 'ipo_gmp_url',
    nullable: true,
    length: 255,
  })
  ipoGmpUrl: string | null;

  @Column('text', { name: 'about', nullable: true })
  about: string | null;

  @Column('jsonb', { name: 'docs_url', nullable: true })
  docsUrl: object | null;

  @Column('jsonb', { name: 'ipo_trade_information', nullable: true })
  ipoTradeInformation: object | null;

  @Column('jsonb', { name: 'ipo_listing_information', nullable: true })
  ipoListingInformation: object | null;

  @Column('jsonb', { name: 'ipo_listing_prospectus', nullable: true })
  ipoListingProspectus: object | null;

  @Column('character varying', { name: 'rating', nullable: true, length: 50 })
  rating: string | null;

  @Column('jsonb', { name: 'lead_manager_data', nullable: true })
  leadManagerData: object | null;

  @Column('jsonb', { name: 'ipo_gmp_data', nullable: true })
  ipoGmpData: object | null;

  @Column('jsonb', { name: 'ipo_registrar', nullable: true })
  ipoRegistrar: object | null;

  @Column('boolean', {
    name: 'ipo_allotment_status',
    nullable: true,
    default: () => 'false',
  })
  ipoAllotmentStatus: boolean | null;

  @Column('jsonb', { name: 'ipo_allotment_required_payload', nullable: true })
  ipoAllotmentRequiredPayload: object | null;

  @Column('timestamp without time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date | null;

  @Column('timestamp without time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date | null;

  @OneToMany(() => IpoKpi, (ipoKpi) => ipoKpi.ipoDetails)
  ipoKpis: IpoKpi[];

  @OneToMany(() => IpoLotSize, (ipoLotSize) => ipoLotSize.ipoDetails)
  ipoLotSizes: IpoLotSize[];

  @OneToMany(
    () => IpoReservation,
    (ipoReservation) => ipoReservation.ipoDetails,
  )
  ipoReservations: IpoReservation[];

  @OneToMany(
    () => IpoSubscriptionData,
    (ipoSubscriptionData) => ipoSubscriptionData.ipoDetails,
  )
  ipoSubscriptionData: IpoSubscriptionData[];

  @OneToMany(
    () => PromoterHolding,
    (promoterHolding) => promoterHolding.ipoDetails,
  )
  promoterHoldings: PromoterHolding[];

  @OneToMany(() => StockPrice, (stockPrice) => stockPrice.ipoDetails)
  stockPrices: StockPrice[];

  @OneToMany(() => Timeline, (timeline) => timeline.ipoDetails)
  timelines: Timeline[];
}
