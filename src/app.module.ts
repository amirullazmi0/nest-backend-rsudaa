import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { SocmedModule } from './socmed/socmed.module';
import { ProfileModule } from './profile/profile.module';
import { LokerModule } from './loker/loker.module';
import { MagangModule } from './magang/magang.module';
import { AppLokerModule } from './app_loker/app_loker.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LogMiddleware } from './log/log.middleware';
import { UserModule } from './user/user.module';
import { CummonModule } from './cummon/cummon.module';


@Module({
  imports: [
    ActivityModule,
    PrismaModule,
    AnnouncementModule,
    SocmedModule,
    ProfileModule,
    LokerModule,
    MagangModule,
    AppLokerModule,
    UserModule,
    CummonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: '/api/*',
      method: RequestMethod.ALL
    })
  }
}
