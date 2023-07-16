import { Body, Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LinebotService } from './linebot.service';

@Controller('linebot')
export class LinebotController {
  constructor(private readonly lineBotService: LinebotService) {}

  @Post('/')
  getUserMessgae(@Body() data: any, @Res() response: Response) {
    if (data.destination && data.events && data.events.length !== 0) {
      this.lineBotService.responseUser(data);
    } else {
      response
        .status(HttpStatus.OK)
        .send({ status: 200, data: data, message: 'ok' });
    }
  }

  @Get('/a')
  a(): string {
    return 'aaa';
  }
}
