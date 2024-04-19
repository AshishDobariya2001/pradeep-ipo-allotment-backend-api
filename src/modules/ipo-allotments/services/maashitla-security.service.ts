import { Injectable } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { IpoDetailsDto } from '../dto';
import { RegistrarList } from '../enum';
import cheerio from 'cheerio';
import { ERROR } from 'src/frameworks/error-code';
import { BusinessRuleException } from 'src/frameworks/exceptions';

@Injectable()
export class MaashitlaSecuritiesService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}
  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const databaseCompanyName = ipo.companyName.replace(' IPO', '');

      const companyName = databaseCompanyName
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word !== 'ltd' && word !== 'limited')
        .join(' ');

      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.MaashitlaSecuritiesPrivateLimited,
      );

      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);

      const companyList = await this.parseIpoList(response);

      const foundIpo = companyList.find(
        (ipo) =>
          ipo.ipo_name
            .toLowerCase()
            .split(/\s+/)
            .filter((word) => word !== 'ltd' && word !== 'limited')
            .join(' ') === companyName,
      );

      if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
        await this.ipoDetailsRepository.update(ipo.id, {
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
}
