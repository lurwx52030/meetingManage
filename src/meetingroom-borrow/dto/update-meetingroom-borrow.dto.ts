import { PartialType } from '@nestjs/swagger';
import { CreateMeetingroomBorrowDto } from './create-meetingroom-borrow.dto';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class UpdateMeetingroomBorrowDto {
  @IsNotEmpty()
  @IsString()
  meetingRoomId: string;

  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @IsNotEmpty()
  @IsDateString()
  end: Date;
}
