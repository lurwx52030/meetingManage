import { Module } from '@nestjs/common';
import { MeetingMemberService } from './meeting-member.service';
import { MeetingMemberController } from './meeting-member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingMember } from './entities/meeting-member.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [MeetingMemberController],
  imports: [TypeOrmModule.forFeature([MeetingMember, Meeting, User])],
  providers: [MeetingMemberService],
})
export class MeetingMemberModule {}
