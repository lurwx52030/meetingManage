import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { MeetingRoom } from './entities/metting-room.entity';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
  ) {}

  async create(data: CreateMeetingRoomDto) {
    const existing = await this.getMeetingRoombyId(data.id);
    if (existing.length !== 0) {
      throw new HttpException('此會議室已存在', HttpStatus.NOT_ACCEPTABLE);
    }

    const meegingRoom = plainToClass(MeetingRoom, { ...data });
    // meegingRoom.borrows = [];
    return await this.meetingRoomRepository.save(meegingRoom);
  }

  async findAll() {
    return await this.meetingRoomRepository.find();
  }

  async getMeetingRoombyId(id: string) {
    return await this.meetingRoomRepository.find({ where: { id: id } });
  }

  async update(id: string, MeetingRoom: UpdateMeetingRoomDto) {
    const existing = await this.getMeetingRoombyId(id);
    if (!existing) {
      throw new HttpException('此會議室不存在', HttpStatus.NOT_ACCEPTABLE);
    }

    return await this.meetingRoomRepository.update(id, MeetingRoom);
  }

  async remove(id: string) {
    return await this.meetingRoomRepository.delete(id);
  }
}
