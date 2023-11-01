import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingMemberDto {
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsString()
  remark: string;
}
