import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('registrar_pkey', ['id'], { unique: true })
@Entity('registrar', { schema: 'public' })
export class Registrar {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('text', {
    name: 'server_url',
    nullable: true,
    array: true,
    default: () => "'{}'[]",
  })
  serverUrl: string[] | null;

  @Column('text', {
    name: 'allotment_url',
    nullable: true,
    array: true,
    default: () => "'{}'[]",
  })
  allotmentUrl: string[] | null;

  @Column('boolean', {
    name: 'is_active',
    nullable: true,
    default: () => 'false',
  })
  isActive: boolean | null;
}
