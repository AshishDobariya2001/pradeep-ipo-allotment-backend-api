import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IpoDetails } from 'src/frameworks/entities/IpoDetails';
import { Timeline } from 'src/frameworks/entities/Timeline';
import { In, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { AllotmentStatus, Contacts, Registrar } from 'src/frameworks/entities';
import { GetIpoListDto, IpoDetailsDto } from '../dto';
import { IpoStatusType, IpoType } from '../enum';
import { IpoTodayALlotmentStatus } from '../enum/ipo-today-allotment.enum';

@Injectable()
export class IpoDetailsRepository {
  constructor(
    @InjectRepository(IpoDetails)
    private ipoDetailsRepository: Repository<IpoDetails>,
    @InjectRepository(Timeline)
    private ipoTimelineRepository: Repository<Timeline>,

    @InjectRepository(Registrar)
    private ipoRegistrarRepository: Repository<Registrar>,

    @InjectRepository(AllotmentStatus)
    private ipoAllotmentsRepository: Repository<AllotmentStatus>,
    @InjectRepository(Contacts)
    private contactRepository: Repository<Contacts>,
  ) {}

  async findRegistrarList() {
    return this.ipoRegistrarRepository.find({
      where: {
        isActive: true,
      },
      select: ['id', 'name', 'serverUrl'],
    });
  }
  async findIPOList(getIpoListDto: GetIpoListDto): Promise<IpoDetails[]> {
    let queryBuilder = await this.ipoDetailsRepository
      .createQueryBuilder('ipo')
      .select(['ipo', 'timeline'])
      .leftJoin(
        'ipo.timelines',
        'timeline',
        'timeline.ipo_details_id = ipo.id',
      );

    queryBuilder = await this.filterIpoListQuery(queryBuilder, getIpoListDto);

    if (getIpoListDto.type === IpoStatusType.Upcoming) {
      return queryBuilder
        .orderBy('ipo.ipoOpenDate', 'ASC')
        .addOrderBy('ipo.listingDate', 'ASC')
        .getMany();
    }
    return queryBuilder
      .orderBy('ipo.listingDate', 'DESC')
      .limit(getIpoListDto.limit)
      .offset(getIpoListDto.offset)
      .getMany();
  }

  async filterIpoListQuery(queryBuilder, getIpoListDto: GetIpoListDto) {
    const currentDate = new Date();

    if (getIpoListDto.type === IpoStatusType.Upcoming) {
      queryBuilder = queryBuilder.where(
        'ipo.ipoOpenDate IS NULL OR (ipo.ipoOpenDate IS NOT NULL AND :currentDate < ipo.listingDate )',
        { currentDate },
      );
    }

    if (getIpoListDto.type === IpoStatusType.Listed) {
      queryBuilder = queryBuilder
        .where('ipo.ipo_open_date IS NOT NULL')
        .andWhere('(ipo.listingDate <= :currentDate)', {
          currentDate,
        });
    }

    if (getIpoListDto.name) {
      queryBuilder = queryBuilder.andWhere('ipo.companyName ilike :name', {
        name: `%${getIpoListDto.name}%`,
      });
    }

    if (getIpoListDto.categoryType === IpoType.SME) {
      queryBuilder = queryBuilder.andWhere('ipo.listingAt ilike :listingAt', {
        listingAt: `%SME%`,
      });
    }

    if (getIpoListDto.categoryType === IpoType.MAINLINE) {
      queryBuilder = queryBuilder.andWhere(
        'ipo.listingAt NOT ilike :listingAt',
        {
          listingAt: `%SME%`,
        },
      );
    }

    if (getIpoListDto.todayAllotment === IpoTodayALlotmentStatus.YES) {
      queryBuilder.andWhere('timeline.basisOfAllotment = :currentDate', {
        currentDate,
      });
    }

    return queryBuilder;
  }

  async findIPOs(ipoType: IpoStatusType) {
    const currentDate = new Date();
    const futureIpoQuery = await this.ipoDetailsRepository
      .createQueryBuilder('ipo')
      .where(
        'ipo.ipoOpenDate IS NULL OR (ipo.ipoOpenDate IS NOT NULL AND ipo.listingDate > :currentDate)',
        { currentDate },
      )
      .orderBy('ipo.ipoOpenDate', 'ASC')
      .addOrderBy('ipo.listingDate', 'ASC');
    return futureIpoQuery.getMany();
  }
  async findIPOWithTodayBasisOfAllotment(): Promise<IpoDetailsDto[]> {
    const today = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    const previousDate = moment()
      .tz('Asia/Kolkata')
      .subtract(1, 'days')
      .format('YYYY-MM-DD');

    return this.ipoDetailsRepository
      .createQueryBuilder('ipo_details')
      .select([
        'ipo_details.id as "id"',
        'ipo_details.ipo_open_date as "ipoOpenDate"',
        'ipo_details.companyName as "companyName"',
        'ipo_details.ipoRegistrar as "ipoRegistrar"',
        'ipo_details.ipoAllotmentRequiredPayload as "ipoAllotmentRequiredPayload"',
        'timeline.basisOfAllotment as "basisOfAllotment"',
      ])
      .leftJoin('ipo_details.timelines', 'timeline')
      .where(
        'timeline.basisOfAllotment = :today OR timeline.basisOfAllotment = :previousDate',
        { today, previousDate },
      )
      .execute();
  }

  async findIpoRegistrarByName(registrarName: string): Promise<Registrar> {
    return this.ipoRegistrarRepository.findOne({
      where: {
        name: registrarName,
      },
    });
  }

  async update(id, payload: Partial<IpoDetails>) {
    return this.ipoDetailsRepository.update(id, payload);
  }

  async findOne(id: string) {
    return this.ipoDetailsRepository.findOne({
      where: {
        id: Number(id),
      },
    });
  }
  async findAllotmentStatusByCompanyIdAndContactId(
    companyId: string,
  ): Promise<AllotmentStatus> {
    return this.ipoAllotmentsRepository.findOne({
      where: {
        companyId: companyId,
      },
    });
  }
  async findContactById(id: number) {
    return this.contactRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  async findContactByPancard(panNumber: string) {
    return this.contactRepository.findOne({
      where: {
        panNumber: panNumber,
      },
    });
  }

  async findBulkContactByPanCards(panNumbers: string[]): Promise<Contacts[]> {
    return this.contactRepository.find({
      where: {
        panNumber: In(panNumbers),
      },
    });
  }
  async createContact(payload: Partial<Contacts>) {
    return this.contactRepository.save(payload);
  }

  async updateContact(id, payload: Partial<Contacts>) {
    return this.contactRepository.update(id, payload);
  }
  async findIpoAllotmentByPanCardAndCompanyId(
    companyId: string,
    panCard: string,
  ) {
    return this.ipoAllotmentsRepository.findOne({
      where: {
        companyId: companyId,
        pancard: panCard,
      },
    });
  }

  async createAllotment(payload: Partial<AllotmentStatus>) {
    return this.ipoAllotmentsRepository.save(payload);
  }
}
