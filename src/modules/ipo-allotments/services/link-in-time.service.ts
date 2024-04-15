/* eslint-disable max-lines-per-function */
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { RegistrarList } from '../enum';
import { IpoDetailsDto } from '../dto';
import { Contacts, Registrar } from 'src/frameworks/entities';

@Injectable()
export class LinkInTimeService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {
    // this.getUserAllotmentStatus();
  }

  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    // const companyName = ipo.companyName.replace(' IPO', '');
    // const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
    //   RegistrarList.BigShareServicesPvtLtd,
    // );
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(
      'https://linkintime.co.in/Initial_Offer/public-issues.html',
    );

    const ipoData = await page.$$eval('#ddlCompany option', (options) => {
      return options.map((option) => ({
        ipo_name: option.textContent.trim(),
        ipo_code: option.getAttribute('value'),
      }));
    });
    await browser.close();

    const filteredIpoData = ipoData.filter((ipo) => ipo.ipo_code !== '');
    console.log(
      '🚀 ~ LinkInTimeService ~ getAllotmentStatus ~ filteredIpoData:',
      filteredIpoData,
    );
    // const foundIpo = filteredIpoData.find((ipo) =>
    //   ipo.ipo_name.toLowerCase().includes(companyName.toLowerCase()),
    // );
    // if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
    //   await this.ipoDetailsRepository.update(ipo.id, {
    //     ipoAllotmentRequiredPayload: foundIpo,
    //   });
    // }
  }
  async getUserAllotmentStatus(
    registrar?: Registrar,
    pancard?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const url = 'https://linkintime.co.in/Initial_Offer/IPO.aspx/generateToken';
    const headers = {
      headers: {
        'Content-Type': 'application/json;charset:utf-8',
        Origin: 'https://linkintime.co.in',
        Cookie: 'ASP.NET_SessionId=dhzz5ebgimkl5145quchl3qr',
      },
    };
    const response = await this.ipoAllotmentApi.post(url, {}, headers);
    console.log('Response:', response);

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
    console.log('🚀 ~ BigShareService ~ payload:', payload);
    console.log(
      '🚀 ~ BigShareService ~ registrar.allotmentUrl:',
      registrar.allotmentUrl,
    );

    for (const url of registrar.allotmentUrl) {
      console.log('🚀 ~ BigShareService ~ url:', url);
      try {
        const response = await this.ipoAllotmentApi.post(url, payload);
        console.log('🚀 ~ BigShareService ~ response:', response);
        if (response) {
          return {
            allotmentStatus: response['d'].ALLOTED,
            name: response['d'].Name,
            data: response['d'],
            appliedStock: response['d'].APPLIED,
          };
        }
      } catch (error) {
        console.error(`Error occurred while fetching data from ${url}:`, error);
      }
    }

    throw new Error('Failed to fetch data from all allotment URLs');
  }
}
