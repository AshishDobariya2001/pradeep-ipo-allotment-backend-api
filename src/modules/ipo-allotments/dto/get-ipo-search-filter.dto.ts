import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { IpoStatusType, IpoType } from '../enum';

export class GetIpoSearchFilterDto {
  @IsString()
  name?: string;
  @IsString()
  status?: string;
  @IsBoolean()
  todayAllotment: string;

  @IsEnum([IpoType.MAINLINE, IpoType.SME])
  type: IpoType;
}
