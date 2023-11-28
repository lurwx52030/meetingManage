import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { MulterHelper } from 'src/common/multerHelper';
import { MeetingMember } from 'src/meeting-member/entities/meeting-member.entity';
import { MeetingMemberService } from 'src/meeting-member/meeting-member.service';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { meetingSequence } from 'src/meeting/entities/meeting.sequence';
import { MeetingService } from 'src/meeting/meeting.service';
import { User } from 'src/user/entities/user.entity';
import { MeetingFileController } from './meeting-file.controller';
import { MeetingFileService } from './meeting-file.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: MulterHelper.destination,
        filename: MulterHelper.filenameHandler,
      }),
    }),
    TypeOrmModule.forFeature([
      Meeting,
      meetingSequence,
      MeetingMember,
      MeetingRoom,
      User,
    ]),
  ],
  controllers: [MeetingFileController],
  providers: [
    MeetingFileService,
    MeetingService,
    MeetingMemberService,
    MeetingRoomService,
    JwtService,
  ],
})
export class MeetingFileModule {}
