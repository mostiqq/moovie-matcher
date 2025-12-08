import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { RoomsController } from './rooms.controller'
import { RoomsGateway } from './rooms.gateway'
import { RoomsService } from './rooms.service'

@Module({
	imports: [HttpModule],
	controllers: [RoomsController],
	providers: [RoomsService, RoomsGateway]
})
export class RoomsModule {}
