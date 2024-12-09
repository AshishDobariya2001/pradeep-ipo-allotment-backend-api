import { Column, Entity, Index } from 'typeorm';

@Index('access_tokens_pkey', ['id'], { unique: true })
@Entity('access_tokens', { schema: 'public' })
export class AccessTokens {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('text', { name: 'token' })
  token: string;

  @Column('bigint', { name: 'user_id', nullable: true })
  userId: string | null;

  @Column('jsonb', { name: 'device_info', nullable: true })
  deviceInfo: object | null;

  @Column('integer', {
    name: 'request_count',
    nullable: true,
    default: () => '0',
  })
  requestCount: number | null;

  @Column('text', { name: 'device_platform' })
  devicePlatform: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    nullable: true,
    default: () => 'now()',
  })
  createdAt: Date | null;

  @Column('timestamp with time zone', {
    name: 'updated_at',
    nullable: true,
    default: () => 'now()',
  })
  updatedAt: Date | null;
}
