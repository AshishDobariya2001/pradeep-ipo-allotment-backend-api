import { Injectable } from '@nestjs/common';
import { IpoDetails } from 'src/frameworks/entities';

@Injectable()
export class FetchIpoMapper {
  async mapAll(ipoList: IpoDetails[]) {
    return ipoList.map((ipoDetails) => {
      return {
        id: ipoDetails.id,
        companyName: ipoDetails?.companyName,
        listingDate: ipoDetails?.listingDate,
        ipoOpenDate: ipoDetails?.ipoOpenDate,
        logoUrl: ipoDetails?.logoUrl,
        ipoCloseDate: ipoDetails?.ipoCloseDate,
        ipoDate: ipoDetails?.ipoDate,
        faceValue: ipoDetails?.faceValue,
        priceBand: ipoDetails?.priceBand,
        lotSize: ipoDetails?.lotSize,
        freshIssue: ipoDetails?.freshIssue,
        listingAt: ipoDetails?.listingAt,
        about: ipoDetails?.about,
        rating: ipoDetails?.rating,
        leadManagerData: ipoDetails?.leadManagerData,
        ipoGmpData: ipoDetails?.ipoGmpData[0],
        ipoRegistrar: ipoDetails?.ipoRegistrar,
        ipoAllotmentStatus: ipoDetails?.ipoAllotmentStatus,
        ipoAllotmentRequiredPayload: ipoDetails?.ipoAllotmentRequiredPayload,
        timeline: ipoDetails?.timelines[0],
      };
    });
  }

  async mapOne(ipoDetails: IpoDetails) {
    return {
      company: {
        id: ipoDetails.id,
        name: ipoDetails.companyName,
        logoUrl: ipoDetails.logoUrl,
        startDate: ipoDetails.ipoOpenDate,
        endDate: ipoDetails.ipoCloseDate,
        listingDate: ipoDetails.listingDate,
        timeline: {
          date: ipoDetails?.ipoDate,
          ipoOpenDate: ipoDetails?.timelines[0]?.ipoOpenDate,
          ipoCloseDate: ipoDetails?.timelines[0]?.ipoCloseDate,
          basisOfAllotment: ipoDetails?.timelines[0]?.basisOfAllotment,
          initiationOfRefunds: ipoDetails?.timelines[0]?.initiationOfRefunds,
          creditOfSharesToDemat:
            ipoDetails?.timelines[0]?.creditOfSharesToDemat,
          cutOffTimeForUpiMandateConfirmation:
            ipoDetails?.timelines[0]?.cutOffTimeForUpiMandateConfirmation,
          listingDate: ipoDetails.timelines[0]?.listingDate,
        },
        priceBand: ipoDetails.priceBand,
        faceValue: ipoDetails.faceValue,
        offerForSale: ipoDetails.offerForSale,
        listingAt: ipoDetails.listingAt,
        lotSize: ipoDetails.lotSize,
        totalIssueSize: ipoDetails.totalIssueSize,
        freshIssue: ipoDetails.freshIssue,
        issueType: ipoDetails.issueType,
        preIssue: ipoDetails.preIssue,
        postIssue: ipoDetails.postIssue,
        marketMakerPortion: ipoDetails.marketMakerPortion,
        about: ipoDetails.about,
      },
      docsUrls: ipoDetails.docsUrl,
      ipoTradeInformation: ipoDetails.ipoTradeInformation,
      ipoListingProspectus: ipoDetails.ipoListingProspectus,
      ipoListingInformation: ipoDetails.ipoListingInformation,
      rating: ipoDetails.rating,
      leadManagerData: ipoDetails.leadManagerData,
      ipoRegistrar: ipoDetails.ipoRegistrar,
      subscription: {
        subscriptionStatusLive:
          ipoDetails.ipoSubscriptionData[0]?.subscriptionStatusLive || [],
        dayWiseSubscriptionDetails:
          ipoDetails.ipoSubscriptionData[0]?.dayWiseSubscriptionDetails || [],
        ipoSharesOffered:
          ipoDetails.ipoSubscriptionData[0]?.ipoSharesOffered || [],
      },
      ipoReservations: ipoDetails.ipoReservations,
      promoterHoldings: {
        pre_issue: ipoDetails.promoterHoldings[0]?.preIssue || null,
        post_issue: ipoDetails.promoterHoldings[0]?.postIssue || null,
      },
      ipoLotSizes: ipoDetails.ipoLotSizes,
      ipoKpis: ipoDetails.ipoKpis,
      ipoGmpData: ipoDetails.ipoGmpData[0] || [],
      stockPrices: ipoDetails.stockPrices,
    };
  }
}
