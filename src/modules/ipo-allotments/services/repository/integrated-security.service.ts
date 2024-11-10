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
export class IntegratedSecuritiesService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}
  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.IntegratedRegistryManagementServicesPrivateLimited,
      );

      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);

      const companyList = await this.parseIpoList(response);

      const foundIpo = compareNameWithIpo(ipo.companyName, companyList);

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

    const companyList = [];

    $(
      'section.RightIssueAllotSection.CommonSectionCls select[name="CompDdl2"] option',
    ).each(function () {
      const ipoCode = $(this).attr('value');
      const ipoName = $(this).text();
      if (ipoCode !== '0') {
        companyList.push({ ipo_code: ipoCode, ipo_name: ipoName });
      }
    });
    return companyList;
  }

  async getUserAllotmentStatus(
    registrar?: Registrar,
    pancard?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const data = {
      Comp: ipoAllotmentRequiredPayload.ipo_code,
      AppNum: '',
      Choice: '3',
      PANNO: pancard,
      DPClit: '',
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await this.ipoAllotmentApi.post(
      registrar.allotmentUrl[0],
      data,
      headers,
    );
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
    const $ = cheerio.load(response);

    const data = {};

    $('.commondiv').each(function () {
      const left = $(this).find('.leftdiv').text().trim();
      const right = $(this).find('.rightdiv').text().trim();
      data[left] = right.replace(/^: /, '');
    });

    let status: IpoAllotmentStatus;
    if (data['Allotted'] !== undefined && data['Allotted'] !== null) {
      const allotedStock = Number(data['Allotted']);

      if (allotedStock > 0) {
        status = IpoAllotmentStatus.ALLOTED;
      } else {
        status = IpoAllotmentStatus.NON_ALLOTTED;
      }
    } else {
      status = IpoAllotmentStatus.NOT_APPLIED;
    }
    return {
      companyName: data['Company'],
      applicationNumber: data['Application No.'],
      pan: data['PAN No.'],
      category: data['Category'],
      dpNumber: data['Dpid Client Id'],
      applicantName: data['Name'],
      appliedStock: data['Applied'],
      allotedStock: data['Allotted'],
      status: status, // Assuming status is defined elsewhere in your code
    };
  }
}
