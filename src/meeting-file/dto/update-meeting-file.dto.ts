import { PartialType } from '@nestjs/swagger';
import { CreateMeetingFileDto } from './create-meeting-file.dto';

export class UpdateMeetingFileDto extends PartialType(CreateMeetingFileDto) {}
