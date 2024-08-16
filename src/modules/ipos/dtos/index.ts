import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { IpoCategoryType } from 'src/modules/ipo-allotments/enum';

export class IpoCalendarList {
  @ApiPropertyOptional()
  @IsDateString()
  ipoStartDate: Date;

  @ApiPropertyOptional()
  @IsDateString()
  ipoEndDate: Date;

  @ApiPropertyOptional({
    enum: IpoCategoryType,
    example: IpoCategoryType.Listed,
  })
  @IsEnum(IpoCategoryType)
  type: IpoCategoryType;
}

export class AddPanCardDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pan: string;
}
