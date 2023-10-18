import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMeetingMemberDto } from './dto/create-meeting-member.dto';
import { MeetingMember } from './entities/meeting-member.entity';

@Injectable()
export class MeetingMemberService {
  constructor(
    @InjectRepository(MeetingMember)
    private readonly meetingMemberRepository: Repository<MeetingMember>,

    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateMeetingMemberDto) {
    const employee = await this.userRepository.findOne({
      where: { id: data.employeeId },
    });
    if (employee === null) {
      throw new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const meeting = await this.meetingRepository.query(
      'select * from meeting where id=?',
      [data.meetingId],
    );

    if (meeting instanceof Array && meeting.length < 1) {
      throw new HttpException('此會議不存在', HttpStatus.NOT_ACCEPTABLE);
    } else if (data.employeeId === meeting[0].creatorId) {
      throw new HttpException(
        '您已是此會議創立人！',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    console.log(data.meetingId, data.employeeId);
    const exists = await this.meetingMemberRepository
      .createQueryBuilder('')
      .select()
      .where('meetingId = :meetingId', { meetingId: data.meetingId })
      .andWhere('participantId = :participantId', {
        participantId: data.employeeId,
      })
      .getMany();
    if (exists.length !== 0) {
      throw new HttpException('此員工已參與此會議', HttpStatus.NOT_ACCEPTABLE);
    }

    const meetingMember = plainToClass(MeetingMember, { ...data });
    meetingMember.meeting = plainToClass(Meeting, { ...meeting[0] });
    meetingMember.participant = employee;
    // console.log(meetingMember);

    return await this.meetingMemberRepository.insert(meetingMember);
  }

  async findAll() {
    return await this.meetingMemberRepository.query(
      'SELECT * FROM `meeting_member`',
    );
  }

  async findByMeeting(id: string) {
    return await this.meetingMemberRepository.query(
      'SELECT user.id,user.name,singin,singout FROM `meeting_member` JOIN user ON user.id=participantId WHERE meetingId=?',
      [id],
    );
  }

  async remove(id: string, meetingid: string) {
    return await this.meetingMemberRepository.query(
      'DELETE FROM `meeting_member` WHERE participantId=? and  meetingId=?',
      [id, meetingid],
    );
  }

  //簽到簽退
  async attendance(id: string, meetingid: string, isSignIn: boolean) {
    const exceptions: HttpException[] = [];

    const employee = await this.userRepository.findOne({
      where: { id },
    });
    if (employee === null) {
      return { message: '此員工不存在', status: HttpStatus.NOT_ACCEPTABLE };
    }

    const meeting = await this.meetingRepository.findOne({
      where: { id: meetingid },
    });
    if (meeting === null) {
      return { message: '此會議不存在', status: HttpStatus.NOT_ACCEPTABLE };
    }

    if (isSignIn && !meeting.isCheckin) {
      return { message: '尚未開始簽到', status: HttpStatus.NOT_ACCEPTABLE };
    }

    if (!isSignIn && !meeting.isCheckout) {
      return { message: '尚未開始簽退', status: HttpStatus.NOT_ACCEPTABLE };
    }

    const current = new Date();

    if (current < meeting.start) {
      throw new HttpException('會議尚未開始', HttpStatus.NOT_ACCEPTABLE);
    }

    if (current > meeting.end) {
      throw new HttpException('會議已結束', HttpStatus.NOT_ACCEPTABLE);
    }

    const log = await this.meetingMemberRepository
      .createQueryBuilder('')
      .select()
      .where('meetingId = :meetingId', { meetingId: meetingid })
      .andWhere('participantId = :participantId', {
        participantId: id,
      })
      .getOne();

    if (isSignIn) {
      log.singin = current;
    } else {
      if (log.singin === null) {
        throw new HttpException('尚未簽到', HttpStatus.NOT_ACCEPTABLE);
      }
      log.singout = current;
    }
    const res = this.meetingMemberRepository.update(log.id, log);
    return res;
  }
}
