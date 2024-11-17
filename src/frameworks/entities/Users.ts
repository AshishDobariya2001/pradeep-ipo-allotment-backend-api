import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccessTokens } from "./AccessTokens";
import { UserContacts } from "./UserContacts";

@Index("users_pkey", ["id"], { unique: true })
@Entity("users", { schema: "public" })
export class Users {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name", nullable: true })
  name: string | null;

  @Column("character varying", { name: "phone", nullable: true, length: 20 })
  phone: string | null;

  @Column("text", { name: "email", nullable: true })
  email: string | null;

  @Column("text", { name: "legal_name", nullable: true })
  legalName: string | null;

  @Column("character varying", { name: "pancard", nullable: true, length: 20 })
  pancard: string | null;

  @Column("text", { name: "pin", nullable: true })
  pin: string | null;

  @Column("text", { name: "reset_pin_code_link", nullable: true })
  resetPinCodeLink: string | null;

  @Column("text", { name: "role", nullable: true })
  role: string | null;

  @Column("text", { name: "sub_role", nullable: true })
  subRole: string | null;

  @Column("boolean", {
    name: "is_ipo_screener_access",
    nullable: true,
    default: () => "false",
  })
  isIpoScreenerAccess: boolean | null;

  @Column("boolean", {
    name: "is_ipo_allotment_access",
    nullable: true,
    default: () => "false",
  })
  isIpoAllotmentAccess: boolean | null;

  @Column("boolean", {
    name: "is_ipo_screener_web_access",
    nullable: true,
    default: () => "false",
  })
  isIpoScreenerWebAccess: boolean | null;

  @Column("character varying", {
    name: "country_code",
    nullable: true,
    length: 10,
  })
  countryCode: string | null;

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

  @OneToMany(() => AccessTokens, (accessTokens) => accessTokens.user)
  accessTokens: AccessTokens[];

  @OneToMany(() => UserContacts, (userContacts) => userContacts.user)
  userContacts: UserContacts[];

  @OneToMany(() => UserContacts, (userContacts) => userContacts.user_2)
  userContacts2: UserContacts[];
}
