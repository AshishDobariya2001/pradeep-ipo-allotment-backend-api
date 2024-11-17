import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IpoDetails } from "./IpoDetails";

@Index("ipo_kpi_pkey", ["id"], { unique: true })
@Entity("ipo_kpi", { schema: "public" })
export class IpoKpi {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "kpi_name", nullable: true })
  kpiName: string | null;

  @Column("character varying", { name: "kpi_value", nullable: true })
  kpiValue: string | null;

  @ManyToOne(() => IpoDetails, (ipoDetails) => ipoDetails.ipoKpis)
  @JoinColumn([{ name: "ipo_details_id", referencedColumnName: "id" }])
  ipoDetails: IpoDetails;
}
