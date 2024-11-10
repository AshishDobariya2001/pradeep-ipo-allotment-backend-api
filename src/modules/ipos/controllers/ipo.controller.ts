import {
  Controller,
  HttpCode,
  Get,
  Query,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FetchIpoListRequestDto, IpoCalendarList } from '../dtos';
import { IPOService } from '../services/ipo.service';
import { JwtAuthGuard } from 'src/frameworks/apis/guards/jwt-auth.guard';
``;
@ApiTags('IPO APIs')
@Controller({ version: '1', path: 'ipo' })
export class IPOController {
  constructor(private readonly ipoService: IPOService) {}

  @ApiOperation({ summary: 'Get IPO stats count by category' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async stats() {
    return this.ipoService.stats();
  }

  @ApiOperation({ summary: 'Fetch list of IPOs based on provided criteria' })
  @HttpCode(HttpStatus.OK)
  // @UseGuards(JwtAuthGuard)
  @Get()
  async fetchIpoList(@Query() body: FetchIpoListRequestDto) {
    return this.ipoService.fetchIpoList(body);
  }

  @ApiOperation({ summary: 'Get IPO details by ID' })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.ipoService.getById(id);
  }

  @ApiOperation({ summary: 'Get IPO calendar list' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('calendar/list')
  async calendarIpoList(@Query() ipoCalendarList: IpoCalendarList) {
    return this.ipoService.calendarIpoList(ipoCalendarList);
  }
}
