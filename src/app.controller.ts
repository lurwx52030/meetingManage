import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

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
}
