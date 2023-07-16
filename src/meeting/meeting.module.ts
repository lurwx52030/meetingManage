import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { meetingSequence } from './entities/meeting.sequence';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';

@Module({
  controllers: [MeetingController],
  imports: [
    TypeOrmModule.forFeature([Meeting, meetingSequence, MeetingRoom, User]),
  ],
  providers: [MeetingService, MeetingRoomService],
})
export class MeetingModule {}
