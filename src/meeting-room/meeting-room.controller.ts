import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'src/common/standardResult';
import { RoleGuard } from 'src/role/role.guard';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoomService } from './meeting-room.service';

@Controller('meeting-room')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class MettingRoomController {
  constructor(private readonly MeetingRoomService: MeetingRoomService) {}

  @Post()
  async create(@Body() createMettingRoomDto: CreateMeetingRoomDto) {
    return Result.ok(
      await this.MeetingRoomService.create(createMettingRoomDto),
    );
  }

  @Get()
  async findAll() {
    return Result.ok(await this.MeetingRoomService.findAll());
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return Result.ok(await this.MeetingRoomService.getMeetingRoombyId(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingRoomDto: UpdateMeetingRoomDto,
  ) {
    const res = await this.MeetingRoomService.update(id, updateMeetingRoomDto);
    return res.affected >= 1
      ? Result.ok(null, '修改成功')
      : Result.fail(null, '修改失敗');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.MeetingRoomService.remove(id);
    return res.affected >= 1
      ? Result.ok(null, '刪除成功')
      : Result.fail(null, '刪除失敗');
  }
}
