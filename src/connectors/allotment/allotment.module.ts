import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AllotmentBaseApiService } from './allotment-base.api';

@Module({
  imports: [HttpModule],
  providers: [AllotmentBaseApiService],
  exports: [AllotmentBaseApiService],
})
export class AllotmentAPIsModule {}
