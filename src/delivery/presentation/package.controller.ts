import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class PackageController {
	public readonly logger = new Logger(PackageController.name);

	constructor(private readonly commandBus: CommandBus) {}

	@MessagePattern('create_package_for_delivery')
	createPackage(): { message: string } {
		this.logger.log('Mensaje recibido de crear paquete');

		return {
			message: 'Create paquete para entrega successfully',
		};
	}
}
