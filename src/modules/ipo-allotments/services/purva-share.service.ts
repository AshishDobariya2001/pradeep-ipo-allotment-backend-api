import { Injectable } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { IpoDataValidationDto, IpoDetailsDto } from '../dto';
import { IpoAllotmentStatus, RegistrarList } from '../enum';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { compareNameWithIpo } from 'src/frameworks/function';
import { ERROR } from 'src/frameworks/error-code';
import cheerio from 'cheerio';
import { Registrar } from 'src/frameworks/entities';

@Injectable()
export class PurvaShareService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}
  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.PurvaSharegistryIndiaPvtLtd,
      );

      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);

      const companyList = await this.parseIpoList(response);

      const foundIpo = compareNameWithIpo(ipo.companyName, companyList);

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
  private parseIpoList(html): { ipo_name: string; ipo_code: string }[] {
    const $ = cheerio.load(html);
    const options = $('#company_id option');
    const ipoList = options
      .map((index, element) => {
        const ipo_name = $(element).text().trim();
        const ipo_code = $(element).attr('value');
        return { ipo_name, ipo_code };
      })
      .get();
    ipoList.shift();
    return ipoList;
  }

  async getUserAllotmentStatus(
    registrar: Registrar,
    pancard: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const pageResponse = await this.ipoAllotmentApi.get(
      registrar.allotmentUrl[0],
    );
    const $ = cheerio.load(String(pageResponse));
    const csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

    const payload = new URLSearchParams();
    payload.append('csrfmiddlewaretoken', String(csrfToken));
    payload.append('company_id', ipoAllotmentRequiredPayload.ipo_code);
    payload.append('applicationNumber', '');
    payload.append('panNumber', pancard);
    payload.append('submit', 'Search');

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `csrftoken=${csrfToken}`,
    };

    const response = await this.ipoAllotmentApi.post(
      registrar.allotmentUrl[0],
      payload.toString(),
      headers,
    );
    const allotment = await this.parseApplicationData(response);

    return {
      allotmentStatus: allotment?.status,
      name: allotment?.applicantName,
      data: allotment,
      appliedStock: allotment?.appliedStock,
      allotedStock: allotment?.allotedStock,
    };
  }

  async parseApplicationData(html): Promise<IpoDataValidationDto> {
    const $$ = cheerio.load(html);

    let tableData: IpoDataValidationDto | null = null;

    $$('.table-responsive table tbody').each((index, element) => {
      const row = $$(element)
        .find('td')
        .map((i, el) => $$(el).text().trim())
        .get();

      if (row.length > 0) {
        const allotedStock = Number(row[5]);
        let status: IpoAllotmentStatus;

        if (allotedStock === 0) {
          status = IpoAllotmentStatus.NON_ALLOTTED;
        } else if (allotedStock > 0) {
          status = IpoAllotmentStatus.ALLOTED;
        }

        tableData = {
          applicantName: row[0],
          applicationNumber: row[1],
          pan: row[2],
          dpNumber: row[3],
          appliedStock: row[4],
          allotedStock: row[5],
          amountRefundedUnblocked: row[6],
          status: status,
        };
      }
    });

    if (tableData === null) {
      tableData = {
        status: IpoAllotmentStatus.NOT_APPLIED,
      };
    }
    return tableData;
  }
}
