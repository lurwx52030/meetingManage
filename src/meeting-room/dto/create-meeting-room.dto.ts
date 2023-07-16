import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingRoomDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
