import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchAllotmentStatusMapper {
  async mapOne(allotment) {
    return {
      companyId: allotment.companyId,
      contact: allotment.contact,
      panNumber: allotment.pancard,
      companyName: allotment.companyName,
      // data: allotment.data,
      allotmentStatus: allotment.allotmentStatus,
      appliedStock: allotment.appliedStock,
      allotedStock: allotment.allotedStock,
    };
  }
}
