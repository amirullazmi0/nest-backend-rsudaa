import { Injectable } from '@nestjs/common';
import { applicationLoker } from '@prisma/client';
import { randomUUID, UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { z } from 'zod';
import * as mime from 'mime-types';
import { error } from 'console';
import { applyLokerRequest } from 'src/model/applyLoker.model';
import { WebResponse } from 'src/model/web.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

const appSchema = z.object({
    id: z.string(),
    email: z.string(),
    fullName: z.string(),
    tanggalLahir: z.string(),
    nik: z.string(),
    no_wa: z.string(),
    lokerId: z.string(),
    sekolah: z.string(),
    jurusan: z.string(),
    jenjang: z.string(),
    address: z.string(),
    fileResume: z.string(),
    fileApply: z.string(),
    fileOther: z.string().optional()
})

@Injectable()
export class AppLokerService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService
    ) { }

    async findAll() {
        try {
            const data = await this.prismaService.applicationLoker.findMany()

            return {
                status: 200,
                message: 'get data succesfully',
                data: {
                    application: data
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: 'get data failed',
                error: error
            }
        }
    }

    async findOne(
        id: UUID
    ): Promise<applicationLoker | any> {
        try {
            const data = await this.prismaService.applicationLoker.findUnique({
                where: { id: id },
                include: {
                    loker: true
                }
            })

            return {
                status: 200,
                message: 'get data successfully',
                data: {
                    data: data
                }
            }
        } catch (error) {
            return {
                status: 500,
                message: 'get data failed',
                error: error
            }
        }
    }

    async post(req: applyLokerRequest): Promise<WebResponse<applicationLoker | any>> {
        try {
            const id = randomUUID()
            let { address, email, fullName, tanggalLahir, jenjang, jurusan, lokerId, nik, no_wa, sekolah, fileResume, fileApply, fileOther } = req
            // let { fileApply, fileResume, fileOther } = files
            const validation = appSchema.parse({
                id: id,
                fullName: fullName,
                email: email,
                tanggalLahir: tanggalLahir,
                address: address,
                jenjang: jenjang,
                jurusan: jurusan,
                lokerId: lokerId,
                nik: nik,
                no_wa: no_wa,
                sekolah: sekolah,
                fileResume: fileResume,
                fileApply: fileApply,
                fileOther: fileOther
            })

            const bornDay: Date = new Date(validation.tanggalLahir)


            // const dataLoker = await this.prismaService.loker.findUnique({
            //     where: { id: validation.lokerId },
            //     include: {
            //         applicationLoker: {
            //             where: {
            //                 email: validation.email
            //             }
            //         }
            //     }
            // })

            // if (!dataLoker) {
            //     return {
            //         status: 500,
            //         message: `post data failed`,
            //         errors: `data loker not found, please select loker`
            //     }
            // } else {
            //     if (dataLoker.applicationLoker.length > 0) {
            //         return {
            //             status: 500,
            //             message: `post data failed`,
            //             errors: {
            //                 path: `email`,
            //                 message: `${validation.email} has applied loker ${dataLoker.name}`
            //             }
            //         }
            //     }
            // }

            const create = await this.prismaService.applicationLoker.create({
                data: {
                    id: validation.id,
                    tanggalLahir: bornDay,
                    no_wa: validation.no_wa,
                    nik: validation.nik,
                    email: validation.email,
                    fullName: validation.fullName,
                    lokerId: validation.lokerId,
                    sekolah: validation.sekolah,
                    jurusan: validation.jurusan,
                    jenjang: validation.jenjang,
                    address: validation.address,
                    fileResume: validation.fileResume,
                    fileApply: validation.fileApply,
                    fileOther: validation.fileOther
                }
            })
            return {
                status: 200,
                success: true,
                message: 'post data successfully',
                data: create
            }
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: 'post data failed',
                errors: error
            }
        }
    }
}
