/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable } from '@nestjs/common';
import { IpoDetailsRepository } from '../repositories/ipo-details.repository';
import { IpoType, RegistrarList } from '../enum';
import { BigShareService } from '.';
import {
  AddPanCardDto,
  GetContactDto,
  GetIpoListDto,
  IPOHandleRegistrarDto,
  IpoAllotmentContactDto,
  IpoDetailsDto,
} from '../dto';
import { KFinTechService } from './kfin.service';
import { SkyLineFinancialService } from './skyline-finacial.service';
import { ContactMapper, IpoListMapper } from '../mappers';
import { GetContactResponseDto } from '../models';
import { ERROR } from '../../../frameworks/error-code';
import { Registrar } from 'src/frameworks/entities';
import { BusinessRuleException } from 'src/frameworks/exceptions';
import { MaashitlaSecuritiesService } from './maashitla-security.service';

@Injectable()
export class IpoAllotmentService {
  constructor(
    private skyLineService: SkyLineFinancialService,
    private bigShareService: BigShareService,
    private kFinTechService: KFinTechService,
    private ipoDetailsRepository: IpoDetailsRepository,
    private contactMapper: ContactMapper,
    private ipoListMapper: IpoListMapper,
    private mService: MaashitlaSecuritiesService,
  ) {}

  async getRegistrar(): Promise<Registrar[]> {
    return this.ipoDetailsRepository.findRegistrarList();
  }

  async getIpoList(getIpoListDto: GetIpoListDto) {
    if (getIpoListDto.type === IpoType.Upcoming) {
      const ipos = await this.ipoDetailsRepository.findUpcomingIPOs();
      return this.ipoListMapper.mapAll(ipos);
    } else if (getIpoListDto.type === IpoType.Listed) {
      const ipos = await this.ipoDetailsRepository.findListedIPOs(
        getIpoListDto.limit,
        getIpoListDto.offset,
      );
      return this.ipoListMapper.mapAll(ipos);
    }
  }
  async addPancard(
    addPanCardDto: AddPanCardDto,
  ): Promise<GetContactResponseDto> {
    const contact = await this.ipoDetailsRepository.findContactByPancard(
      addPanCardDto.panNumber,
    );
    if (contact) {
      return this.contactMapper.mapOne(contact);
    }
    const newContact = await this.ipoDetailsRepository.createContact({
      panNumber: addPanCardDto.panNumber,
    });
    return this.contactMapper.mapOne(newContact);
  }

  async getContactByPancard(getContactDto?: GetContactDto) {
    if (getContactDto.panNumbers.length < 0) {
      throw new BadRequestException(ERROR.INVALID_PAN_NUMBER);
    }
    const contacts = await this.ipoDetailsRepository.findBulkContactByPanCards(
      getContactDto.panNumbers,
    );
    return this.contactMapper.mapAll(contacts);

    return {
      contacts: contacts,
    };
  }

  async findTodayListingIpoStock() {
    const todayAwaitAllotmentsStock =
      await this.ipoDetailsRepository.findIPOWithTodayBasisOfAllotment();

    for (const todayOpenAllotmentIpo of todayAwaitAllotmentsStock) {
      await this.handleRegistrar(todayOpenAllotmentIpo, {
        checkCompanyStatus: true,
      });
    }
  }

  async handleRegistrar(ipo: IpoDetailsDto, payload?: IPOHandleRegistrarDto) {
    switch (ipo.ipoRegistrar['register_name']) {
      case RegistrarList.BigShareServicesPvtLtd:
        return this.bigShareIpoAllotment(ipo, payload);

      case RegistrarList.LinkInTimeIndiaPrivateLtd:
        // return
        break;
      case RegistrarList.MaashitlaSecuritiesPrivateLimited:
      // return this.maashitlaAllotment(ipo, payload);
      case RegistrarList.KfinTechnologiesLimited:
        return this.kFinIpoAllotment(ipo, payload);

      case RegistrarList.SkylineFinancialServicesPrivateLtd:
        return this.skyLineAllotment(ipo, payload);
      default:
        // Default logic if needed
        break;
    }
  }

  async allotmentByPanCardStatus(
    id: string,
    ipoAllotmentContactDto: IpoAllotmentContactDto,
  ) {
    const userAllotment =
      await this.ipoDetailsRepository.findIpoAllotmentByPanCardAndCompanyId(
        id,
        ipoAllotmentContactDto.panNumber,
      );

    if (!userAllotment) {
      const company = await this.ipoDetailsRepository.findOne(id);
      const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
        company.ipoRegistrar['register_name'],
      );

      const allotment = await this.handleRegistrar(
        {
          id: company.id,
          companyName: company.companyName,
          ipoRegistrar: company.ipoRegistrar,
          ipoAllotmentRequiredPayload: company.ipoAllotmentRequiredPayload,
        },
        {
          checkUserAllotmentStatus: true,
          panNumber: ipoAllotmentContactDto.panNumber,
          registrar: registrar,
          checkCompanyStatus: company.ipoAllotmentRequiredPayload
            ? false
            : true,
        },
      );
      console.log('🚀 ~ IpoAllotmentService ~ allotment:', allotment);

      let contact = await this.ipoDetailsRepository.findContactByPancard(
        ipoAllotmentContactDto.panNumber,
      );
      if (!contact) {
        contact = await this.ipoDetailsRepository.createContact({
          panNumber: ipoAllotmentContactDto.panNumber,
          name: allotment.userAllotment?.name,
          legalName: allotment.userAllotment?.name,
        });
      } else if (!contact.name || !contact.legalName) {
        await this.ipoDetailsRepository.updateContact(contact.id, {
          name: allotment.userAllotment?.name,
          legalName: allotment.userAllotment?.name,
        });
      }
      if (!allotment) {
        throw new BusinessRuleException(ERROR.IPO_ALLOTMENT_IS_NOT_AVAILABLE);
      }
      const userAllotment = await this.ipoDetailsRepository.createAllotment({
        companyId: id,
        contactId: contact.id,
        pancard: ipoAllotmentContactDto.panNumber,
        companyName: company.companyName,
        data: allotment.userAllotment?.data,
        allotmentStatus: allotment.userAllotment.allotmentStatus,
        appliedStock: allotment.userAllotment.appliedStock,
      });

      return userAllotment;
    }
    return userAllotment;
  }

  async bigShareIpoAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.bigShareService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.bigShareService.getUserAllotmentStatus(
        payload.registrar,
        payload.panNumber,
        ipo.ipoAllotmentRequiredPayload
          ? ipo.ipoAllotmentRequiredPayload
          : companyAllotment,
      );
    }
    return {
      companyAllotment: companyAllotment,
      userAllotment: userAllotment,
    };
  }

  async kFinIpoAllotment(ipo: IpoDetailsDto, payload?: IPOHandleRegistrarDto) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.kFinTechService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.kFinTechService.getUserAllotmentStatus(
        payload.registrar,
        payload.panNumber,
        ipo.ipoAllotmentRequiredPayload
          ? ipo.ipoAllotmentRequiredPayload
          : companyAllotment,
      );
    }
    return {
      companyAllotment: companyAllotment,
      userAllotment: userAllotment,
    };
  }

  async skyLineAllotment(ipo: IpoDetailsDto, payload?: IPOHandleRegistrarDto) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.skyLineService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.skyLineService.getUserAllotmentStatus(
        payload.registrar,
        payload.panNumber,
        ipo.ipoAllotmentRequiredPayload
          ? ipo.ipoAllotmentRequiredPayload
          : companyAllotment,
      );
    }
    return {
      companyAllotment: companyAllotment,
      userAllotment: userAllotment,
    };
  }

  // async maashitlaAllotment(
  //   ipo: IpoDetailsDto,
  //   payload?: IPOHandleRegistrarDto,
  // ) {
  //   let companyAllotment;
  //   let userAllotment;
  //   if (payload.checkCompanyStatus) {
  //     companyAllotment = await this.maashitlaService.getAllotmentStatus(ipo);
  //   }
  //   if (payload.checkUserAllotmentStatus) {
  //     userAllotment = await this.maashitlaService.getUserAllotmentStatus(
  //       payload.registrar,
  //       payload.panNumber,
  //       ipo.ipoAllotmentRequiredPayload
  //         ? ipo.ipoAllotmentRequiredPayload
  //         : companyAllotment,
  //     );
  //   }
  //   return {
  //     companyAllotment: companyAllotment,
  //     userAllotment: userAllotment,
  //   };
  // }
}
