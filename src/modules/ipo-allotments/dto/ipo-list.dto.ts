import { IsEnum, IsNumber } from 'class-validator';
import { IpoType } from '../enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetIpoListDto {
  @ApiProperty({
    type: String,
    enum: IpoType,
  })
  @IsEnum([IpoType.Upcoming, IpoType.Listed])
  type: IpoType;

  @ApiProperty({
    type: Number,
  })
  limit: string;

  @ApiProperty({
    type: Number,
  })
  offset: string;
}
