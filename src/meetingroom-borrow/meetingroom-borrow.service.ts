import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingroomBorrowDto } from './dto/create-meetingroom-borrow.dto';
import { UpdateMeetingroomBorrowDto } from './dto/update-meetingroom-borrow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingroomBorrow } from './entities/meetingroom-borrow.entity';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { Result } from 'src/common/standardResult';
import isTimeOverlap from 'src/common/isTimeOverlap';

@Injectable()
export class MeetingroomBorrowService {
  constructor(
    @InjectRepository(MeetingroomBorrow)
    private readonly meetingRoomBorrowRepository: Repository<MeetingroomBorrow>,
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
  ) {}

  async create(data: CreateMeetingroomBorrowDto) {
    const meetingRoom = await this.meetingRoomRepository.findOne({
      where: { id: data.meetingRoomId },
    });
    if (meetingRoom === null) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const newBorrowStart = new Date(data.start);
    const newBorrowEnd = new Date(data.end);

    if (newBorrowStart >= newBorrowEnd) {
      throw new HttpException(
        '結束時間不可於晚於開始時間',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const borroweds = (await this.findOne(meetingRoom.id)).data;
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

    const meegingRoomBorrow = plainToClass(MeetingroomBorrow, { ...data });
    meegingRoomBorrow.meetingRoom = meetingRoom;

    return await this.meetingRoomBorrowRepository.save(meegingRoomBorrow);
  }

  async findAll() {
    return Result.ok(await this.meetingRoomRepository.find());
  }

  async findOne(id: string) {
    const meetingRoom = await this.meetingRoomRepository.findOne({
      where: { id: id },
    });
    if (meetingRoom === null) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }
    return Result.ok(
      await this.meetingRoomBorrowRepository.find({ where: { meetingRoom } }),
    );
  }

  async update(id: string, data: UpdateMeetingroomBorrowDto) {
    const meetingRoom = await this.meetingRoomRepository.findOne({
      where: { id: id },
    });
    if (meetingRoom === null) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const newBorrowStart = new Date(data.start);
    const newBorrowEnd = new Date(data.end);

    if (newBorrowStart >= newBorrowEnd) {
      throw new HttpException(
        '結束時間不可於晚於開始時間',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const borroweds = (await this.findOne(meetingRoom.id)).data;
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

    const meegingRoomBorrow = plainToClass(MeetingroomBorrow, { ...data });
    meegingRoomBorrow.meetingRoom = meetingRoom;

    return Result.ok(
      await this.meetingRoomBorrowRepository.update(id, meegingRoomBorrow),
    );
  }

  async remove(id: string) {
    return Result.ok(await this.meetingRoomBorrowRepository.delete(id));
  }
}
