import { Injectable } from '@nestjs/common';
import { IpoDetails } from 'src/frameworks/entities';

@Injectable()
export class IpoListMapper {
  mapAll(ipoList: IpoDetails[]) {
    return ipoList.map((ipoDetails) => {
      return {
        id: ipoDetails.id,
        companyName: ipoDetails.companyName,
        listingDate: ipoDetails.listingDate,
        ipoOpenDate: ipoDetails.ipoOpenDate,
        logoUrl: ipoDetails.logoUrl,
        ipoCloseDate: ipoDetails.ipoCloseDate,
        ipoDate: ipoDetails.ipoDate,
        faceValue: ipoDetails.faceValue,
        priceBand: ipoDetails.priceBand,
        lotSize: ipoDetails.lotSize,
        freshIssue: ipoDetails.freshIssue,
        listingAt: ipoDetails.listingAt,
        about: ipoDetails.about,
        rating: ipoDetails.rating,
        leadManagerData: ipoDetails.leadManagerData,
        ipoGmpData: ipoDetails.ipoGmpData[0],
        ipoRegistrar: ipoDetails.ipoRegistrar,
        ipoAllotmentStatus: ipoDetails.ipoAllotmentStatus,
        ipoAllotmentRequiredPayload: ipoDetails.ipoAllotmentRequiredPayload,
        timeline: ipoDetails.timelines[0],
      };
    });
  }
}
