import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppHttpLogMiddleware } from './app.http-log/app.http-log.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app-config.module';
import dbConfig from './config/db.config';
import { LinebotModule } from './linebot/linebot.module';
import { MeetingFileModule } from './meeting-file/meeting-file.module';
import { MeetingMemberModule } from './meeting-member/meeting-member.module';
import { MettingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingModule } from './meeting/meeting.module';
import { RoleModule } from './role/role.module';
import { ScheduleService } from './schedule/schedule.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AppConfigModule,
    LinebotModule,
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    MeetingModule,
    MettingRoomModule,
    MeetingMemberModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: dbConfig('mysql_railway'),
    }),
    RoleModule.register({
      modelPath: join(__dirname, '../casbin/model.conf'),
      policyAdapter: join(__dirname, '../casbin/policy.csv'),
      global: true,
    }),
    MeetingFileModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppHttpLogMiddleware).forRoutes('*');
  }
}
