/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines-per-function */
import { BadRequestException, Injectable } from '@nestjs/common';
import { IpoDetailsRepository } from '../repositories/ipo-details.repository';
import { IpoStatusType, RegistrarList } from '../enum';
import { BigShareService } from '.';
import {
  AddPanCardDto,
  GetContactDto,
  GetIpoAllotmentStatusDto,
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
import { LinkInTimeService } from './link-in-time.service';
import { IntegratedSecuritiesService } from './integrated-security.service';
import { CameoIndiaService } from './cemeo-india.service';
import { MassSecuritiesService } from './mass.service';
import { PurvaShareService } from './purva-share.service';

@Injectable()
export class IpoAllotmentService {
  constructor(
    private skyLineService: SkyLineFinancialService,
    private bigShareService: BigShareService,
    private kFinTechService: KFinTechService,
    private ipoDetailsRepository: IpoDetailsRepository,
    private contactMapper: ContactMapper,
    private ipoListMapper: IpoListMapper,
    private maashitlaService: MaashitlaSecuritiesService,
    private linkInTimeService: LinkInTimeService,
    private integratedSecuritiesService: IntegratedSecuritiesService,
    private cameoIndiaService: CameoIndiaService,
    private massSecuritiesService: MassSecuritiesService,
    private purvaShareService: PurvaShareService,
  ) {}

  async findIpoAllotmentStatusByRegistrarCompanyName(
    getAllotmentStatusDto: GetIpoAllotmentStatusDto,
  ) {
    let company;
    if (getAllotmentStatusDto.id) {
      company = await this.ipoDetailsRepository.findOne(
        getAllotmentStatusDto.id,
      );
    } else {
      company = await this.ipoDetailsRepository.findByCompanyName(
        getAllotmentStatusDto.originalCompanyName,
      );
    }

    const allotmentStatus = await this.handleRegistrar(
      {
        id: company.id,
        companyName: getAllotmentStatusDto.companyName,
        ipoRegistrar: company.ipoRegistrar,
        ipoAllotmentRequiredPayload: company.ipoAllotmentRequiredPayload,
      },
      {
        checkCompanyStatus: true,
      },
    );
    if (allotmentStatus) {
      await this.ipoDetailsRepository.update(company.id, {
        ipoAllotmentRequiredPayload: allotmentStatus.companyAllotment,
      });
    }
    return {
      companyAllotment: allotmentStatus.companyAllotment,
    };
  }

  async getRegistrar(): Promise<Registrar[]> {
    return this.ipoDetailsRepository.findRegistrarList();
  }

  async getIpoList(getIpoListDto: GetIpoListDto) {
    const ipoList = await this.ipoDetailsRepository.findIPOList(getIpoListDto);
    const ipos = this.ipoListMapper.mapAll(ipoList.ipos);
    ipos[0]['totalCount'] = ipoList.totalCount;
    return ipos;
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
  }

  // async findTodayListingIpoStock() {
  //   const todayAwaitAllotmentsStock =
  //     await this.ipoDetailsRepository.findIPOWithTodayBasisOfAllotment();

  //   for (const todayOpenAllotmentIpo of todayAwaitAllotmentsStock) {
  //     await this.handleRegistrar(todayOpenAllotmentIpo, {
  //       checkCompanyStatus: true,
  //     });
  //   }
  // }

  async findAllotmentOfStockIsOutOrNot(ipoId: string) {
    try {
      const company = await this.ipoDetailsRepository.findOne(ipoId);
      if (!company) {
        throw new Error('Company not found');
      }

      let allotment = company.ipoAllotmentRequiredPayload;
      if (!allotment) {
        allotment = await this.handleRegistrar(
          {
            id: company.id,
            companyName: company.companyName,
            ipoRegistrar: company.ipoRegistrar,
          },
          {
            checkCompanyStatus: true,
          },
        );
        if (allotment['companyAllotment'])
          await this.ipoDetailsRepository.update(company.id, {
            ipoAllotmentRequiredPayload: allotment['companyAllotment'],
          });
        allotment = allotment['companyAllotment'];
      }

      return {
        success: true,
        status: Boolean(allotment),
        allotment: allotment,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async handleRegistrar(ipo: IpoDetailsDto, payload?: IPOHandleRegistrarDto) {
    switch (ipo.ipoRegistrar['register_name']) {
      case RegistrarList.BigShareServicesPvtLtd:
        return this.bigShareIpoAllotment(ipo, payload);
      case RegistrarList.LinkInTimeIndiaPrivateLtd:
        return this.linkInTimeIpoAllotment(ipo, payload);
      case RegistrarList.MaashitlaSecuritiesPrivateLimited:
        return this.maashitlaAllotment(ipo, payload);
      case RegistrarList.KfinTechnologiesLimited:
        return this.kFinIpoAllotment(ipo, payload);
      case RegistrarList.SkylineFinancialServicesPrivateLtd:
        return this.skyLineAllotment(ipo, payload);
      case RegistrarList.IntegratedRegistryManagementServicesPrivateLimited:
        return this.integratedSecuritiesIpoAllotment(ipo, payload);
      case RegistrarList.CameoCorporateServicesLimited:
        return this.cameoCorporateIpoAllotment(ipo, payload);
      case RegistrarList.MasServicesLimited:
        return this.massSecuritiesIpoAllotment(ipo, payload);
      case RegistrarList.PurvaSharegistryIndiaPvtLtd:
        return this.purvaShareIpoAllotment(ipo, payload);
      default:
        throw new BadRequestException(ERROR.WE_DID_NOT_HAVE_THIS_REGISTRAR);
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
    let contact = await this.ipoDetailsRepository.findContactByPancard(
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

      if (!contact) {
        contact = await this.ipoDetailsRepository.createContact({
          panNumber: ipoAllotmentContactDto.panNumber,
          name: allotment.userAllotment.name
            ? allotment.userAllotment.name
            : null,
          legalName: allotment.userAllotment.name
            ? allotment.userAllotment.name
            : null,
        });
      } else if (
        (!contact.name || !contact.legalName) &&
        allotment.userAllotment?.name
      ) {
        await this.ipoDetailsRepository.updateContact(contact.id, {
          name: allotment.userAllotment?.name,
          legalName: allotment.userAllotment?.name,
        });
        contact.legalName = allotment.userAllotment?.name;
        contact.name = allotment.userAllotment.name;
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
        appliedStock: allotment.userAllotment?.appliedStock,
        allotedStock: allotment.userAllotment?.allotedStock,
      });
      userAllotment['contact'] = contact;
      return userAllotment;
    }
    userAllotment['contact'] = contact;
    return userAllotment;
  }

  async purvaShareIpoAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.purvaShareService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.purvaShareService.getUserAllotmentStatus(
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

  async massSecuritiesIpoAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment =
        await this.massSecuritiesService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.massSecuritiesService.getUserAllotmentStatus(
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
  async cameoCorporateIpoAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.cameoIndiaService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.cameoIndiaService.getUserAllotmentStatus(
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
  async integratedSecuritiesIpoAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment =
        await this.integratedSecuritiesService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment =
        await this.integratedSecuritiesService.getUserAllotmentStatus(
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
  async linkInTimeIpoAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.linkInTimeService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.linkInTimeService.getUserAllotmentStatus(
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

  async maashitlaAllotment(
    ipo: IpoDetailsDto,
    payload?: IPOHandleRegistrarDto,
  ) {
    let companyAllotment;
    let userAllotment;
    if (payload.checkCompanyStatus) {
      companyAllotment = await this.maashitlaService.getAllotmentStatus(ipo);
    }
    if (payload.checkUserAllotmentStatus) {
      userAllotment = await this.maashitlaService.getUserAllotmentStatus(
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
}
