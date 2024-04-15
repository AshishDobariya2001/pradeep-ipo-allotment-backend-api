/* eslint-disable max-lines-per-function */
import { Injectable, Logger } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import { IpoDetailsRepository } from '../repositories';
import { IpoDetailsDto } from '../dto';
import cheerio from 'cheerio';
import { Registrar } from 'src/frameworks/entities';
import * as puppeteer from 'puppeteer';
import { RegistrarList } from '../enum';
import {
  SOLVE_CAPTCHA_API,
  SOLVE_CAPTCHA_API_KEY,
  SOLVE_CAPTCHA_USER_ID,
} from 'src/frameworks/environment';

@Injectable()
export class KFinTechService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}

  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    try {
      const companyName = ipo.companyName.replace(' IPO', '');
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        RegistrarList.KfinTechnologiesLimited,
      );

      for (const url of registrar.serverUrl) {
        try {
          const response = await this.ipoAllotmentApi.get(
            registrar.serverUrl[0],
          );
          const html = response;
          const ipoList = this.parseIpoList(html);
          const foundIpo = ipoList.find((ipo) =>
            ipo.ipo_name.toLowerCase().includes(companyName.toLowerCase()),
          );

          if (foundIpo && !ipo.ipoAllotmentRequiredPayload) {
            await this.ipoDetailsRepository.update(ipo.id, {
              ipoAllotmentRequiredPayload: foundIpo,
            });
          }
          return foundIpo;
        } catch (error) {
          Logger.error('Error fetching data from', url, error);
        }
      }
    } catch (error) {
      throw new Error('Failed to fetch IPO data');
    }
  }
  private parseIpoList(html): { ipo_name: string; ipo_code: string }[] {
    const $ = cheerio.load(html);
    const options = $('#ddl_ipo option');
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
      console.log('🚀 ~ KFinTechService ~ url:', registrar.allotmentUrl[0]);

      await page.goto(registrar.allotmentUrl[0]);

      await page.select('select#ddl_ipo', ipoAllotmentRequiredPayload.ipo_code);
      await page.click('input[type="radio"][value="pan"]');
      await page.type('#txt_pan', pancard);

      const captchaImageHandle = await page.$('#captchaimg');
      const captchaScreenshotBuffer = await captchaImageHandle.screenshot({
        path: 'asset/captcha-1.png',
      });
      await page.screenshot({ path: 'allotment-kFin-url-0.png' });

      const result = await this.solveCaptcha(captchaScreenshotBuffer);
      await page.type('#txt_captcha', result);
      await page.screenshot({ path: 'allotment-kFin-url-1.png' });
      await page.click('#btn_submit_query');

      await page.waitForNavigation({
        waitUntil: 'networkidle2',
      });
      await page.screenshot({ path: 'allotment-kFin-url-2.png' });

      const htmlContent = await page.content();

      const extractedInfo = await this.extractAllotmentInfo(htmlContent);
      console.log('🚀 ~ KFinTechService ~ extractedInfo:', extractedInfo);
      return {
        allotmentStatus: extractedInfo.allotment_status,
        name: extractedInfo.name,
        data: extractedInfo,
        appliedStock: extractedInfo.applied,
        allotedStock: extractedInfo.alloted,
      };
    } catch (error) {
      Logger.log(`Error occurred for PAN ${pancard}:`, error);
    } finally {
      await page.screenshot({ path: 'allotment-kFin-url-final.png' });
      await browser.close();
    }
  }
  async extractAllotmentInfo(htmlContent) {
    const $ = cheerio.load(htmlContent);

    const applicationNumber = $('#grid_results_ctl02_l1').text().trim();
    const category = $('#grid_results_ctl02_Label1').text().trim();
    const name = $('#grid_results_ctl02_Label2').text().trim();
    const clientId = $('#grid_results_ctl02_lbl_dpclid').text().trim();
    const pan = $('#grid_results_ctl02_lbl_pan').text().trim();
    const applied = $('#grid_results_ctl02_Label5').text().trim();
    const alloted = $('#grid_results_ctl02_lbl_allot').text().trim();
    let allotmentStatus;
    const greenBadge = $('#grid_results_ctl02_bdg_allottee .badge.bg-green');
    const redBadge = $('#grid_results_ctl02_bdg_non_allottee .badge.bg-danger');

    if (greenBadge.length > 0) {
      allotmentStatus = 'Allotted';
    } else if (redBadge.length > 0) {
      allotmentStatus = 'Not Allotted';
    } else {
      allotmentStatus = 'Not Applied';
    }

    return {
      application_number: applicationNumber,
      category: category,
      name: name,
      client_id: clientId,
      pan: pan,
      applied: applied,
      alloted: alloted,
      allotment_status: allotmentStatus,
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
      return response['result'];
    } catch (error) {
      console.log(error);
    }
  }
}
