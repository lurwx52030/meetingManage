import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { User } from 'src/user/entities/user.entity';
import { MeetingMember } from './entities/meeting-member.entity';
import { MeetingMemberController } from './meeting-member.controller';
import { MeetingMemberService } from './meeting-member.service';
import { MeetingMemberGateway } from './websocket/meeting-member.gateway';

@Module({
  controllers: [MeetingMemberController],
  imports: [TypeOrmModule.forFeature([Meeting, MeetingMember, User])],
  providers: [MeetingMemberService, JwtService, MeetingMemberGateway],
})
export class MeetingMemberModule {}
