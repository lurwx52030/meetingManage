import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MettingRoomController } from './meeting-room.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/metting-room.entity';

@Module({
  controllers: [MettingRoomController],
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  providers: [MeetingRoomService],
  exports: [MeetingRoomService],
})
export class MettingRoomModule {}
