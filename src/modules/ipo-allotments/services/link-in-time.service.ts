/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-lines-per-function */
import { Injectable } from '@nestjs/common';
import { IpoDetailsRepository } from '../repositories';
import { RegistrarList } from '../enum';
import { IpoDataValidationDto, IpoDetailsDto } from '../dto';
import { Registrar } from 'src/frameworks/entities';
import axios from 'axios';
import * as https from 'https';
const CryptoJS = require('crypto-js');
import { parseString } from 'xml2js';
import { compareNameWithIpo } from 'src/frameworks/function';
import { IpoAllotmentStatus } from '../enum/ipo-allotment-status.enum';

@Injectable()
export class LinkInTimeService {
  constructor(private ipoDetailsRepository: IpoDetailsRepository) {}

  async getAllotmentStatus(ipo?: IpoDetailsDto) {
    const companyName = ipo.companyName;

    const registrar = await this.ipoDetailsRepository.findIpoRegistrarByName(
      RegistrarList.LinkInTimeIndiaPrivateLtd,
    );

    const axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    const response = await axiosInstance.post(registrar.serverUrl[1], {});

    let companyList;
    await parseString(response.data.d, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }

      companyList = result.NewDataSet.Table.map((table) => ({
        ipo_code: table.company_id[0],
        ipo_name: table.companyname[0],
      }));
    });

    const foundIpo = compareNameWithIpo(companyName, companyList);

    if (foundIpo && !ipo?.ipoAllotmentRequiredPayload) {
      await this.ipoDetailsRepository.update(ipo.id, {
        ipoAllotmentStatus: true,
        ipoAllotmentRequiredPayload: foundIpo,
      });
    }
    return foundIpo;
  }

  async getUserAllotmentStatus(
    registrar?: Registrar,
    pancard?: string,
    ipoAllotmentRequiredPayload?,
  ) {
    try {
      const axiosInstance = axios.create({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      const response = await axiosInstance.post(registrar.allotmentUrl[0], {});

      const sessionIdCookie = response.headers['set-cookie'].find((cookie) =>
        cookie.startsWith('ASP.NET_SessionId'),
      );
      const encryptedToken = await this.encryptToken(response.data.d);

      return this.searchOnPan(
        sessionIdCookie.split(';')[0],
        encryptedToken,
        registrar,
        pancard,
        ipoAllotmentRequiredPayload,
      );
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async encryptToken(vl) {
    const key = CryptoJS.enc.Utf8.parse('8080808080808080');
    const iv = CryptoJS.enc.Utf8.parse('8080808080808080');

    const encryptedVal = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(vl),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    return encryptedVal.toString();
  }
  async searchOnPan(
    sessionIdCookie: string,
    encryptedToken: string,
    registrar: Registrar,
    pancard: string,
    ipoAllotmentRequiredPayload,
  ) {
    try {
      const axiosInstance = axios.create({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Cookie: sessionIdCookie,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      const payload = {
        clientid: ipoAllotmentRequiredPayload.ipo_code,
        PAN: pancard,
        IFSC: '',
        CHKVAL: '1',
        token: encryptedToken,
      };

      const response = await axiosInstance.post(
        registrar.allotmentUrl[1],
        payload,
      );
      const data = await this.parseAllotmentData(response);
      return {
        allotmentStatus: data.status,
        name: data.applicantName,
        data: data,
        appliedStock: data.appliedStock,
        allotedStock: data.allotedStock,
      };
    } catch (error) {
      console.error('SearchOnPan Error:', error.message);
      throw error;
    }
  }

  async parseAllotmentData(response): Promise<IpoDataValidationDto> {
    let data: IpoDataValidationDto;
    await parseString(response.data.d, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }

      if (result.NewDataSet?.Table) {
        const responseData = result.NewDataSet?.Table[0];

        let status: IpoAllotmentStatus;

        if (parseInt(responseData['ALLOT'][0]) > 0) {
          status = IpoAllotmentStatus.ALLOTED;
        } else {
          status = IpoAllotmentStatus.NON_ALLOTTED;
        }

        data = {
          applicationNumber: responseData['speed'][0],
          dpNumber: responseData['DPCLITID'][0],
          applicantName: responseData['NAME1'][0],
          appliedStock: responseData['SHARES'][0],
          allotedStock: responseData['ALLOT'][0],
          offerPrice: responseData['offer_price'][0],
          databaseId: responseData['id'][0],
          rfnDNO: responseData['RFNDNO'][0],
          rfnDAMT: responseData['RFNDAMT'][0],
          companyName: responseData['companyname'][0],
          amtadj: responseData['AMTADJ'][0],
          category: responseData['PEMNDG'][0],
          invCode: responseData['INVCODE'][0],
          bnkCode: responseData['BNKCODE'][0],
          status: status,
        };
      } else {
        data = {
          status: IpoAllotmentStatus.NOT_APPLIED,
        };
      }
    });

    return data;
  }
}
