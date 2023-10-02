import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { join } from 'path';
import { Result } from 'src/common/standardResult';
import { MeetingService } from 'src/meeting/meeting.service';
import { RoleGuard } from 'src/role/role.guard';
import { MeetingFileService } from './meeting-file.service';

@Controller('meeting-file')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class MeetingFileController {
  constructor(
    private readonly meetingFileService: MeetingFileService,
    private readonly meetingService: MeetingService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/:meetingId')
  @UseInterceptors(FilesInterceptor('file'))
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
  getDownloadList(@Param('meetingId') meetingId: string) {
    const path = join(__dirname, '../../', 'uploads');
    try {
      const files = fs.readdirSync(path);
      console.log(this.configService.get('domain'));
      const matchingFiles = files
        .filter((file) => file.includes(meetingId))
        .map((file) => `http://localhost:5000/meeting-file/download/${file}`);
      console.log(matchingFiles);
      return matchingFiles;
    } catch (err) {
      throw new HttpException(
        '會議不存在或是該會議沒有資料',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('/download/:path')
  downloadSingleFile(@Param('path') path: string) {
    const fullPath = join(__dirname, '../../', 'uploads', path);
    if (!fs.existsSync(fullPath)) {
      throw new HttpException('未找到檔案', HttpStatus.NOT_FOUND);
    }
    const file = fs.createReadStream(fullPath);
    return new StreamableFile(file);
  }

  @Delete('/:path')
  remove(@Param('path') path: string) {
    const fullPath = join(__dirname, '../../', 'uploads', path);
    if (!fs.existsSync(fullPath)) {
      throw new HttpException('未找到檔案', HttpStatus.NOT_FOUND);
    }
    try {
      fs.unlinkSync(fullPath);
      return Result.ok(null, '刪除成功');
    } catch (error) {
      return Result.fail(204, '刪除失敗');
    }
  }
}
