import { Injectable, Logger } from '@nestjs/common';
import { IPODetailsRepository } from '../repositories/ipo-details.repository';
import { IpoStatusType, IpoType } from '../../ipo-allotments/enum';
import { FetchIpoListRequestDto, IpoCalendarList } from '../dtos';
import { IpoCalendarStatus, IpoCalendarSubStatus } from 'src/frameworks/enums';
import * as moment from 'moment-timezone';
import { FetchIpoMapper } from '../mappers/fetch-ipo-list.mapper';
import { IpoAllotmentContactDto } from 'src/modules/ipo-allotments/dto';
import { IpoAllotmentService } from 'src/modules/ipo-allotments/services';
import { error } from 'console';
import { ERROR } from 'src/frameworks/error-code';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { FetchAllotmentStatusMapper } from '../mappers/fetch-allotment-status.mapper';

@Injectable()
export class IPOService {
  constructor(
    private ipoDetailsRepository: IPODetailsRepository,
    private fetchIpoListMapper: FetchIpoMapper,
    private ipoAllotmentService: IpoAllotmentService,
    private fetchAllotmentStatusMapper: FetchAllotmentStatusMapper,
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

  async getAllotmentByCompanyId(
    companyId: string,
    ipoAllotmentContactDto: IpoAllotmentContactDto,
  ) {
    const userAllotment =
      await this.ipoAllotmentService.allotmentByPanCardStatus(
        companyId,
        ipoAllotmentContactDto,
      );

    return await this.fetchAllotmentStatusMapper.mapOne(userAllotment);
  }

  async getAllotmentByPanNumber(
    companyId: string,
    ipoAllotmentContactDto: IpoAllotmentContactDto,
  ) {
    try {
      const userAllotment =
        await this.ipoDetailsRepository.findIpoAllotmentByPanCardAndCompanyId(
          companyId,
          ipoAllotmentContactDto.panNumber,
        );

      const contact = await this.ipoDetailsRepository.findContactByPanNumber(
        ipoAllotmentContactDto.panNumber,
      );

      if (!userAllotment) {
        const { allotment, company } = await this.checkAllotmentByPanNumber(
          companyId,
          ipoAllotmentContactDto.panNumber,
        );

        // if (!contact && allotment.userAllotment.name)
        // contact = await this.ipoDetailsRepository.upsertContact({
        //   panNumber: ipoAllotmentContactDto.panNumber,
        //   name: allotment.userAllotment.name
        //     ? allotment.userAllotment.name
        //     : null,
        //   legalName: allotment.userAllotment.name
        //     ? allotment.userAllotment.name
        //     : null,
        // });

        // const addAllotment = await this.ipoDetailsRepository.createAllotment({
        //   companyId: companyId,
        //   contactId: contact.id,
        //   pancard: ipoAllotmentContactDto.panNumber,
        //   companyName: company.companyName,
        //   data: allotment.userAllotment?.data,
        //   allotmentStatus: allotment.userAllotment.allotmentStatus,
        //   appliedStock: allotment.userAllotment?.appliedStock,
        //   allotedStock: allotment.userAllotment?.allotedStock,
        // });
        // Object.assign(addAllotment, contact);
      }
      userAllotment['contact'] = contact;
      return userAllotment;
    } catch (e) {
      Logger.error('ERROR: ', e);
      throw new BusinessRuleException(ERROR.INTERNAL_SERVER_ERROR);
    }
  }

  async checkAllotmentByPanNumber(id, panNumber: string) {
    const company = await this.ipoDetailsRepository.findOne(id);
    const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
      company.ipoRegistrar['register_name'],
    );

    const allotment = await this.ipoAllotmentService.handleRegistrar(
      {
        id: company.id,
        companyName: company.companyName,
        ipoRegistrar: company.ipoRegistrar,
        ipoAllotmentRequiredPayload: company.ipoAllotmentRequiredPayload,
      },
      {
        checkUserAllotmentStatus: true,
        panNumber: panNumber,
        registrar: registrar,
        checkCompanyStatus: company.ipoAllotmentRequiredPayload ? false : true,
      },
    );

    return {
      allotment,
      company,
    };
  }
}
