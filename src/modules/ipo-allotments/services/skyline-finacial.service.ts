/* eslint-disable max-lines-per-function */
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import cheerio from 'cheerio';
import { IpoDetailsDto } from '../dto';
import { RegistrarList } from '../enum';
import { Registrar } from 'src/frameworks/entities';
import { ERROR, HttpStatusCode } from 'src/frameworks/error-code';

@Injectable()
export class SkyLineFinancialService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}

  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const companyName = ipo.companyName.replace(' IPO', '');
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.SkylineFinancialServicesPrivateLtd,
      );
      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);
      const companyList = this.parseIpoList(response);

      const foundIpo = companyList.find((ipo) =>
        ipo.ipo_name.toLowerCase().includes(companyName.toLowerCase()),
      );

      if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
        await this.ipoDetailsRepository.update(ipo.id, {
          ipoAllotmentRequiredPayload: foundIpo,
        });
      }
      return foundIpo;
    } catch (error) {
      throw new HttpException(
        {
          message: `Failed to fetch company list'`,
          error: ERROR.UNABLE_TO_FETCH_COMPANY_LIST,
        },
        HttpStatusCode.Found,
      );
    }
  }
  private parseIpoList(html): { ipo_name: string; ipo_code: string }[] {
    const $ = cheerio.load(html);
    const options = $('#company option');
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
    panNumber?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const formData = {
      client_id: '',
      pan: panNumber,
      app: ipoAllotmentRequiredPayload.ipo_code,
      action: 'search',
      image: 'Search',
    };

    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    try {
      const result = await this.ipoAllotmentApi.post(
        registrar.allotmentUrl[0],
        formData,
        headers,
      );
      const allotment = await this.parseApplicationData(result);
      console.log('🚀 ~ SkyLineFinancialService ~ allotment:', allotment);
      return {
        allotmentStatus: allotment.status,
        name: allotment.applicant_name,
        data: allotment,
        appliedStock: allotment.shares_applied,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch allotment status');
    }
  }

  async parseApplicationData(html) {
    const $ = cheerio.load(html);

    const companyName = $('strong:contains("Company Name")')
      .parent()
      .text()
      .replace('Company Name : ', '')
      .trim();

    const applicantName = $('strong:contains("Applicant Name")')
      .parent()
      .text()
      .replace('Applicant Name : ', '')
      .trim();

    const dpIpClientId = $('strong:contains("DP IP /Client ID")')
      .parent()
      .text()
      .replace('DP IP /Client ID : ', '')
      .trim();

    const applicationNumber = $('strong:contains("Application Number")')
      .parent()
      .text()
      .replace('Application Number : ', '')
      .trim();

    const pan = $('strong:contains("Pan")')
      .parent()
      .text()
      .replace('Pan : ', '')
      .trim();

    const allotmentDate = $('strong:contains("Allotment Date")')
      .parent()
      .text()
      .replace('Allotment Date : ', '')
      .trim();

    // Extracting Address
    let address = $('strong:contains("Address")')
      .parent()
      .text()
      .replace('Address : ', '')
      .trim();
    address = address.replace(/\s+/g, ' ');
    // Extracting other details from the table
    const sharesApplied = $('table td:nth-child(1)').text().trim();
    const applicationAmount = $('table td:nth-child(2)').text().trim();
    const sharesAlloted = $('table td:nth-child(3)').text().trim();
    const amountAdjusted = $('table td:nth-child(4)').text().trim();
    const amountRefundedUnblocked = $('table td:nth-child(5)').text().trim();
    const dateOfCreditOfShares = $('table td:nth-child(6)').text().trim();
    const modeOfPayment = $('table td:nth-child(7)').text().trim();
    const reasonOfNonAllotment = $('table td:nth-child(8)').text().trim();
    const status = $('table td:nth-child(9)').text().trim();

    return {
      company_name: companyName,
      applicant_name: applicantName,
      dp_ip: dpIpClientId,
      application_number: applicationNumber,
      pan: pan,
      allotment_date: allotmentDate,
      address: address,
      shares_applied: sharesApplied,
      application_amount: applicationAmount,
      shares_alloted: sharesAlloted,
      amount_adjusted: amountAdjusted,
      amount_refunded_unblocked: amountRefundedUnblocked,
      date_of_credit_of_shares: dateOfCreditOfShares,
      mode_of_payment: modeOfPayment,
      reason_of_non_allotment: reasonOfNonAllotment,
      status: status,
    };
  }
}
