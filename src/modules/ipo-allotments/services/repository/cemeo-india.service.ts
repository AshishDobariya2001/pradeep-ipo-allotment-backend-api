import { Injectable, Logger } from '@nestjs/common';
import { IpoDetailsRepository } from '../../repositories';
import {
  SOLVE_CAPTCHA_API,
  SOLVE_CAPTCHA_API_KEY,
  SOLVE_CAPTCHA_USER_ID,
} from 'src/frameworks/environment';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { Registrar } from 'src/frameworks/entities';
import * as puppeteer from 'puppeteer';
import { IpoDataValidationDto, IpoDetailsDto } from '../../dto';
import cheerio from 'cheerio';
import { IpoAllotmentStatus, RegistrarList } from '../../enum';
import { compareNameWithIpo } from 'src/frameworks/function';

@Injectable()
export class CameoIndiaService {
  constructor(
    private ipoDetailsRepository: IpoDetailsRepository,
    private ipoAllotmentApi: AllotmentBaseApiService,
  ) {}

  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.CameoCorporateServicesLimited,
      );

      const response = await this.ipoAllotmentApi.get(registrar.serverUrl[0]);
      const html = response;
      const companyList = this.parseIpoList(html);
      const foundIpo = compareNameWithIpo(ipo.companyName, companyList);

      if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
        await this.ipoDetailsRepository.update(ipo.id, {
          ipoAllotmentStatus: true,
          ipoAllotmentRequiredPayload: foundIpo,
        });
      }
      return foundIpo;
    } catch (error) {
      throw new Error('Failed to fetch IPO data');
    }
  }

  private parseIpoList(html): { ipo_name: string; ipo_code: string }[] {
    const $ = cheerio.load(html);
    const options = $('#drpCompany option');
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
    registrar?: Registrar,
    pancard?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    try {
      await page.goto(registrar.allotmentUrl[0]);
      await page.waitForSelector('.preloader', { hidden: true });
      await page.screenshot({ path: '0.png' });
      await page.select(
        'select#drpCompany',
        ipoAllotmentRequiredPayload.ipo_code,
      );
      await page.select('select#ddlUserTypes', 'PAN NO');

      await page.type('#txtfolio', pancard);
      await page.screenshot({ path: '1.png' });

      const imageCaptchaElement = await page.waitForSelector(
        '.form-group #imgCaptcha',
      );

      let imageBuffer: Buffer | null = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (!imageBuffer && retryCount < maxRetries) {
        const imageLoaded = await page.evaluate(async () => {
          const image = document.getElementById(
            'imgCaptcha',
          ) as HTMLImageElement;
          return (
            image.complete && image.naturalWidth > 0 && image.naturalHeight > 0
          );
        });

        if (imageLoaded) {
          imageBuffer = await imageCaptchaElement.screenshot({
            encoding: 'binary',
          });
        } else {
          retryCount++;
          Logger.log(`Retry ${retryCount} - Image captcha not loaded`);
        }
      }
      if (imageBuffer) {
        const imageBuffer = await imageCaptchaElement.screenshot({
          path: 'captcha-cameo.png',
        });

        await page.screenshot({ path: '2.png' });

        const result = await this.solveCaptcha(imageBuffer);
        await page.type('#txt_phy_captcha', result);
        await page.screenshot({ path: '3.png' });

        await page.click('#btngenerate');

        await page.waitForSelector('#divgrid1', { visible: true });

        await page.screenshot({ path: '4.png', fullPage: true });

        const htmlContent = await page.content();
        const allotment = await this.extractAllotmentInfo(htmlContent);
        return {
          allotmentStatus: allotment.status,
          name: allotment.applicantName,
          data: allotment,
          appliedStock: allotment.appliedStock,
          allotedStock: allotment.allotedStock,
        };
      }
    } catch (error) {
      Logger.log(`Error occurred for PAN ${pancard}:`, error, error.stack);
    } finally {
      await browser.close();
    }
  }
  async extractAllotmentInfo(htmlContent): Promise<IpoDataValidationDto> {
    const $ = cheerio.load(htmlContent);
    const tableRows = $('#divgrid1 table tbody tr');
    const rowData = {};

    tableRows.each((index, row) => {
      const columns = $(row).find('td');
      columns.each((index, column) => {
        const columnName = $(column)
          .closest('table')
          .find('th')
          .eq(index)
          .text()
          .trim();
        rowData[columnName] = $(column).text().trim();
      });
    });
    let allotmentStatus;
    if (parseInt(rowData['ALLOTED_SHARES']) > 0) {
      allotmentStatus = IpoAllotmentStatus.ALLOTED;
    } else if (parseInt(rowData['ALLOTED_SHARES']) == 0) {
      allotmentStatus = IpoAllotmentStatus.NON_ALLOTTED;
    } else {
      allotmentStatus = IpoAllotmentStatus.NOT_APPLIED;
    }

    return {
      applicantName:
        allotmentStatus === IpoAllotmentStatus.NOT_APPLIED
          ? null
          : rowData['HOLD1'],
      allotedStock: rowData['ALLOTED_SHARES'],
      status: allotmentStatus,
      amountRefundedUnblocked: rowData['REFUND_AMOUNT'],
      refundMode: rowData['REFUND_MODE'],
      identityData: String(tableRows),
    };
  }

  async solveCaptcha(captchaScreenshotBuffer): Promise<string> {
    try {
      const captchaBase64 = captchaScreenshotBuffer.toString('base64');
      const dataURL = `data:image/png;base64,${captchaBase64}`;
      const response = await this.ipoAllotmentApi.post(SOLVE_CAPTCHA_API, {
        userid: SOLVE_CAPTCHA_USER_ID,
        apikey: SOLVE_CAPTCHA_API_KEY,
        data: dataURL,
      });
      Logger.log(
        '🚀 ~ KFinTechService ~ solveCaptcha ~ response:',
        response['result'],
      );
      return response['result'];
    } catch (error) {
      Logger.log(error);
    }
  }
}
