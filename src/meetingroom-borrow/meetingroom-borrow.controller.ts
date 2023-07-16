import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MeetingroomBorrowService } from './meetingroom-borrow.service';
import { CreateMeetingroomBorrowDto } from './dto/create-meetingroom-borrow.dto';
import { UpdateMeetingroomBorrowDto } from './dto/update-meetingroom-borrow.dto';

@Controller('meetingroom-borrow')
export class MeetingroomBorrowController {
  constructor(
    private readonly meetingroomBorrowService: MeetingroomBorrowService,
  ) {}

  @Post()
  create(@Body() createMeetingroomBorrowDto: CreateMeetingroomBorrowDto) {
    return this.meetingroomBorrowService.create(createMeetingroomBorrowDto);
  }

  @Get()
  findAll() {
    return this.meetingroomBorrowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingroomBorrowService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingroomBorrowDto: UpdateMeetingroomBorrowDto,
  ) {
    return this.meetingroomBorrowService.update(id, updateMeetingroomBorrowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingroomBorrowService.remove(id);
  }
}
