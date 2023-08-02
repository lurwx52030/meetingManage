import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  StreamableFile,
  HttpException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('a')
  a(@Res() res: Response) {
    res.status(200).send({ message: 'a', data: null });
  }

  // 測試參與清單發送
  @Post('multData')
  multData(@Body('participants') participant: Array<any>) {
    participant.forEach((p) => console.log(p));
  }

  @Post('singleFile')
  @UseInterceptors(FileInterceptor('file'))
  singleFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  @Post('/multFile')
  @UseInterceptors(FilesInterceptor('file'))
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map(({ fieldname, originalname }) => ({
      fieldname,
      originalname,
    }));
  }

  @Get('/download/:path')
  download(@Param('path') path: string) {
    const fullPath = join(__dirname, '..', 'uploads', path);
    if (!fs.existsSync(fullPath)) {
      throw new HttpException('未找到檔案', HttpStatus.NOT_FOUND);
    }
    const file = fs.createReadStream(fullPath);
    return new StreamableFile(file);
  }
}
