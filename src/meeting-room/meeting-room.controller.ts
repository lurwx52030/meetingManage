import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Controller('meeting-room')
export class MettingRoomController {
  constructor(private readonly MeetingRoomService: MeetingRoomService) {}

  @Post()
  create(@Body() createMettingRoomDto: CreateMeetingRoomDto) {
    return this.MeetingRoomService.create(createMettingRoomDto);
  }

  @Get()
  findAll() {
    return this.MeetingRoomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.MeetingRoomService.getMeetingRoombyId(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingRoomDto: UpdateMeetingRoomDto,
  ) {
    return this.MeetingRoomService.update(id, updateMeetingRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MeetingRoomService.remove(id);
  }
}
