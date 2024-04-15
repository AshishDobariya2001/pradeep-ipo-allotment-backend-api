import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Contacts, Registrar } from 'src/frameworks/entities';

export class IPOHandleRegistrarDto {
  @IsNumber()
  id?: string;

  @IsBoolean()
  checkCompanyStatus?: boolean;

  @IsBoolean()
  checkUserAllotmentStatus?: boolean;
  contact?: Contacts;
  @IsString()
  panNumber?: string;
  registrar?: Registrar;
}
