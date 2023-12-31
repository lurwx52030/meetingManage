import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Result } from 'src/common/standardResult';
import { Server } from 'ws';
import { MeetingMemberService } from '../meeting-member.service';

@WebSocketGateway()
export class MeetingMemberGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(MeetingMemberGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly meetingMemberService: MeetingMemberService) {}

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('Client connected');
  }

  handleDisconnect(client: any) {
    this.logger.log('Client Disconnected');
  }

  afterInit(server: any) {
    this.logger.log('wbsocket gateway initialized');
  }

  @SubscribeMessage('hello')
  async helloEvent(@MessageBody() data: string) {
    return Result.ok(data, 'ok');
  }

  @SubscribeMessage('member')
  async handleEvent(@MessageBody() meetingId: string) {
    this.logger.log(`member-${meetingId}`);
    const res = await this.meetingMemberService.findByMeeting(meetingId);
    return Result.ok(res, '查詢成功');
  }
}
