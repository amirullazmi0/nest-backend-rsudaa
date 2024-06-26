import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { linkAplikasi } from '@prisma/client';
import { randomUUID } from 'crypto';
import { aplikasiRequest } from 'src/model/aplikasi.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { z } from 'zod';


const AplikasiSchema = z.object({
    name: z.string().min(1).max(250),
    link: z.string().min(1).max(1000).optional(),
})

@Injectable()
export class LinkAplikasiService {
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService
    ) { }

    async getData(id?: string): Promise<WebResponse<linkAplikasi | linkAplikasi[]>> {
        let aplikasi: linkAplikasi | linkAplikasi[] = await this.prismaService.linkAplikasi.findMany({
            orderBy: { createdAt: 'desc' }
        })

        if (id) {
            aplikasi = await this.prismaService.linkAplikasi.findFirst({
                where: { id: id },
                orderBy: { createdAt: 'desc' }
            })

            if (!aplikasi) {
                return {
                    success: false,
                    message: `data with id ${name} not found`
                }
            }
        }

        return {
            success: true,
            message: `get data successfully`,
            data: aplikasi
        }
    }

    async postData(req: aplikasiRequest): Promise<WebResponse<linkAplikasi>> {
        const { name, link } = req
        const id = randomUUID()

        const validate = AplikasiSchema.parse({
            name: name,
            link: link
        })


        const saveData = await this.prismaService.linkAplikasi.create({
            data: {
                id: id,
                name: validate.name,
                link: validate.link
            }
        })

        return {
            success: true,
            message: `create data successfully`,
            data: saveData
        }
    }

    async updateData(id: string, req: aplikasiRequest): Promise<WebResponse<linkAplikasi>> {
        let aplikasi = await this.prismaService.linkAplikasi.findUnique({
            where: { id: id }
        })

        if (!aplikasi) {
            return {
                success: false,
                message: `data with id ${name} not found`
            }
        }

        const validate = AplikasiSchema.parse({
            name: req.name ? req.name : aplikasi.name,
            link: req.link ? req.link : aplikasi.link
        })

        const updateData = await this.prismaService.linkAplikasi.update({
            where: { id: id },
            data: {
                name: validate.name,
                link: validate.link
            }
        })

        return {
            success: true,
            message: `update data successfully`,
            data: updateData
        }
    }

    async deleteData(id: string): Promise<WebResponse<any>> {
        const unique = await this.prismaService.linkAplikasi.findUnique({
            where: { id: id }
        })

        if (!unique) {
            return {
                success: false,
                message: `data with id ${id} not found`
            }
        }

        const deleteData = await this.prismaService.linkAplikasi.delete({
            where: { id: id }
        })

        console.log(deleteData);

        return {
            success: true,
            message: `delete data successfully`
        }
    }
}
