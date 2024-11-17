import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IpoDetails } from "./IpoDetails";

@Index("ipo_reservation_pkey", ["id"], { unique: true })
@Entity("ipo_reservation", { schema: "public" })
export class IpoReservation {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "anchor_investor_shares_offered",
    nullable: true,
  })
  anchorInvestorSharesOffered: string | null;

  @Column("character varying", { name: "qib_shares_offered", nullable: true })
  qibSharesOffered: string | null;

  @Column("character varying", {
    name: "nii_hni_shares_offered",
    nullable: true,
  })
  niiHniSharesOffered: string | null;

  @Column("character varying", {
    name: "retail_shares_offered",
    nullable: true,
  })
  retailSharesOffered: string | null;

  @Column("character varying", { name: "total_shares_offered", nullable: true })
  totalSharesOffered: string | null;

  @Column("character varying", {
    name: "market_maker_shares_offered",
    nullable: true,
  })
  marketMakerSharesOffered: string | null;

  @Column("character varying", { name: "other_shares_offered", nullable: true })
  otherSharesOffered: string | null;

  @Column("character varying", {
    name: "employee_shares_offered",
    nullable: true,
  })
  employeeSharesOffered: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoReservations)
  @JoinColumn([{ name: "ipo_details_id", referencedColumnName: "id" }])
  ipoDetails: IpoDetails;
}
