import { Injectable } from '@nestjs/common';
import { CreateMeetingFileDto } from './dto/create-meeting-file.dto';
import { UpdateMeetingFileDto } from './dto/update-meeting-file.dto';

@Injectable()
export class MeetingFileService {
  create(createMeetingFileDto: CreateMeetingFileDto) {
    return 'This action adds a new meetingFile';
  }

  findAll() {
    return `This action returns all meetingFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meetingFile`;
  }

  update(id: number, updateMeetingFileDto: UpdateMeetingFileDto) {
    return `This action updates a #${id} meetingFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} meetingFile`;
  }
}
