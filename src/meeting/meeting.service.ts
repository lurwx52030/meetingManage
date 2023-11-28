import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';
import { User } from 'src/user/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { Meeting } from './entities/meeting.entity';

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
    dayjs.extend(isBetween);

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

    const newBorrowStart = dayjs(data.start);
    const newBorrowEnd = dayjs(data.end);
    // console.log(newBorrowStart, newBorrowEnd);
    const current = dayjs(new Date());

    if (newBorrowStart < current) {
      throw new HttpException(
        '會議開始時間不得小於現在時間',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (newBorrowStart >= newBorrowEnd) {
      throw new HttpException(
        '結束時間不可於晚於開始時間',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const borroweds = await this.meetingRepository.find({
      where: { meetingRoom },
      relations: { meetingRoom: true },
    });
    borroweds.forEach((borrowed) => {
      // isTimeOverlap(
      //   newBorrowStart,
      //   newBorrowEnd,
      //   new Date(borrowed.start),
      //   new Date(borrowed.end),
      // )
      if (
        newBorrowStart.isBetween(borrowed.start, borrowed.end, null, '[]') ||
        newBorrowEnd.isBetween(borrowed.start, borrowed.end, null, '[]')
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
    meeting.createTime = new Date();
    meeting.start = newBorrowStart.toDate();
    meeting.end = newBorrowEnd.toDate();
    return await this.meetingRepository.insert(meeting);
  }

  async findAll() {
    return await this.meetingRepository.query(
      `SELECT meeting.*,meeting_room.name as meetingRoom 
       FROM meeting 
       JOIN meeting_room ON meeting.meetingRoomId=meeting_room.id`,
    );
  }

  async findOne(id: string) {
    return await this.meetingRepository.query(
      `SELECT meeting.*,meeting_room.name as meetingRoom 
       FROM meeting 
       JOIN meeting_room ON meeting.meetingRoomId=meeting_room.id 
       WHERE meeting.id=?;`,
      [id],
    );
  }

  async findbyCreator(id: string) {
    return await this.meetingRepository.query(
      'SELECT id FROM `meeting` where creatorId=?',
      [id],
    );
  }

  async findByMeetingRoom(id: string) {
    return await this.meetingRepository.query(
      `
        SELECT
          meeting_room.id,
          meeting.name,
          meeting.start,
          meeting.end
        FROM
          meeting_room
          JOIN meeting ON meeting_room.id = meeting.meetingRoomId
        WHERE
          meeting_room.id = ?;
      `,
      [id],
    );
  }

  async update(meegingId: string, data: UpdateMeetingDto) {
    dayjs.extend(isBetween);

    const meetingRoom = (
      await this.MeetingRoomService.getMeetingRoombyId(data.meetingRoomId)
    )[0];
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

    const newBorrowStart = new Date(
      dayjs(data.start).format('YYYY-MM-DD HH:mm:ss'),
    );
    const newBorrowEnd = new Date(
      dayjs(data.end).format('YYYY-MM-DD HH:mm:ss'),
    );

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
      // isTimeOverlap(
      //   newBorrowStart,
      //   newBorrowEnd,
      //   new Date(borrowed.start),
      //   new Date(borrowed.end),
      // )
      if (
        dayjs(newBorrowStart).isBetween(borrowed.start, borrowed.end) ||
        dayjs(newBorrowEnd).isBetween(borrowed.start, borrowed.end)
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

    dayjs.extend(isBetween);
    if (!dayjs(new Date()).isBetween(meeting.start, meeting.end)) {
      throw new HttpException(
        '會議尚未開始或會議已結束',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    meeting.isCheckin = state === 1;
    const updateRes = await this.meetingRepository.update(id, meeting);
    if (updateRes.affected > 0) {
      // 自動關閉簽到
      // 1min=60000ms
      if (meeting.isCheckin) {
        const timeout = setTimeout(async () => {
          meeting.isCheckin = false;
          await this.meetingRepository.update(id, meeting);

          if (this.schedulerRegistry.doesExist('timeout', 'endCheckin')) {
            this.schedulerRegistry.deleteTimeout('endCheckin');
          }
        }, meeting.checkLimit * 60000);

        if (!this.schedulerRegistry.doesExist('timeout', 'endCheckin')) {
          this.schedulerRegistry.addTimeout('endCheckin', timeout);
        } else {
          throw new HttpException('已經開啟簽到！', HttpStatus.NOT_ACCEPTABLE);
        }
      } else {
        if (this.schedulerRegistry.doesExist('timeout', 'endCheckin')) {
          this.schedulerRegistry.deleteTimeout('endCheckin');
        }
      }

      return meeting.isCheckin;
    }
  }

  async Checkoutstatus(id: string, state: number) {
    const meeting = await this.meetingRepository.findOne({ where: { id } });

    dayjs.extend(isBetween);
    const current = new Date();
    if (!dayjs(current).isBetween(meeting.start, meeting.end)) {
      throw new HttpException(
        '會議尚未開始或會議已結束',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    meeting.isCheckout = state === 1;
    const updateRes = await this.meetingRepository.update(id, meeting);
    if (updateRes.affected > 0) {
      // 自動關閉簽退
      // 1min=60000ms
      if (meeting.isCheckout) {
        const timeout = setTimeout(async () => {
          meeting.isCheckout = false;
          await this.meetingRepository.update(id, meeting);

          if (this.schedulerRegistry.doesExist('timeout', 'endCheckin')) {
            this.schedulerRegistry.deleteTimeout('endCheckin');
          }
        }, meeting.checkLimit * 60000);

        if (!this.schedulerRegistry.doesExist('timeout', 'endCheckout')) {
          this.schedulerRegistry.addTimeout('endCheckout', timeout);
        } else {
          throw new HttpException('已經開啟簽退！', HttpStatus.NOT_ACCEPTABLE);
        }
        console.log(this.schedulerRegistry.getTimeouts());
      } else {
        if (this.schedulerRegistry.doesExist('timeout', 'endCheckout')) {
          this.schedulerRegistry.deleteTimeout('endCheckout');
        }
      }

      return meeting.isCheckout;
    }
  }
}
