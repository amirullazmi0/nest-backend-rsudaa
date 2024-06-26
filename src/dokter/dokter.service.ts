import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/cummon/validation.service';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class DokterService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private configService: ConfigService
    ) { }
    async findAll(data: any): Promise<WebResponse<any>> {
        try {
            const baseUrl = this.configService.get('SIMRS_URL')
            const usernameSIMRS = this.configService.get('SIMRS_USERNAME')
            const passwordSIMRS = this.configService.get('SIMRS_PASSWORD')

            const loginSIMRS = await axios.post(`${baseUrl}/api/auth/login`, {
                username: usernameSIMRS,
                password: passwordSIMRS
            })

            let simrsToken = ''

            if (loginSIMRS && loginSIMRS.data && loginSIMRS.data.data) {
                simrsToken = loginSIMRS.data.data.refresh_token
            }

            const dataDokter = await axios.get(`${baseUrl}/api/ralan/drpoli`, {
                headers: {
                    Authorization: `bearer ${simrsToken}`
                }
            })

            let dokter = []

            if (dataDokter && dataDokter.data) {
                const dokteritem = dataDokter.data.data
                for (let i = 0; i < dokteritem.length; i++) {
                    for (let j = 0; j < dokteritem[i].dokter.length; j++) {
                        const data = {
                            name: dokteritem[i].dokter[j]
                        }
                        dokter.push(data)
                    }
                }
                return {
                    success: true,
                    message: `get data successfully`,
                    data: dokter
                }
            }

            return {
                success: false,
                message: `get data failed`,
            }

        } catch (error) {

        }
    }
}
