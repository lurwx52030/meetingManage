import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingDto {
  // @IsNotEmpty()
  // @IsString()
  // id: string;

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
}
