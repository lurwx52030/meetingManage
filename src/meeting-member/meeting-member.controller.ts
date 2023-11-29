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
import { UpdateResult } from 'typeorm';
import { CreateMeetingMemberDto } from './dto/create-meeting-member.dto';
import { UpdateMeetingMemberDto } from './dto/update-meeting-member.dto';
import meetingCreatorGuard from './guards/meeting-creator.guard';
import { MeetingMemberService } from './meeting-member.service';

@Controller('meeting-member')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class MeetingMemberController {
  constructor(private readonly meetingMemberService: MeetingMemberService) {}

  @Post()
  @UseGuards(meetingCreatorGuard)
  async create(@Body() member: CreateMeetingMemberDto) {
    const res = await this.meetingMemberService.create(member);
    if (res.raw.affectedRows > 0) {
      return Result.ok(null, '新增成功');
    } else {
      return Result.fail(204, '新增失敗');
    }
  }

  @Get()
  async findAll() {
    const res = await this.meetingMemberService.findAll();
    return Result.ok(res, '查詢成功');
  }

  @Get('/meeting/:id')
  async findOne(@Param('id') id: string) {
    const res = await this.meetingMemberService.findByMeeting(id);
    return Result.ok(res, '查詢成功');
  }

  @Get('/signin/:meetingId/:id')
  async signIn(@Param('id') id: string, @Param('meetingId') meetingId: string) {
    const res = await this.meetingMemberService.attendance(id, meetingId, true);
    console.log(res);
    if ((res as UpdateResult).affected > 0) {
      return Result.ok(null, '簽到成功');
    } else {
      return Result.fail(204, '簽到失敗', res);
    }
  }

  @Put('remark')
  @UseGuards(meetingCreatorGuard)
  async updateRmark(@Body() member: UpdateMeetingMemberDto) {
    const res = await this.meetingMemberService.updateRmark(member);
    return res.affectedRows > 0
      ? Result.ok(null, '更新備註成功')
      : Result.fail(204, '更新備註失敗');
  }

  @Get('/signout/:meetingId/:id')
  async signOut(
    @Param('id') id: string,
    @Param('meetingId') meetingId: string,
  ) {
    const res = await this.meetingMemberService.attendance(
      id,
      meetingId,
      false,
    );
    if ((res as UpdateResult).affected > 0) {
      return Result.ok(null, '簽退成功');
    } else {
      return Result.fail(204, '簽退失敗', res);
    }
  }

  @Delete('/:meetingId/:id')
  @UseGuards(meetingCreatorGuard)
  async remove(@Param('id') id: string, @Param('meetingId') meetingId: string) {
    const res = await this.meetingMemberService.remove(id, meetingId);
    return res.affectedRows > 0
      ? Result.ok(null, '刪除成功')
      : Result.fail(204, '刪除失敗');
  }
}
