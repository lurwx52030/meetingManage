import { PartialType } from '@nestjs/swagger';
import { CreateMeetingMemberDto } from './create-meeting-member.dto';

export class UpdateMeetingMemberDto extends PartialType(
  CreateMeetingMemberDto,
) {}
