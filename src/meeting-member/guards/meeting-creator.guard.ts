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
    const req = context.switchToHttp().getRequest();

    const reqUserId = req.user.id;
    const reqParams = req.params;

    const meetingId = reqParams.meetingId || reqParams.id || req.body.meetingId;

    return from(this.meetingService.findbyCreator(reqUserId)).pipe(
      map((res: any[]) => {
        const foundMeeting = res.find((meeting) => meeting.id === meetingId);
        if (!foundMeeting) {
          throw new HttpException(
            '只有該會議的創立者才能操作！',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        return true;
      }),
    );
  }
}

export default meetingCreatorGuard;
