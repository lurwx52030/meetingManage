import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Result } from 'src/common/standardResult';

@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    const res = await this.meetingService.create(createMeetingDto);
    if (res.raw.affectedRows > 0) {
      return Result.ok(null, '新增成功');
    } else {
      return Result.ok(null, '新增失敗');
    }
  }

  @Get()
  async findAll() {
    const res = await this.meetingService.findAll();
    return Result.ok(res, '查詢成功');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.meetingService.findOne(id);
    return Result.ok(res, '查詢成功');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
  ) {
    const res = await this.meetingService.update(id, updateMeetingDto);
    return res.affected > 0
      ? Result.ok(null, '更新成功')
      : Result.fail(204, '更新失敗');
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const res = await this.meetingService.remove(id);
    return res.affected > 0
      ? Result.ok(null, '刪除成功')
      : Result.fail(204, '刪除失敗');
  }
}
