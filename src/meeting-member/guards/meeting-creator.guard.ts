import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable, from, map } from 'rxjs';
import commonLogger from 'src/common/loggerController';
import { MeetingService } from 'src/meeting/meeting.service';

@Injectable()
class meetingCreatorGuard extends commonLogger implements CanActivate {
  constructor(private readonly meetingService: MeetingService) {
    super();
    this.logger.log('6');
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const [req, res, Next] = context.getArgs();

    const reqUserId = req.user.id;
    const reqParams = req.params;
    const reqBody = req.body;
    const isCreator = true;
    console.log(reqParams);

    return from(this.meetingService.findbyCreator(reqUserId)).pipe(
      map((res) => {
        if (res instanceof Array) {
          const check = res.includes(reqParams.id);

          if (!check) {
            throw new HttpException(
              '只有該會議的創立者才能操作！',
              HttpStatus.NOT_ACCEPTABLE,
            );
          }

          return check;
        }
      }),
    );
  }
}

export default meetingCreatorGuard;
