import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { RegistrarList } from '../enum';
import { IpoDetailsDto } from '../dto';
import { Contacts, Registrar } from 'src/frameworks/entities';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { ERROR } from 'src/frameworks/error-code';
import locateChrome from 'locate-chrome';
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

    // const executablePath: string =
    //   (await new Promise((resolve) =>
    //     locateChrome((arg: any) => resolve(arg)),
    //   )) || '';

    // console.log(
    //   '🚀 ~ BigShareService ~ getAllotmentStatus ~ executablePath:',
    //   executablePath,
    // );

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
    pancard: string,
    ipoAllotmentRequiredPayload,
  ) {
    const payload = {
      Applicationno: '',
      Company: ipoAllotmentRequiredPayload.ipo_code,
      SelectionType: 'PN',
      PanNo: pancard,
      txtcsdl: '',
      txtDPID: '',
      txtClId: '',
      ddlType: '0',
    };

    for (const url of registrar.allotmentUrl) {
      try {
        const response = await this.ipoAllotmentApi.post(url, payload);
        if (response) {
          return {
            allotmentStatus: response['d'].ALLOTED,
            name: response['d'].Name,
            data: response['d'],
            appliedStock: response['d'].APPLIED,
          };
        }
      } catch (error) {
        Logger.error(`Error occurred while fetching data from ${url}:`, error);
      }
    }

    throw new BusinessRuleException(ERROR.UNABLE_TO_FETCH_ALLOTMENT_STATUS);
  }
}
