// import { Body, Controller, HttpCode, Post } from '@nestjs/common';
// import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
// import { ContactService } from '../services/contact.service';
// import { AddPanCardDto } from '../dtos';

// @ApiTags('IPO APIs')
// @ApiHeader({
//   name: 'x-api-key',
//   description: 'API Key for authentication',
//   required: true,
// })
// @Controller({ version: '1', path: 'contact' })
// export class ContactController {
//   constructor(private readonly contactService: ContactService) {}

//   @ApiOperation({ summary: 'Add PAN card' })
//   @HttpCode(200)
//   @Post('contact/pan')
//   async addPancard(@Body() addPanCardDto: AddPanCardDto) {
//     return this.contactService.addPanNumber(addPanCardDto);
//   }

//   @ApiOperation({ summary: 'Get Contacts by PAN numbers' })
//   @HttpCode(200)
//   @Post('contacts')
//   async getContact(@Body() getContactDto: GetContactDto) {
//     return this.contactService.getContactByPancard(getContactDto);
//   }
// }
