import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import commonLogger from 'src/common/loggerController';
import { MeetingService } from 'src/meeting/meeting.service';
import { MeetingMemberService } from '../meeting-member.service';

@Injectable()
class meetingFileRoleGuard extends commonLogger implements NestInterceptor {
  constructor(
    private readonly MeetingMemberService: MeetingMemberService,
    private readonly meetingService: MeetingService,
  ) {
    super();
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const [req, res, Next] = context.getArgs();

    const reqUserId = req.user.id;
    const reqParams = req.params;
    const reqBody = req.body;
    let isMember = true;
    let isCreator = true;

    this.MeetingMemberService.findByMeeting(reqParams.meetingId).then((res) => {
      this.logger.log(reqUserId);
      if (res instanceof Array) {
        isMember = res.filter((item) => item.id === reqUserId).length == 1;
        this.logger.log(`isMember: ${isMember}`);
      }
    });

    this.meetingService.findbyCreator(reqUserId).then((res) => {
      if (res instanceof Array) {
        isCreator =
          res.filter((item) => {
            return item.id === reqParams.meetingId;
          }).length == 1;
        this.logger.log(`isCreator: ${isCreator}`);
      }
    });

    return next.handle().pipe(
      map((data) => {
        this.logger.log(isCreator || isMember);
        if (isCreator || isMember) {
          return data;
        }
        throw new HttpException(
          '只有該會議的創立者或參與人員才能上傳/刪除！',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }),
    );
  }
}

export default meetingFileRoleGuard;
