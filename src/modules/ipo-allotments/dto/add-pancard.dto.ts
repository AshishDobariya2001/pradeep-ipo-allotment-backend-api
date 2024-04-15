import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddPanCardDto {
  @ApiProperty()
  @IsString()
  panNumber: string;
}
