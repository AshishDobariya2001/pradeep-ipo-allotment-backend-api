import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('registrar', { schema: 'public' })
export class Registrar {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;

  @Column('text', { name: 'server_url', nullable: true, array: true })
  serverUrl: string[] | null;

  @Column('text', { name: 'allotment_url', nullable: true, array: true })
  allotmentUrl: string[] | null;

  @Column('boolean', { name: 'is_active', nullable: true })
  isActive: boolean;
}
