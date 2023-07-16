import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingroomBorrowDto {
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
