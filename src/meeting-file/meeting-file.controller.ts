import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import commonLogger from 'src/common/loggerController';
import { Result } from 'src/common/standardResult';
import { MeetingService } from 'src/meeting/meeting.service';
import { RoleGuard } from 'src/role/role.guard';
import { MeetingFileService } from './meeting-file.service';

@Controller('meeting-file')
export class MeetingFileController extends commonLogger {
  constructor(
    private readonly meetingFileService: MeetingFileService,
    private readonly meetingService: MeetingService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  @Post('/:meetingId')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(RoleGuard)
  // @UseInterceptors(meetingFileRoleInterceptor)
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @Req() request: Request,
    @Param('meetingId') meetingId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // console.log(meetingId);
    const meeting = await this.meetingService.findOne(meetingId);
    if (meeting.length === 0) {
      throw new HttpException('會議不存在', HttpStatus.NOT_FOUND);
    }
    // console.log(`file: ${files}`);
    const port =
      request.hostname !== 'localhost' ? '' : request.socket.localPort;
    const fileList = files.map(({ fieldname, originalname }, index) => {
      return {
        id: index,
        fieldname,
        name: originalname,
        // reference -> https://stackoverflow.com/a/10349106/15407937
        download: `//${request.hostname}:${port}/meeting-file/download/${meetingId}-${originalname}`,
      };
    });
    return Result.ok(fileList, '上傳成功');
  }

  @Get('/:meetingId')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  getDownloadList(
    @Req() request: Request,
    @Param('meetingId') meetingId: string,
  ) {
    const path = join(__dirname, '../../', 'uploads');
    try {
      const files = fs.readdirSync(path);
      const port =
        request.hostname !== 'localhost' ? '' : request.socket.localPort;
      this.logger.log(`protocol -> ${request.protocol}`);
      this.logger.log(`port -> ${request.socket.localPort}`);
      const matchingFiles = files
        .filter((file) => file.includes(meetingId))
        .map((file, index) => {
          // reference -> https://stackoverflow.com/a/10349106/15407937
          const url = `//${request.hostname}:${port}/meeting-file/download/${file}`;
          return {
            id: index,
            name: file,
            download: url,
          };
        });
      return Result.ok(matchingFiles, '查詢成功');
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
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard('jwt'))
  // @UseInterceptors(meetingFileRoleInterceptor)
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
