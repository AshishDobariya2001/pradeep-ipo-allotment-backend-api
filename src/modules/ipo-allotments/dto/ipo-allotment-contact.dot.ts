import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class IpoAllotmentContactDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  panNumber: string;
}
