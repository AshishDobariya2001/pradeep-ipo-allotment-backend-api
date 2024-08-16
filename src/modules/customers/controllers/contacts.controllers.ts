import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateContactDto } from '../dtos';
import { ContactsService } from '../services/contacts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Users } from 'src/frameworks/entities';
import { User } from 'src/frameworks/decorators/user.decorator';
import { JwtAuthGuard } from 'src/frameworks/apis/guards/jwt-auth.guard';

@ApiTags('users-contacts')
@ApiBearerAuth()
@Controller({ version: '1', path: 'user/contacts' })
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({
    status: 201,
    description: 'Contact created successfully',
    type: CreateContactDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  addContact(@Body() createContactDto: CreateContactDto, @User() user: Users) {
    return this.contactsService.addContact(createContactDto, user);
  }

  @ApiOperation({ summary: 'Find all contacts' })
  @ApiResponse({ status: 200, description: 'List of contacts', isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@User() user: Users) {
    return this.contactsService.findAll(user);
  }

  @ApiOperation({ summary: 'Find a contact by ID' })
  @ApiResponse({
    status: 200,
    description: 'Contact found',
    type: CreateContactDto,
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(+id);
  }

  //   @ApiOperation({ summary: 'Update a contact' })
  //   @ApiResponse({ status: 200, description: 'Contact updated successfully', type: CreateContactDto })
  //   @Put(':id')
  //   update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
  //     return this.contactsService.update(+id, updateContactDto);
  //   }

  // @ApiOperation({ summary: 'Remove a contact' })
  // @ApiResponse({ status: 200, description: 'Contact removed successfully' })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.contactsService.remove(+id);
  // }
}
