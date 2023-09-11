import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'src/common/standardResult';
import { RoleGuard } from 'src/role/role.guard';
import { CreateMeetingMemberDto } from './dto/create-meeting-member.dto';
import { MeetingMemberService } from './meeting-member.service';

@Controller('meeting-member')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class MeetingMemberController {
  constructor(private readonly meetingMemberService: MeetingMemberService) {}

  @Post()
  async create(@Body() createMeetingMemberDto: CreateMeetingMemberDto) {
    const res = await this.meetingMemberService.create(createMeetingMemberDto);
    if (res.raw.affectedRows > 0) {
      return Result.ok(null, '新增成功');
    } else {
      return Result.ok(null, '新增失敗');
    }
  }

  @Get()
  async findAll() {
    const res = await this.meetingMemberService.findAll();
    return Result.ok(res, '查詢成功');
  }

  @Get('/meeting/:id')
  async findOne(@Param('id') id: string) {
    const res = await this.meetingMemberService.findOneByMeeting(id);
    return Result.ok(res, '查詢成功');
  }

  @Get('/signin/:meetingid/:id')
  async signIn(@Param('id') id: string, @Param('meetingid') meetingid: string) {
    const res = await this.meetingMemberService.attendance(id, meetingid, true);
    console.log(res);
    if (res.affected > 0) {
      return Result.ok(null, '簽到成功');
    } else {
      return Result.fail(204, '簽到失敗');
    }
  }

  @Get('/signout/:meetingid/:id')
  async signOut(
    @Param('id') id: string,
    @Param('meetingid') meetingid: string,
  ) {
    const res = await this.meetingMemberService.attendance(
      id,
      meetingid,
      false,
    );
    if (res.affected > 0) {
      return Result.ok(null, '簽退成功');
    } else {
      return Result.fail(204, '簽退失敗');
    }
  }

  @Delete('/:meetingid/:id')
  async remove(@Param('id') id: string, @Param('meetingid') meetingid: string) {
    const res = await this.meetingMemberService.remove(id, meetingid);
    return res.affectedRows > 0
      ? Result.ok(null, '刪除成功')
      : Result.fail(204, '刪除失敗');
  }
}
