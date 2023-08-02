import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LinebotModule } from './linebot/linebot.module';
import { AppConfigModule } from './config/app-config.module';
import { AppHttpLogMiddleware } from './app.http-log/app.http-log.middleware';
import { ScheduleService } from './schedule/schedule.service';
import { AuthModule } from './auth/auth.module';
import { MettingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingroomBorrowModule } from './meetingroom-borrow/meetingroom-borrow.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeetingModule } from './meeting/meeting.module';
import { RoleModule } from './role/role.module';
import dbConfig from './config/db.config';
import { join } from 'path';
import { MeetingMemberModule } from './meeting-member/meeting-member.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AppConfigModule,
    LinebotModule,
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    MeetingModule,
    MettingRoomModule,
    MeetingroomBorrowModule,
    MeetingMemberModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dbConfig('mysql'),
    }),
    RoleModule.register({
      modelPath: join(__dirname, '../casbin/model.conf'),
      policyAdapter: join(__dirname, '../casbin/policy.csv'),
      global: true,
    }),
    MulterModule.register({ dest: join(__dirname, '..', 'uploads') }),
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppHttpLogMiddleware).forRoutes('*');
  }
}
