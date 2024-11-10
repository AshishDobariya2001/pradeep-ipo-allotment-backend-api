import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BSESubscriptionScraperService } from '../services/bse-subscription.service';

@ApiTags('scraper apis')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller({ path: 'scraper', version: '1' })
export class ScraperController {
  constructor(
    private readonly bSESubscriptionScraperService: BSESubscriptionScraperService,
  ) {}

  // @ApiOperation({ summary: 'scraper bse subscription url' })
  // @HttpCode(200)
  // @Post('bse/subscription')
  // async updateSubscriptionDetailsOfCurrentOpenIpo() {
  //   return this.bSESubscriptionScraperService.updateSubscriptionDetailsOfCurrentOpenIpo();
  // }
}
