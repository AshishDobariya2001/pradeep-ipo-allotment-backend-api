import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { IpoStatusType, IpoType } from '../enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IpoTodayALlotmentStatus } from '../enum/ipo-today-allotment.enum';

export class GetIpoListDto {
  @ApiPropertyOptional({
    type: String,
    enum: IpoStatusType,
  })
  @IsOptional()
  @IsEnum([IpoStatusType.Upcoming, IpoStatusType.Listed, IpoStatusType.BOTH])
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
