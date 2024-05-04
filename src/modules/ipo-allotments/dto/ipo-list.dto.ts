import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { IpoStatusType, IpoType } from '../enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetIpoListDto {
  @ApiPropertyOptional({
    type: String,
    enum: IpoStatusType,
  })
  @IsOptional()
  @IsEnum([IpoStatusType.Upcoming, IpoStatusType.Listed, IpoStatusType.All])
  type?: IpoStatusType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  todayAllotment?: boolean;

  @ApiPropertyOptional({
    type: String,
    enum: IpoType,
  })
  @IsOptional()
  @IsEnum([IpoType.MAINLINE, IpoType.SME])
  categoryType?: IpoType;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  offset?: number;
}
