import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { RegistrarList } from '../enum';
import { IpoDataValidationDto, IpoDetailsDto } from '../dto';
import { Registrar } from 'src/frameworks/entities';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';
import { IpoAllotmentStatus } from '../enum/ipo-allotment-status.enum';
@Injectable()
export class BigShareService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}

  async getAllotmentStatus(ipo: IpoDetailsDto) {
    const companyName = ipo.companyName.replace(' IPO', '');
    const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
      RegistrarList.BigShareServicesPvtLtd,
    );

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(registrar.serverUrl[0]);

    const ipoData = await page.$$eval('#ddlCompany option', (options) => {
      return options.map((option) => ({
        ipo_name: option.textContent.trim(),
        ipo_code: option.getAttribute('value'),
      }));
    });
    await browser.close();

    const companyList = ipoData.filter((ipo) => ipo.ipo_code !== '');
    const foundIpo = companyList.find((ipo) =>
      ipo.ipo_name.toLowerCase().includes(companyName.toLowerCase()),
    );
    if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
      await this.ipoDetailsRepository.update(ipo.id, {
        ipoAllotmentRequiredPayload: foundIpo,
      });
    }
    return foundIpo;
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
      dpIp: response['DPID'],
      applicantName: response['Name'],
      appliedStock: response['APPLIED'],
      allotedStock: response['ALLOTED'],
      status: status,
    };
    return data;
  }
}
