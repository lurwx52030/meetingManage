import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';
import { Not, Repository, getConnection } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import isTimeOverlap from 'src/common/isTimeOverlap';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,

    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,

    private readonly MeetingRoomService: MeetingRoomService,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(data: CreateMeetingDto) {
    const meetingRoom = await this.meetingRoomRepository.findOne({
      where: { id: data.meetingRoomId },
    });
    if (meetingRoom === null) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const creator = await this.userRepository.findOne({
      where: { id: data.creatorId },
    });
    if (creator === null) {
      throw new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const newBorrowStart = new Date(data.start);
    const newBorrowEnd = new Date(data.end);

    if (newBorrowStart >= newBorrowEnd) {
      throw new HttpException(
        '結束時間不可於晚於開始時間',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const borroweds = await this.meetingRepository.find({
      // where: { meetingRoom },
      relations: { meetingRoom: true },
    });
    borroweds.forEach((borrowed) => {
      if (
        isTimeOverlap(
          newBorrowStart,
          newBorrowEnd,
          new Date(borrowed.start),
          new Date(borrowed.end),
        )
      ) {
        throw new HttpException(
          '此會議室在這個時間點已被借用',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    });

    const meeting = plainToClass(Meeting, { ...data, id: null });
    meeting.meetingRoom = meetingRoom;
    meeting.creator = creator;
    meeting.start = newBorrowStart;
    meeting.end = newBorrowEnd;
    return await this.meetingRepository.insert(meeting);
  }

  async findAll() {
    return await this.meetingRepository.find();
  }

  async findOne(id: string) {
    return await this.meetingRepository.find({ where: { id } });
  }

  async update(meegingId: string, data: UpdateMeetingDto) {
    const meetingRoom = (
      await this.MeetingRoomService.getMeetingRoombyId(data.meetingRoomId)
    ).data[0];
    if (meetingRoom === null) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }
    delete data.meetingRoomId;

    const creator = await this.userRepository.findOne({
      where: { id: data.creatorId },
    });
    if (creator === null) {
      throw new HttpException('此員工不存在', HttpStatus.NOT_ACCEPTABLE);
    }
    delete data.creatorId;

    const newBorrowStart = new Date(data.start);
    const newBorrowEnd = new Date(data.end);

    if (newBorrowStart >= newBorrowEnd) {
      throw new HttpException(
        '結束時間不可於晚於開始時間',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const borroweds = await this.meetingRepository.find({
      where: { meetingRoom, id: Not(meegingId) },
    });
    borroweds.forEach((borrowed) => {
      if (
        isTimeOverlap(
          newBorrowStart,
          newBorrowEnd,
          new Date(borrowed.start),
          new Date(borrowed.end),
        )
      ) {
        throw new HttpException(
          '此會議室在這個時間點已被借用',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    });

    const meeting = plainToClass(Meeting, { ...data });
    meeting.meetingRoom = meetingRoom;
    meeting.creator = creator;
    meeting.start = newBorrowStart;
    meeting.end = newBorrowEnd;
    return await this.meetingRepository.update(meegingId, meeting);
  }

  async remove(id: string) {
    return await this.meetingRepository.delete(id);
  }

  async Checkinstatus(id: string, state: number) {
    const meeting = await this.meetingRepository.findOne({ where: { id } });
    meeting.isCheckin = state === 1;
    console.log(typeof state);
    const updateRes = await this.meetingRepository.update(id, meeting);
    if (updateRes.affected > 0) {
      //自動關閉簽到
      // 1min=60000ms
      const timeout = setTimeout(async () => {
        meeting.isCheckin = false;
        await this.meetingRepository.update(id, meeting);
      }, meeting.checkLimit * 60000);
      this.schedulerRegistry.addTimeout('endCheckin', timeout);

      return meeting.isCheckin;
    }
  }

  async Checkoutstatus(id: string, state: number) {
    const meeting = await this.meetingRepository.findOne({ where: { id } });
    meeting.isCheckout = state === 1;
    const updateRes = await this.meetingRepository.update(id, meeting);
    if (updateRes.affected > 0) {
      //自動關閉簽退
      // 1min=60000ms
      const timeout = setTimeout(async () => {
        meeting.isCheckout = false;
        await this.meetingRepository.update(id, meeting);
      }, meeting.checkLimit * 60000);
      this.schedulerRegistry.addTimeout('endCheckout', timeout);

      return meeting.isCheckout;
    }
  }
}
