import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IpoDetails } from "./IpoDetails";

@Index("ix_ipo_lot_size_application", ["application"], {})
@Index("ix_ipo_lot_size_id", ["id"], {})
@Index("ipo_lot_size_pkey", ["id"], { unique: true })
@Entity("ipo_lot_size", { schema: "public" })
export class IpoLotSize {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "application", nullable: true })
  application: string | null;

  @Column("character varying", { name: "lots", nullable: true })
  lots: string | null;

  @Column("character varying", { name: "shares", nullable: true })
  shares: string | null;

  @Column("character varying", { name: "amount", nullable: true })
  amount: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoLotSizes)
  @JoinColumn([{ name: "ipo_details_id", referencedColumnName: "id" }])
  ipoDetails: IpoDetails;
}
