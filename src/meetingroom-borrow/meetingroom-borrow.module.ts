import { Module } from '@nestjs/common';
import { MeetingroomBorrowService } from './meetingroom-borrow.service';
import { MeetingroomBorrowController } from './meetingroom-borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import dbConfig from 'src/config/db.config';
import { MeetingroomBorrow } from './entities/meetingroom-borrow.entity';
import { MeetingRoom } from 'src/meeting-room/entities/metting-room.entity';

@Module({
  controllers: [MeetingroomBorrowController],
  imports: [TypeOrmModule.forFeature([MeetingroomBorrow, MeetingRoom])],
  providers: [MeetingroomBorrowService],
})
export class MeetingroomBorrowModule {}
