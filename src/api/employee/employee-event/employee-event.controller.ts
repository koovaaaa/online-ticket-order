import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EmployeeEventService } from './employee-event.service';
import { AddEventDto } from './dto/add-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import setMulterConfig from '../../../config/multerconfig';
import { PathUploadEnum } from '../../../enum/path-upload.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { EmployeeGuard } from '../../auth/guards/employee.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../../entity/user/user.entity';
import { Event } from '../../../entity/event/event.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ChangeEventDto } from './dto/change-event.dto';
import { ChangeFormatDateInterceptor } from '../../../interceptor/change-format-date.interceptor';
import { ChangeDateInterceptor } from '../../../interceptor/change-date.interceptor';
import { PaginationDto } from '../../../helper/dto/pagination.dto';

@ApiTags('Employee Event')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, EmployeeGuard)
@Controller('employee-events')
export class EmployeeEventController {
  constructor(private readonly employeeEventService: EmployeeEventService) {}

  @Get('get-events')
  @UseInterceptors(ChangeFormatDateInterceptor)
  async getAllEvents(@Query() pagination: PaginationDto): Promise<{
    events: Event[];
    numberOfEvents: number;
    eventsPerPage: number;
  }> {
    return await this.employeeEventService.getAllEvents(pagination);
  }

  @Get('get-event/:id')
  @UseInterceptors(ChangeDateInterceptor)
  async getEvent(@Param('id') id: string): Promise<Event> {
    return await this.employeeEventService.getEvent(id);
  }

  @Get('get-active-events')
  @UseInterceptors(ChangeFormatDateInterceptor)
  async getActiveEvents(@Query() pagination: PaginationDto): Promise<{
    events: Event[];
    numberOfEvents: number;
  }> {
    return await this.employeeEventService.getActiveEvents(pagination);
  }

  @Get('get-previous-events')
  @UseInterceptors(ChangeFormatDateInterceptor)
  async getPreviousEvents(@Query() pagination: PaginationDto): Promise<{
    events: Event[];
    numberOfEvents: number;
  }> {
    return await this.employeeEventService.getPreviousEvents(pagination);
  }

  @Post('add-event')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddEventDto })
  @UseInterceptors(
    FileInterceptor('eventPhoto', setMulterConfig(PathUploadEnum.EVENT_PHOTO)),
  )
  async addNewEvent(
    @Body() eventData: AddEventDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<Event> {
    return await this.employeeEventService.addNewEvent(eventData, file, user);
  }

  @Put('edit-event/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ChangeEventDto })
  @UseInterceptors(
    FileInterceptor('eventPhoto', setMulterConfig(PathUploadEnum.EVENT_PHOTO)),
  )
  async editEvent(
    @Param('id') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() eventData: ChangeEventDto,
    @GetUser() user: User,
  ): Promise<UpdateResult> {
    return await this.employeeEventService.editEvent(
      eventId,
      file,
      eventData,
      user,
    );
  }

  @Delete('delete-event/:id')
  async deleteEvent(@Param('id') eventId: string): Promise<DeleteResult> {
    return await this.employeeEventService.deleteEvent(eventId);
  }
}
