import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MettingRoomController } from './meeting-room.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/metting-room.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MettingRoomController],
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  providers: [MeetingRoomService, JwtService],
  exports: [MeetingRoomService],
})
export class MettingRoomModule {}
