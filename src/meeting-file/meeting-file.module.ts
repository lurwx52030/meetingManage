import { Module } from '@nestjs/common';
import { MeetingFileService } from './meeting-file.service';
import { MeetingFileController } from './meeting-file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MulterHelper } from 'src/common/multerHelper';
import { MeetingService } from 'src/meeting/meeting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { meetingSequence } from 'src/meeting/entities/meeting.sequence';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoomService } from 'src/meeting-room/meeting-room.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: MulterHelper.destination,
        filename: MulterHelper.filenameHandler,
      }),
    }),
    TypeOrmModule.forFeature([Meeting, meetingSequence, MeetingRoom, User]),
  ],
  controllers: [MeetingFileController],
  providers: [MeetingFileService, MeetingService, MeetingRoomService],
})
export class MeetingFileModule {}
