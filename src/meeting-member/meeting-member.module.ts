import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { User } from 'src/user/entities/user.entity';
import { MeetingMember } from './entities/meeting-member.entity';
import meetingCreatorInterceptor from './interceptors/meeting-creator.interceptor';
import { MeetingMemberController } from './meeting-member.controller';
import { MeetingMemberService } from './meeting-member.service';
import { MeetingMemberGateway } from './websocket/meeting-member.gateway';

@Module({
  controllers: [MeetingMemberController],
  imports: [
    TypeOrmModule.forFeature([Meeting, MeetingMember, User, MeetingRoom]),
  ],
  providers: [
    MeetingMemberService,
    MeetingService,
    MeetingRoomService,
    JwtService,
    MeetingMemberGateway,
    meetingCreatorInterceptor,
  ],
})
export class MeetingMemberModule {}
