import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';

@Controller('meeting-room')
export class MettingRoomController {
  constructor(private readonly MeetingRoomService: MeetingRoomService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() createMettingRoomDto: CreateMeetingRoomDto) {
    return this.MeetingRoomService.create(createMettingRoomDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  @Get()
  findAll() {
    return this.MeetingRoomService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.MeetingRoomService.getMeetingRoombyId(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingRoomDto: UpdateMeetingRoomDto,
  ) {
    return this.MeetingRoomService.update(id, updateMeetingRoomDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MeetingRoomService.remove(id);
  }
}
