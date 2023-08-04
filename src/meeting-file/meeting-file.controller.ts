import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  StreamableFile,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { MeetingFileService } from './meeting-file.service';
import { CreateMeetingFileDto } from './dto/create-meeting-file.dto';
import { UpdateMeetingFileDto } from './dto/update-meeting-file.dto';
import { join } from 'path';
import * as fs from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MeetingService } from 'src/meeting/meeting.service';
import { Result } from 'src/common/standardResult';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';

@Controller('meeting-file')
export class MeetingFileController {
  constructor(
    private readonly meetingFileService: MeetingFileService,
    private readonly meetingService: MeetingService,
  ) {}

  @Post('/:meetingId')
  @UseInterceptors(FilesInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  async create(
    @Param('meetingId') meetingId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(meetingId);
    const meeting = await this.meetingService.findOne(meetingId);
    if (meeting.length === 0) {
      throw new HttpException('會議不存在', HttpStatus.NOT_FOUND);
    }
    return files.map(({ fieldname, originalname }) => ({
      fieldname,
      originalname,
    }));
  }

  @Get('/:meetingId')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  getFileList(@Param('meetingId') meetingId: string) {
    const path = join(__dirname, '../../', 'uploads');
    try {
      const files = fs.readdirSync(path);
      const matchingFiles = files.filter((file) => file.includes(meetingId));
      return matchingFiles;
    } catch (err) {
      throw new HttpException(
        '會議不存在或是該會議沒有資料',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/download/:path')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  downloadSingleFile(@Param('path') path: string) {
    const fullPath = join(__dirname, '../../', 'uploads', path);
    if (!fs.existsSync(fullPath)) {
      throw new HttpException('未找到檔案', HttpStatus.NOT_FOUND);
    }
    const file = fs.createReadStream(fullPath);
    return new StreamableFile(file);
  }

  @Delete('/:path')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  remove(@Param('path') path: string) {
    const fullPath = join(__dirname, '../../', 'uploads', path);
    if (!fs.existsSync(fullPath)) {
      throw new HttpException('未找到檔案', HttpStatus.NOT_FOUND);
    }
    try {
      fs.unlinkSync(fullPath);
      return Result.ok(null, '刪除成功');
    } catch (error) {
      return Result.fail(null, '刪除失敗');
    }
  }
}
