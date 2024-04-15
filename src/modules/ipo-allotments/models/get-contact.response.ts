import { ApiProperty } from '@nestjs/swagger';

export class GetContactResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  panNumber: string;

  @ApiProperty()
  legalName: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;
}
