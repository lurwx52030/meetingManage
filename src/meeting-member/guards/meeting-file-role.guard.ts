import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable, combineLatest, from, map } from 'rxjs';
import commonLogger from 'src/common/loggerController';
import { MeetingService } from 'src/meeting/meeting.service';
import { MeetingMemberService } from '../meeting-member.service';

@Injectable()
class meetingFileRoleGuard extends commonLogger implements CanActivate {
  constructor(
    private readonly MeetingMemberService: MeetingMemberService,
    private readonly meetingService: MeetingService,
  ) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const reqUserId = req.user.id;
    const reqParams = req.params;
    const reqBody = req.body;

    const meetingId = reqParams.meetingId || reqParams.path.split('-')[0];
    console.log(reqUserId, meetingId);

    const isMember = from(
      this.MeetingMemberService.findByMeeting(meetingId),
    ).pipe(
      map((res: any[]) => {
        const foundMember = res.find((member) => member.id === reqUserId);
        if (!foundMember) {
          return false;
        }
        return true;
      }),
    );

    const isCreator = from(this.meetingService.findbyCreator(reqUserId)).pipe(
      map((res: any[]) => {
        const foundMeeting = res.find((meeting) => meeting.id === meetingId);
        if (!foundMeeting) {
          return false;
        }
        return true;
      }),
    );

    return combineLatest([isMember, isCreator]).pipe(
      map(([a, b]) => {
        console.log(a, b);
        return a || b;
      }),
      map((r) => {
        if (!r) {
          throw new HttpException(
            '只有該會議的創立者或參與人員才能操作！',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        return true;
      }),
    );
  }
}

export default meetingFileRoleGuard;
