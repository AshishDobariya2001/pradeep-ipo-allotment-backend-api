import { Injectable } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../../repositories';
import { IpoDataValidationDto, IpoDetailsDto } from '../../dto';
import { RegistrarList } from '../../enum';
import cheerio from 'cheerio';
import { ERROR } from 'src/frameworks/error-code';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { compareNameByPercentage } from 'src/frameworks/function';
import { Registrar } from 'src/frameworks/entities';
import { IpoAllotmentStatus } from '../../enum/ipo-allotment-status.enum';

@Injectable()
export class MassSecuritiesService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}
  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.MasServicesLimited,
      );

      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);
      const foundIpo = await this.parseIpoList(response, ipo.companyName);

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
  async parseIpoList(html, companyName: string) {
    const $ = cheerio.load(html);
    const companyData: any = {};

    $('b').each((index, element) => {
      const text = $(element)
        .text()
        .trim()
        .replace('  ALLOTMENT STATUS', '')
        .replace('IPO - ', '');

      if (compareNameByPercentage(companyName, text) >= 80) {
        const form2 = $('form[name="form2"]');
        const anchorElement = form2.find('a[href="asearch.asp"]');
        if (anchorElement.length > 0) {
          companyData.ipo_name = $(element).text().trim();
          companyData.ipo_code = anchorElement.attr('href') || null;
          return false; // Exit loop once found
        }
      }
    });

    return companyData;
  }

  async getUserAllotmentStatus(
    registrar?: Registrar,
    pancard?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const data = {
      DtLogin: 'Search',
      texthn: pancard,
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

  async parseApplicationData(html): Promise<IpoDataValidationDto> {
    const $ = cheerio.load(html);

    const companyName = $('font[color="crimson"] > b > u').text().trim();
    const category = $('td[bgcolor="#F4F3F1"] > font[color="brown"] > b')
      .text()
      .trim();
    const applicantName = $('td:contains("Name")').next().text().trim();
    const pan = $('td:contains("PAN")').next().text().trim();
    const dpNumber = $('td:contains("DP ID")').next().text().trim();
    const clientId = $('td:contains("Client ID")').next().text().trim();

    const appliedStock = $('td:contains("Shares Applied")')
      .next()
      .text()
      .trim();

    let allotedStock = $('td:contains("Shares Allotted")').next().text().trim();
    const amountAdjusted = $('td:contains("Amount Adjusted")')
      .next()
      .text()
      .trim();

    const amountRefundedUnblocked = $('td:contains("Amount UnBlocked")')
      .next()
      .text()
      .trim();

    let status = IpoAllotmentStatus.NOT_APPLIED;
    if (allotedStock === 'NIL') {
      allotedStock = '0';
      status = IpoAllotmentStatus.NON_ALLOTTED;
    } else if (parseInt(appliedStock) > 0) {
      status = IpoAllotmentStatus.ALLOTED;
    }

    return {
      companyName,
      category,
      applicantName,
      pan,
      dpNumber,
      clientId,
      appliedStock,
      allotedStock,
      amountAdjusted,
      amountRefundedUnblocked,
      status,
    };
  }
}
