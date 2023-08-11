import { PartialType } from '@nestjs/swagger';
import { CreateMeetingDto } from './create-meeting.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMeetingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  meetingRoomId: string;

  @IsNotEmpty()
  @IsString()
  creatorId: string;

  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  end: Date;

  @IsNumber()
  notificationTime: number;
}
