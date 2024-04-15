import { IsDate, IsJSON, IsNumber, IsObject, IsString } from 'class-validator';

export class IpoDetailsDto {
  @IsNumber()
  id: number;

  @IsString()
  companyName: string;

  @IsObject()
  ipoRegistrar: object;

  @IsDate()
  basisOfAllotment?: string;

  @IsJSON()
  ipoAllotmentRequiredPayload?: object;
}
