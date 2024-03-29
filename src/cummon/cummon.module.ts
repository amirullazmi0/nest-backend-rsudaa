import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import * as  winston from 'winston';
import { ValidationService } from './validation.service';

@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            format: winston.format.json(),
            transports: [new winston.transports.Console()]
        }),
        ConfigModule.forRoot({
            isGlobal: true
        })
    ],
    providers: [PrismaService, ValidationService],
    exports: [PrismaService, ValidationService]
})
export class CummonModule { }
