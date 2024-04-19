import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IpoAllotmentService } from '../services';
import {
  AddPanCardDto,
  GetContactDto,
  GetIpoListDto,
  IpoAllotmentContactDto,
} from '../dto';
import { AllotmentStatus, Registrar } from 'src/frameworks/entities';
import { GetContactResponseDto } from '../models';

@ApiTags('company allotment')
@ApiHeader({
  name: 'x-api-key',
  description: 'API Key for authentication',
  required: true,
})
@Controller({ version: '1' })
export class AllotmentController {
  constructor(private readonly ipoAllotmentService: IpoAllotmentService) {}

  @ApiOperation({ summary: 'add contact' })
  @HttpCode(200)
  @Post('contact/pan')
  async addPancard(
    @Body() addPanCardDto: AddPanCardDto,
  ): Promise<GetContactResponseDto> {
    return this.ipoAllotmentService.addPancard(addPanCardDto);
  }

  @ApiOperation({ summary: 'Get Contacts on or more' })
  @HttpCode(200)
  @Post('contacts')
  async getContact(@Body() getContactDto: GetContactDto) {
    return this.ipoAllotmentService.getContactByPancard(getContactDto);
  }

  @ApiOperation({ summary: 'ipo contact allotment status by pan' })
  @HttpCode(200)
  @Post('company/:id/pan')
  async allotmentByPanCardStatus(
    @Param('id') id: string,
    @Body() ipoAllotmentContactDto: IpoAllotmentContactDto,
  ): Promise<AllotmentStatus> {
    return this.ipoAllotmentService.allotmentByPanCardStatus(
      id,
      ipoAllotmentContactDto,
    );
  }

  @ApiOperation({ summary: 'ipo list sme + mainline' })
  @HttpCode(200)
  @Get('compnay/ipo')
  async getIpoList(@Query() body: GetIpoListDto) {
    return this.ipoAllotmentService.getIpoList(body);
  }

  @ApiOperation({ summary: 'get registrar list' })
  @HttpCode(200)
  @Get('company/registrar')
  async getRegistrar(): Promise<Registrar[]> {
    return this.ipoAllotmentService.getRegistrar();
  }
}
