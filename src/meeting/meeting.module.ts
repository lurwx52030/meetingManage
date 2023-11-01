import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';
import { User } from 'src/user/entities/user.entity';
import { Meeting } from './entities/meeting.entity';
import { meetingSequence } from './entities/meeting.sequence';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';

@Module({
  controllers: [MeetingController],
  imports: [
    TypeOrmModule.forFeature([Meeting, meetingSequence, MeetingRoom, User]),
  ],
  providers: [MeetingService, MeetingRoomService, JwtService],
  exports: [MeetingService],
})
export class MeetingModule {}
