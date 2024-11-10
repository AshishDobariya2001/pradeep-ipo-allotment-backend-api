import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  IpoCategoryType,
  IpoStatusType,
} from 'src/modules/ipo-allotments/enum';
import { IpoTodayALlotmentStatus, IpoType } from '../enums';

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

export class FetchIpoListRequestDto {
  @ApiPropertyOptional({
    type: String,
    enum: IpoStatusType,
  })
  @IsOptional()
  @IsEnum([
    IpoStatusType.Live,
    IpoStatusType.Upcoming,
    IpoStatusType.Listed,
    IpoStatusType.LiveAndUpcoming,
  ])
  type?: IpoStatusType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, enum: IpoTodayALlotmentStatus })
  @IsOptional()
  @IsEnum(IpoTodayALlotmentStatus)
  todayAllotment?: IpoTodayALlotmentStatus;

  @ApiPropertyOptional({
    type: String,
    enum: IpoType,
  })
  @IsOptional()
  @IsEnum([IpoType.MAINLINE, IpoType.SME, IpoType.BOTH])
  categoryType?: IpoType;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  offset?: number;
}
