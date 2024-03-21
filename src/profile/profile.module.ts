import { Module } from '@nestjs/common';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule { }
