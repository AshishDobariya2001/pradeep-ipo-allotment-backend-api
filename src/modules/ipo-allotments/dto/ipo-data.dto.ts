import { IsString } from 'class-validator';
import { IpoAllotmentStatus } from '../enum/ipo-allotment-status.enum';

export class IpoDataValidationDto {
  companyName?: string;
  applicantName?: string;
  dpIp?: string;
  applicationNumber?: string;
  pan?: string;
  allotmentDate?: string;
  address?: string;
  appliedStock?: string;
  applicationAmount?: string;
  allotedStock?: string;
  amountAdjusted?: string;
  amountRefundedUnblocked?: string;
  dateOfCreditOfShares?: string;
  modeOfPayment?: string;
  reasonOfNonAllotment?: string;
  status?: IpoAllotmentStatus;
  category?: string;
}
