import { Injectable, Logger } from '@nestjs/common';
import { AllotmentBaseApiService } from 'src/connectors/allotment/allotment-base.api';
import * as puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import { IpoDetailsRepository } from '../repositories/ipo-details.respository';
import { compareNameWithIpo } from 'src/frameworks/function';

@Injectable()
export class BSESubscriptionScraperService {
  constructor(
    private ipoAllotmentApi: AllotmentBaseApiService,
    private ipoDetailsRepository: IpoDetailsRepository,
  ) {}

  async getListOfBSEOpenIpo() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();

      await page.goto('https://www.bseindia.com/publicissue.html');

      const htmlContent = await page.content();

      const $ = cheerio.load(htmlContent);

      const tableRows = $(
        '.container-fluid.marketstartarea .largetable tbody tr',
      );

      const ipoData = [];

      await tableRows.each((index, element) => {
        const ipo: { [key: string]: string } = {};
        const columns = $(element).find('td');
        const nameElement = $(columns[0]).find('a');
        ipo.name = nameElement.text().trim();
        ipo.link = nameElement.attr('href');

        ipo.startDate = $(columns[1]).text().trim();
        ipo.endDate = $(columns[2]).text().trim();
        ipo.offerPrice = $(columns[3]).text().trim();
        ipo.faceValue = $(columns[4]).text().trim();
        ipo.typeOfIssue = $(columns[5]).text().trim();
        ipo.issueStatus = $(columns[6]).text().trim();

        ipoData.push(ipo);
      });

      return ipoData;
    } catch (err) {
      Logger.log(err);
    } finally {
      await browser.close();
    }
  }

  async updateSubscriptionDetailsOfCurrentOpenIpo() {
    const ipoData = await this.getListOfBSEOpenIpo();
    const todayOpenIpo = await this.ipoDetailsRepository.findCurrentOpenIpo();
    const mappedList = await Promise.all(
      ipoData.map(async (ipo) => {
        const comparisonResult = await compareNameWithIpo(
          ipo['name'],
          todayOpenIpo,
        );
        if (comparisonResult) {
          const match = ipo.link.match(/IPONo=([0-9]+)/);
          const ipoNumber = match ? match[1] : null;

          if (ipoNumber) {
            const bse_ipo_subscription_url = `https://www.bseindia.com/markets/publicIssues/BSEDemandSchedule_new.aspx?Scripcode=${ipoNumber}`;
            await this.ipoDetailsRepository.updateSubscription(
              comparisonResult.id,
              {
                bseIpoSubscription: {
                  bseIpoSubscriptionUrl: bse_ipo_subscription_url,
                },
              },
            );
            return {
              id: comparisonResult.id,
              bseIpoSubscription: {
                bseIpoSubscriptionUrl: bse_ipo_subscription_url,
              },
            };
          } else {
            console.error('IPO number not found in the link.');
          }
          return ipo;
        }
      }),
    ).then((results) => results.filter((result) => result !== undefined));

    return mappedList;
  }
}
