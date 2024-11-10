import { Injectable } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../../repositories';
import { IpoDataValidationDto, IpoDetailsDto } from '../../dto';
import { RegistrarList } from '../../enum';
import cheerio from 'cheerio';
import { ERROR } from 'src/frameworks/error-code';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { compareNameWithIpo } from 'src/frameworks/function';
import { Registrar } from 'src/frameworks/entities';
import { IpoAllotmentStatus } from '../../enum/ipo-allotment-status.enum';

@Injectable()
export class MaashitlaSecuritiesService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}
  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const companyName = ipo.companyName;

      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.MaashitlaSecuritiesPrivateLimited,
      );

      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);

      const companyList = await this.parseIpoList(response);

      const foundIpo = compareNameWithIpo(companyName, companyList);

      if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
        await this.ipoDetailsRepository.update(ipo.id, {
          ipoAllotmentStatus: true,
          ipoAllotmentRequiredPayload: foundIpo,
        });
      }
      return foundIpo;
    } catch (error) {
      throw new BusinessRuleException(ERROR.UNABLE_TO_FETCH_COMPANY_LIST);
    }
  }
  async parseIpoList(html): Promise<{ ipo_name: string; ipo_code: string }[]> {
    const $ = cheerio.load(html);
    const options = $('#txtCompany option');
    const companyList = options
      .map((index, element) => ({
        ipo_code: $(element).attr('value'),
        ipo_name: $(element).text().trim(),
      }))
      .get();
    companyList.shift();
    return companyList;
  }

  async getUserAllotmentStatus(
    registrar?: Registrar,
    pancard?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const url = `${registrar.allotmentUrl[0]}?company=${ipoAllotmentRequiredPayload.ipo_code}&search=${pancard}`;
    const response = await this.ipoAllotmentApi.get(url);
    const allotment = await this.parseApplicationData(response);
    return {
      allotmentStatus: allotment.status,
      name: allotment.applicantName,
      data: allotment,
      appliedStock: allotment.appliedStock,
      allotedStock: allotment.allotedStock,
    };
  }

  async parseApplicationData(response): Promise<IpoDataValidationDto> {
    return {
      applicationNumber: response['application_Number'],
      dpNumber: response['demat_Account_Number'],
      applicantName: response['name'],
      appliedStock: response['share_Applied'],
      allotedStock: response['share_Alloted'],
      status:
        response['share_Alloted'] > 0
          ? IpoAllotmentStatus.ALLOTED
          : response['share_Applied'] === 0
            ? IpoAllotmentStatus.NOT_APPLIED
            : IpoAllotmentStatus.NON_ALLOTTED,
    };
  }
}
