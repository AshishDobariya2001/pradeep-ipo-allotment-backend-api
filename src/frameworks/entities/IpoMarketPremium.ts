import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("ipo_market_premium_pkey", ["id"], { unique: true })
@Entity("ipo_market_premium", { schema: "public" })
export class IpoMarketPremium {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "company_name",
    nullable: true,
    length: 255,
  })
  companyName: string | null;

  @Column("text", { name: "link", nullable: true })
  link: string | null;

  @Column("character varying", { name: "price", nullable: true, length: 255 })
  price: string | null;

  @Column("character varying", { name: "gmp", nullable: true, length: 255 })
  gmp: string | null;

  @Column("character varying", {
    name: "est_listing",
    nullable: true,
    length: 255,
  })
  estListing: string | null;

  @Column("character varying", {
    name: "fire_rating",
    nullable: true,
    length: 255,
  })
  fireRating: string | null;

  @Column("character varying", {
    name: "ipo_size",
    nullable: true,
    length: 255,
  })
  ipoSize: string | null;

  @Column("character varying", { name: "lot", nullable: true, length: 255 })
  lot: string | null;

  @Column("date", { name: "open", nullable: true })
  open: string | null;

  @Column("date", { name: "close", nullable: true })
  close: string | null;

  @Column("date", { name: "boa_dt", nullable: true })
  boaDt: string | null;

  @Column("date", { name: "listing", nullable: true })
  listing: string | null;

  @Column("timestamp without time zone", {
    name: "gmp_updated",
    nullable: true,
  })
  gmpUpdated: Date | null;

  @Column("bigint", { name: "ipo_details_id", nullable: true })
  ipoDetailsId: string | null;

  @Column("timestamp without time zone", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp without time zone", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @Column("boolean", {
    name: "is_last_updated",
    nullable: true,
    default: () => "false",
  })
  isLastUpdated: boolean | null;

  @Column("character varying", { name: "status", nullable: true, length: 20 })
  status: string | null;
}
