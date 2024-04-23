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
    const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
      RegistrarList.LinkInTimeIndiaPrivateLtd,
    );
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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(
      'https://linkintime.co.in/Initial_Offer/public-issues.html',
    );
    const cookies = await page.cookies();
    console.log('🚀 ~ LinkInTimeService ~ cookies:', cookies);

    // Close the browser
    await browser.close();

    // Use the cookies in subsequent requests
    const cookieHeader = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const headers = {
      'Content-Type': 'application/json;charset:utf-8',
      Cookie: cookieHeader,
    };
    console.log('🚀 ~ LinkInTimeService ~ cookies:', cookies);
    const tokenResponse = await this.ipoAllotmentApi.post(
      'https://linkintime.co.in/Initial_Offer/IPO.aspx/generateToken',
      {},
      headers,
    );
    console.log('🚀 ~ LinkInTimeService ~ tokenResponse:', tokenResponse);
  }
}
