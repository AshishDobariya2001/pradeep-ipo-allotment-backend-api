import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'Device information',
    type: 'object',
    example: { deviceId: '123', deviceType: 'mobile' },
  })
  device: object;
}
