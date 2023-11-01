import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { MeetingService } from 'src/meeting/meeting.service';

@Injectable()
class meetingCreatorInterceptor implements NestInterceptor {
  constructor(private readonly meetingService: MeetingService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const [req, res, Next] = context.getArgs();

    const reqUserId = req.user.id;
    const reqParams = req.params;
    const reqBody = req.body;
    let isCreator = true;

    this.meetingService.findbyCreator(reqUserId).then((res) => {
      if (res instanceof Array) {
        isCreator =
          res.filter(
            (item) => item.id === reqParams.id || item.id === reqBody.meetingId,
          ).length == 1;
      }
    });

    return next.handle().pipe(
      map((data) => {
        if (isCreator) {
          return data;
        }
        throw new HttpException(
          '只有該會議的創立者才能操作！',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }),
    );
  }
}

export default meetingCreatorInterceptor;
