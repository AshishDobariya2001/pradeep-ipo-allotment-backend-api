import { Injectable } from '@nestjs/common';
import { IPODetailsRepository } from '../repositories/ipo-details.repository';
import { IpoStatusType, IpoType } from '../../ipo-allotments/enum';
import { FetchIpoListRequestDto, IpoCalendarList } from '../dtos';
import { IpoCalendarStatus, IpoCalendarSubStatus } from 'src/frameworks/enums';
import * as moment from 'moment-timezone';
import { FetchIpoMapper } from '../mappers/fetch-ipo-list.mapper';

@Injectable()
export class IPOService {
  constructor(
    private ipoDetailsRepository: IPODetailsRepository,
    private fetchIpoListMapper: FetchIpoMapper,
  ) {}

  async stats() {
    const mainlineUpcomingCount = await this.ipoDetailsRepository.findStats({
      type: IpoStatusType.Upcoming,
      categoryType: IpoType.MAINLINE,
    });

    const smeUpcomingCount = await this.ipoDetailsRepository.findStats({
      type: IpoStatusType.Upcoming,
      categoryType: IpoType.SME,
    });

    const mainlineLiveIpoCount = await this.ipoDetailsRepository.findStats({
      type: IpoStatusType.Live,
      categoryType: IpoType.MAINLINE,
    });

    const smeLiveIpoCount = await this.ipoDetailsRepository.findStats({
      type: IpoStatusType.Live,
      categoryType: IpoType.SME,
    });

    return {
      mainline: {
        live: mainlineLiveIpoCount,
        upcoming: mainlineUpcomingCount,
      },
      sme: {
        live: smeLiveIpoCount,
        upcoming: smeUpcomingCount,
      },
    };
  }

  async calendarIpoList(ipoCalendarList: IpoCalendarList) {
    const ipos =
      await this.ipoDetailsRepository.findIpoListForCalendar(ipoCalendarList);

    const events = await this.generateEvents(ipos);
    return events;
  }

  async generateEvents(ipos) {
    const events = [];

    ipos.forEach((ipo) => {
      const {
        id,
        companyName,
        listingAt,
        timeline: {
          ipoOpenDate,
          ipoCloseDate,
          basisOfAllotment,
          initiationOfRefunds,
          creditOfSharesToDemat,
          listingDate,
        },
      } = ipo;

      const is_listed_ipo = moment(listingDate).isBefore(moment(), 'day');
      const ipo_type = listingAt.includes('NSE SME') ? 'SME' : 'MAINLINE';
      events.push({
        id: id,
        Date: ipoOpenDate,
        Type: IpoCalendarStatus.Open,
        subType: IpoCalendarSubStatus.IpoOpen,
        name: companyName,
        listed: is_listed_ipo,
        type: ipo_type,
      });

      events.push({
        id: id,
        Date: ipoCloseDate,
        Type: IpoCalendarStatus.Close,
        subType: IpoCalendarSubStatus.IpoClose,
        name: companyName,
        listed: is_listed_ipo,
        type: ipo_type,
      });

      events.push({
        id: id,
        Date: basisOfAllotment,
        Type: IpoCalendarStatus.Allotment,
        subType: IpoCalendarSubStatus.Allotment,
        name: companyName,
        listed: is_listed_ipo,
        type: ipo_type,
      });

      events.push({
        id: id,
        Date: initiationOfRefunds,
        Type: IpoCalendarStatus.Refunds,
        subType: IpoCalendarSubStatus.Refunds,
        name: companyName,
        listed: is_listed_ipo,
        type: ipo_type,
      });

      events.push({
        id: id,
        Date: creditOfSharesToDemat,
        Type: IpoCalendarStatus.CreditOfSharesToDemat,
        subType: IpoCalendarSubStatus.CreditOfSharesToDemat,
        name: companyName,
        listed: is_listed_ipo,
        type: ipo_type,
      });

      events.push({
        id: id,
        Date: listingDate,
        Type: IpoCalendarStatus.Listing,
        subType: IpoCalendarSubStatus.Listing,
        name: companyName,
        listed: is_listed_ipo,
        type: ipo_type,
      });
    });

    return events;
  }

  async fetchIpoList(body: FetchIpoListRequestDto) {
    const ipoList = await this.ipoDetailsRepository.fetchIpoList(body);
    const ipos = await this.fetchIpoListMapper.mapAll(ipoList?.ipos);

    return {
      ipos,
      totalCount: ipoList?.totalCount,
    };
  }

  async getById(id: number) {
    const ipo = await this.ipoDetailsRepository.findById(id);
    const mappedIpo = await this.fetchIpoListMapper.mapOne(ipo);
    return mappedIpo;
  }
}
