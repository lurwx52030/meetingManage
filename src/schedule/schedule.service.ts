import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor() {}

  // 每分鐘的第10秒觸發
  // @Cron('10 * * * * *')
  // CronTask1() {
  //   this.logger.debug(`Cron Schedule Triggle！`);
  // }
}
