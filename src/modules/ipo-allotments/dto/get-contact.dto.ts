import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class GetContactDto {
  @ApiProperty()
  @IsArray()
  panNumbers: string[];
}
