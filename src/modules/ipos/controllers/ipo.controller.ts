import { Controller, HttpCode, Get, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IpoCalendarList } from '../dtos';
import { IPOService } from '../services/ipo.service';
``;
@ApiTags('IPO APIs')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller({ version: '1', path: 'ipo' })
export class IPOController {
  constructor(private readonly ipoService: IPOService) {}

  @ApiOperation({ summary: 'Get IPO stats count by category' })
  @HttpCode(200)
  @Get('stats')
  async stats() {
    return this.ipoService.stats();
  }

  @ApiOperation({ summary: 'Get IPO stats count by category' })
  @HttpCode(200)
  @Get('calendar/list')
  async calendarIpoList(@Query() ipoCalendarList: IpoCalendarList) {
    return this.ipoService.calendarIpoList(ipoCalendarList);
  }
}
