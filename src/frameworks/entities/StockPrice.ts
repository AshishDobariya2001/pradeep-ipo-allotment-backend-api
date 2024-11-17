import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IpoDetails } from "./IpoDetails";

@Index("stock_price_pkey", ["id"], { unique: true })
@Entity("stock_price", { schema: "public" })
export class StockPrice {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("json", { name: "stock_information", nullable: true })
  stockInformation: object | null;

  @Column("character varying", { name: "exchange_type", nullable: true })
  exchangeType: string | null;

  @Column("character varying", { name: "open", nullable: true })
  open: string | null;

  @Column("character varying", { name: "high", nullable: true })
  high: string | null;

  @Column("character varying", { name: "previous", nullable: true })
  previous: string | null;

  @Column("character varying", { name: "low", nullable: true })
  low: string | null;

  @Column("character varying", { name: "previous_day_close", nullable: true })
  previousDayClose: string | null;

  @Column("character varying", { name: "total_traded_shares", nullable: true })
  totalTradedShares: string | null;

  @Column("character varying", {
    name: "total_number_of_trades",
    nullable: true,
  })
  totalNumberOfTrades: string | null;

  @Column("character varying", { name: "net_turnover", nullable: true })
  netTurnover: string | null;

  @Column("character varying", { name: "current_price", nullable: true })
  currentPrice: string | null;

  @Column("character varying", {
    name: "current_price_movement",
    nullable: true,
  })
  currentPriceMovement: string | null;

  @Column("character varying", {
    name: "current_price_movement_percentage",
    nullable: true,
  })
  currentPriceMovementPercentage: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.stockPrices)
  @JoinColumn([{ name: "ipo_details_id", referencedColumnName: "id" }])
  ipoDetails: IpoDetails;
}
