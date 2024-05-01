import { Injectable, Logger } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { RegistrarList } from '../enum';
import { IpoDataValidationDto, IpoDetailsDto } from '../dto';
import { Registrar } from 'src/frameworks/entities';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';
import { IpoAllotmentStatus } from '../enum/ipo-allotment-status.enum';
import cheerio from 'cheerio';
import { compareNameWithIpo } from 'src/frameworks/function';

@Injectable()
export class BigShareService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}

  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
      RegistrarList.BigShareServicesPvtLtd,
    );

    const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);
    const companyList = this.parseIpoList(response);

    const foundIpo = compareNameWithIpo(ipo.companyName, companyList);

    if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
      await this.ipoDetailsRepository.update(ipo.id, {
        ipoAllotmentRequiredPayload: foundIpo,
      });
    }
    return foundIpo;
  }

  private parseIpoList(html): { ipo_name: string; ipo_code: string }[] {
    const $ = cheerio.load(html);
    const options = $('#ddlCompany option');
    const ipoList = options
      .map((index, element) => {
        const ipo_name = $(element).text();
        const ipo_code = $(element).attr('value');
        return { ipo_name, ipo_code };
      })
      .get();
    ipoList.shift();
    return ipoList;
  }

  async getUserAllotmentStatus(
    registrar: Registrar,
    panNumber: string,
    ipoAllotmentRequiredPayload,
  ) {
    const payload = {
      Applicationno: '',
      Company: ipoAllotmentRequiredPayload.ipo_code,
      SelectionType: 'PN',
      PanNo: panNumber,
      txtcsdl: '',
      txtDPID: '',
      txtClId: '',
      ddlType: '0',
    };

    for (const url of registrar.allotmentUrl) {
      try {
        const response = await this.ipoAllotmentApi.post(url, payload);
        if (response) {
          const responseData = await this.parseAllotmentData(response['d']);
          return {
            allotmentStatus: response['d'].ALLOTED,
            name: response['d'].Name,
            data: responseData,
            appliedStock: response['d'].APPLIED,
            allotedStock: response['d'].ALLOTED,
            status: responseData.status,
          };
        }
      } catch (error) {
        Logger.error(`Error occurred while fetching data from ${url}:`, error);
      }
    }

    throw new BusinessRuleException(ERROR.UNABLE_TO_FETCH_ALLOTMENT_STATUS);
  }
  async parseAllotmentData(response): Promise<IpoDataValidationDto> {
    let status: IpoAllotmentStatus;
    if (response['APPLICATION_NO'] === '') {
      status = IpoAllotmentStatus.NOT_APPLIED;
    } else if (parseInt(response['ALLOTED']) > 0) {
      status = IpoAllotmentStatus.ALLOTED;
    } else {
      status = IpoAllotmentStatus.NON_ALLOTTED;
    }
    const data: IpoDataValidationDto = {
      applicationNumber: response['APPLICATION_NO'],
      dpNumber: response['DPID'],
      applicantName: response['Name'],
      appliedStock: response['APPLIED'],
      allotedStock: response['ALLOTED'],
      status: status,
    };
    return data;
  }
}
