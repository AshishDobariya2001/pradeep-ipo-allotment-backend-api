import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpoDetails, Users } from 'src/frameworks/entities';
// import { GetIpoListDto } from 'src/modules/ipo-allotments/dto';
import {
  IpoCategoryType,
  IpoStatusType,
  IpoType,
} from 'src/modules/ipo-allotments/enum';
import { IpoTodayALlotmentStatus } from 'src/modules/ipo-allotments/enum/ipo-today-allotment.enum';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FetchIpoListRequestDto, IpoCalendarList } from '../dtos';

@Injectable()
export class IPODetailsRepository {
  constructor(
    @InjectRepository(IpoDetails)
    private ipoDetailsRepository: Repository<IpoDetails>,
  ) {}

  async save(payload: Partial<Users>) {
    return this.ipoDetailsRepository.save(payload);
  }

  async findOne(id: number) {
    return this.ipoDetailsRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findStats(getIpoListDto: FetchIpoListRequestDto) {
    let queryBuilder = await this.ipoDetailsRepository
      .createQueryBuilder('ipo')
      .select(['ipo', 'timeline'])
      .leftJoin(
        'ipo.timelines',
        'timeline',
        'timeline.ipo_details_id = ipo.id',
      );

    queryBuilder = await this.filterIpoListQuery(queryBuilder, getIpoListDto);

    return queryBuilder.getCount();
  }

  async fetchIpoList(
    fetchIpoListRequestDto: FetchIpoListRequestDto,
  ): Promise<{ totalCount: number; ipos: IpoDetails[] }> {
    let queryBuilder = await this.ipoDetailsRepository
      .createQueryBuilder('ipo')
      .select(['ipo', 'timeline'])
      .leftJoin(
        'ipo.timelines',
        'timeline',
        'timeline.ipo_details_id = ipo.id',
      );

    queryBuilder = await this.filterIpoListQuery(
      queryBuilder,
      fetchIpoListRequestDto,
    );
    const count = await queryBuilder.getCount();

    if (
      fetchIpoListRequestDto.type === IpoStatusType.Upcoming ||
      fetchIpoListRequestDto.type === IpoStatusType.LiveAndUpcoming
    ) {
      const ipos = await queryBuilder
        .orderBy('ipo.ipoOpenDate', 'ASC')
        .addOrderBy('ipo.listingDate', 'ASC')
        .getMany();
      return {
        totalCount: count,
        ipos: ipos,
      };
    }

    console.log(fetchIpoListRequestDto.limit, fetchIpoListRequestDto.offset);
    const ipos = await queryBuilder
      .orderBy('ipo.listingDate', 'DESC')
      .limit(fetchIpoListRequestDto.limit)
      .offset(fetchIpoListRequestDto.offset)
      .getMany();

    return {
      totalCount: count,
      ipos: ipos,
    };
  }

  async filterIpoListQuery(queryBuilder, queryFilter: FetchIpoListRequestDto) {
    const currentDate = new Date();

    if (queryFilter.type === IpoStatusType.Upcoming) {
      queryBuilder = queryBuilder.where(
        'ipo.ipoOpenDate IS NULL OR (ipo.ipoOpenDate IS NOT NULL AND :currentDate < ipo.ipoOpenDate)',
        { currentDate },
      );
    }

    if (queryFilter.type === IpoStatusType.Listed) {
      queryBuilder = queryBuilder
        .where('ipo.ipo_open_date IS NOT NULL')
        .andWhere('(ipo.listingDate <= :currentDate)', {
          currentDate,
        });
    }

    if (queryFilter.type === IpoStatusType.Live) {
      queryBuilder = queryBuilder.where(
        ':currentDate >= ipo.ipoOpenDate AND :currentDate <= ipo.ipoCloseDate',
        {
          currentDate,
        },
      );
    }

    if (queryFilter.type === IpoStatusType.LiveAndUpcoming) {
      queryBuilder = queryBuilder.where(
        'ipo.ipoOpenDate IS NULL OR (ipo.ipoOpenDate IS NOT NULL AND :currentDate < ipo.listingDate )',
        { currentDate },
      );
    }

    if (queryFilter.name) {
      queryBuilder = queryBuilder.andWhere('ipo.companyName ilike :name', {
        name: `%${queryFilter.name}%`,
      });
    }

    if (queryFilter.categoryType === IpoType.SME) {
      queryBuilder = queryBuilder.andWhere('ipo.listingAt ilike :listingAt', {
        listingAt: `%SME%`,
      });
    }

    if (queryFilter.categoryType === IpoType.MAINLINE) {
      queryBuilder = queryBuilder.andWhere(
        'ipo.listingAt NOT ilike :listingAt',
        {
          listingAt: `%SME%`,
        },
      );
    }

    if (queryFilter.todayAllotment === IpoTodayALlotmentStatus.YES) {
      queryBuilder.andWhere('timeline.basisOfAllotment = :currentDate', {
        currentDate,
      });
    }

    return queryBuilder;
  }

  async findIpoListWithEqualJoin(ipoCalendarList: IpoCalendarList) {
    const queryBuilder = await this.ipoDetailsRepository
      .createQueryBuilder('ipo')
      .select(['*'])
      .innerJoin(
        'ipo.timelines',
        'timeline',
        'timeline.ipo_details_id = ipo.id',
      )
      .where(
        `(ipo.ipoOpenDate >= :startDate AND ipo.listingDate <= :endDate) AND
          (ipo.ipoOpenDate >= :startDate AND ipo.ipoCloseDate <= :endDate) 
        `,
        {
          startDate: ipoCalendarList.ipoStartDate,
          endDate: ipoCalendarList.ipoEndDate,
        },
      );

    const result = await queryBuilder
      .orderBy('ipo.ipoOpenDate', 'ASC')
      .execute();
  }

  async findIpoListForCalendar(ipoCalendarList: IpoCalendarList) {
    const queryBuilder = await this.ipoDetailsRepository
      .createQueryBuilder('ipo')
      .select([
        `
        ipo.id as "id",
        ipo.company_name as "companyName",
        ipo.ipoOpenDate as "ipoOpenDate",
        ipo.ipoCloseDate as "ipoCloseDate",
        ipo.listingDate as "listingDate",
        ipo.listingAt as "listingAt",
        json_build_object(
          'id', timeline.id,
          'ipoOpenDate', timeline.ipo_open_date,
          'ipoCloseDate',  timeline.ipo_close_date,
          'basisOfAllotment', timeline.basis_of_allotment,
          'initiationOfRefunds', timeline.initiation_of_refunds,
          'creditOfSharesToDemat', timeline.credit_of_shares_to_demat,
          'listingDate', timeline.listing_date,
          'cutOffTimeForUpiMandateConfirmation', timeline.cut_off_time_for_upi_mandate_confirmation,
          'ipo_details_id', timeline.ipo_details_id
        ) as timeline
        `,
      ])
      .leftJoin('ipo.timelines', 'timeline', 'timeline.ipo_details_id = ipo.id')
      .where(
        `(ipo.ipoOpenDate >= :startDate AND ipo.ipoOpenDate <= :endDate) 
        `,
        {
          startDate: ipoCalendarList.ipoStartDate,
          endDate: ipoCalendarList.ipoEndDate,
        },
      );

    await this.filterDateByStatus(queryBuilder, ipoCalendarList);

    return queryBuilder.orderBy('ipo.ipoOpenDate', 'ASC').execute();
  }

  async filterDateByStatus(queryBuilder, ipoCalendarList: IpoCalendarList) {
    if (ipoCalendarList.type === IpoCategoryType.Live) {
      {
        // queryBuilder = queryBuilder.andWhere(
        //   ':currentDate >= ipo.ipoOpenDate AND :currentDate <= ipo.ipoCloseDate',
        //   {
        //     currentDate: new Date(),
        //   },
        // );

        queryBuilder = queryBuilder.where(
          '(ipo.ipoOpenDate <= :currentDate  AND :currentDate <= ipo.ipoCloseDate )',
          { currentDate: new Date() },
        );
      }
    }

    if (ipoCalendarList.type === IpoCategoryType.Upcoming) {
      queryBuilder = queryBuilder.where(
        'ipo.ipoOpenDate IS NULL OR (ipo.ipoOpenDate IS NOT NULL AND :currentDate < ipo.listingDate )',
        { currentDate: new Date() },
      );
    }

    if (ipoCalendarList.type === IpoCategoryType.Listed) {
      queryBuilder.andWhere('ipo.listingDate BETWEEN :startDate AND :endDate', {
        startDate: ipoCalendarList.ipoStartDate,
        endDate: ipoCalendarList.ipoEndDate,
      });
    }
  }

  async findById(id: number) {
    return this.ipoDetailsRepository.findOne({
      where: { id },
      relations: [
        'promoterHoldings',
        'timelines',
        'ipoLotSizes',
        'ipoKpis',
        'ipoReservations',
        'ipoSubscriptionData',
        'stockPrices',
      ],
    });
  }
}
