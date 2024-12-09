import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateContactDto, GetContactByPanNumbersDto } from '../dtos';
import { ContactsService } from '../services/contacts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/frameworks/decorators/user.decorator';
import { JwtAuthGuard } from 'src/frameworks/apis/guards/jwt-auth.guard';
import { Users } from 'src/frameworks/entities';
import { RolesGuard } from 'src/frameworks/apis/guards/role.guard';
import { Roles } from 'src/frameworks/decorators/roles.decorator';
import { ROLES } from 'src/frameworks/enums';

@ApiTags('users-contacts')
@ApiBearerAuth()
@Controller({ version: '1', path: 'user/contact' })
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({
    status: 201,
    description: 'Contact created successfully',
    type: CreateContactDto,
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CUSTOMER)
  @Post()
  addContact(@Body() createContactDto: CreateContactDto, @User() user: Users) {
    return this.contactsService.addContact(createContactDto, user);
  }

  @ApiOperation({ summary: 'Find all user contacts' })
  @ApiResponse({ status: 200, description: 'List of contacts', isArray: true })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CUSTOMER)
  findAll(@User() loggedInUser: Users) {
    return this.contactsService.findAll(loggedInUser);
  }

  @ApiOperation({ summary: 'Find a contact by panNumbers' })
  @ApiResponse({
    status: 200,
    description: 'Contact found',
    type: CreateContactDto,
  })
  @Post('/pan')
  @UseGuards(JwtAuthGuard)
  findContactByPanNumber(@Body() body: GetContactByPanNumbersDto) {
    return this.contactsService.findContactByPanNumber(body);
  }

  @ApiOperation({ summary: 'Remove a contact' })
  @ApiResponse({ status: 200, description: 'Contact removed successfully' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.CUSTOMER)
  remove(
    @Param('id', ParseIntPipe) contactId: number,
    @User() loggedInUser: Users,
  ) {
    return this.contactsService.remove(+contactId, loggedInUser);
  }
}
