import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
  ) {}

  // @Get()
  // getHello() {}

  @Get('a')
  a(@Res() res: Response) {
    res.status(200).send({ message: 'a', data: null });
  }
}
