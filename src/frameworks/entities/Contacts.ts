import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AllotmentStatus } from "./AllotmentStatus";
import { UserContacts } from "./UserContacts";

@Index("contacts_pkey", ["id"], { unique: true })
@Entity("contacts", { schema: "public" })
export class Contacts {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "pan_number",
    nullable: true,
    length: 20,
  })
  panNumber: string | null;

  @Column("character varying", {
    name: "legal_name",
    nullable: true,
    length: 255,
  })
  legalName: string | null;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 20 })
  phone: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

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

  @OneToMany(
    () => AllotmentStatus,
    (allotmentStatus) => allotmentStatus.contact
  )
  allotmentStatuses: AllotmentStatus[];

  @OneToMany(() => UserContacts, (userContacts) => userContacts.contact)
  userContacts: UserContacts[];

  @OneToMany(() => UserContacts, (userContacts) => userContacts.contact_2)
  userContacts2: UserContacts[];
}
