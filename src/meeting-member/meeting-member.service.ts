import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingMemberDto } from './dto/create-meeting-member.dto';
import { UpdateMeetingMemberDto } from './dto/update-meeting-member.dto';
import { MeetingMember } from './entities/meeting-member.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { plainToClass } from 'class-transformer';
import { MultiHttpException } from 'src/common/MultiHttpExceptionFilter';

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
    const exceptions: HttpException[] = [];

    const employee = await this.userRepository.findOne({
      where: { id: data.employeeId },
    });
    if (employee === null) {
      exceptions.push(
        new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE),
      );
    }

    const meeting = await this.meetingRepository.findOne({
      where: { id: data.meetingId },
    });
    if (meeting === null) {
      exceptions.push(
        new HttpException('此會議不存在', HttpStatus.NOT_ACCEPTABLE),
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
      exceptions.push(
        new HttpException('此員工已參與此會議', HttpStatus.NOT_ACCEPTABLE),
      );
    }

    if (exceptions.length !== 0) {
      throw new MultiHttpException(exceptions);
    }
    exceptions.splice(0, exceptions.length);

    const meetingMember = plainToClass(MeetingMember, { ...data });
    meetingMember.meeting = meeting;
    meetingMember.participant = employee;

    return await this.meetingMemberRepository.insert(meetingMember);
  }

  async findAll() {
    return await this.meetingMemberRepository.query(
      'SELECT * FROM `meeting_member`',
    );
  }

  async findOneByMeeting(id: string) {
    return await this.meetingMemberRepository.query(
      'SELECT * FROM `meeting_member` WHERE meetingId=?',
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
      exceptions.push(
        new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE),
      );
    }

    const meeting = await this.meetingRepository.findOne({
      where: { id: meetingid },
    });
    if (meeting === null) {
      exceptions.push(
        new HttpException('此會議不存在', HttpStatus.NOT_ACCEPTABLE),
      );
    }

    if (exceptions.length !== 0) {
      throw new MultiHttpException(exceptions);
    }
    exceptions.splice(0, exceptions.length);

    const current = new Date(2023, 6, 7, 15, 50);
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
