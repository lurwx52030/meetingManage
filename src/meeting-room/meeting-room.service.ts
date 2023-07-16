import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/metting-room.entity';
import { Repository } from 'typeorm';
import { Result } from 'src/common/standardResult';
import { plainToClass } from 'class-transformer';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
  ) {}

  async create(data: CreateMeetingRoomDto) {
    const existing = await this.getMeetingRoombyId(data.id);
    if (existing.data.length !== 0) {
      throw new HttpException('此會議室已存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const meegingRoom = plainToClass(MeetingRoom, { ...data });
    // meegingRoom.borrows = [];
    const newMettingRoom = await this.meetingRoomRepository.save(meegingRoom);
    return Result.ok(newMettingRoom, '新增成功');
  }

  async findAll() {
    return Result.ok(await this.meetingRoomRepository.find());
  }

  async getMeetingRoombyId(id: string) {
    return Result.ok(
      await this.meetingRoomRepository.find({ where: { id: id } }),
    );
  }

  async update(id: string, MeetingRoom: UpdateMeetingRoomDto) {
    const existing = await this.getMeetingRoombyId(id);
    if (!existing.data) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    return Result.ok(await this.meetingRoomRepository.update(id, MeetingRoom));
  }

  async remove(id: string) {
    return Result.ok(await this.meetingRoomRepository.delete(id));
  }
}
