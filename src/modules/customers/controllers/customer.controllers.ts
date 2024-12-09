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

@ApiTags('users-contacts')
@ApiBearerAuth()
@Controller({ version: '1', path: 'user' })
export class CustomerController {
  constructor(private contactsService: ContactsService) {}

  @ApiOperation({ summary: 'Find a User' })
  @ApiResponse({
    status: 200,
    description: 'User found',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@User() loggedInUser: Users) {
    return this.contactsService.getUser(loggedInUser);
  }
}
