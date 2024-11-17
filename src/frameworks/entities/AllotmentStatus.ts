import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Contacts } from "./Contacts";

@Index("allotment_status_pkey", ["id"], { unique: true })
@Entity("allotment_status", { schema: "public" })
export class AllotmentStatus {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "company_id", length: 255 })
  companyId: string;

  @Column("character varying", { name: "company_name", length: 255 })
  companyName: string;

  @Column("character varying", { name: "allotment_status", length: 20 })
  allotmentStatus: string;

  @Column("jsonb", { name: "data", nullable: true })
  data: object | null;

  @Column("boolean", {
    name: "whatsapp_is_sent",
    nullable: true,
    default: () => "false",
  })
  whatsappIsSent: boolean | null;

  @Column("boolean", {
    name: "notification_is_sent",
    nullable: true,
    default: () => "false",
  })
  notificationIsSent: boolean | null;

  @Column("character varying", { name: "pancard", nullable: true, length: 255 })
  pancard: string | null;

  @Column("text", { name: "applied_stock", nullable: true })
  appliedStock: string | null;

  @Column("character varying", {
    name: "alloted_stock",
    nullable: true,
    length: 255,
  })
  allotedStock: string | null;

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

  @ManyToOne(() => Contacts, (contacts) => contacts.allotmentStatuses)
  @JoinColumn([{ name: "contact_id", referencedColumnName: "id" }])
  contact: Contacts;
}
