import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AddressController {
	public readonly logger = new Logger(AddressController.name);

	constructor(private readonly commandBus: CommandBus) {}

	@MessagePattern('create_address_patient')
	createAddressPatient(): { message: string } {
		this.logger.log('Mensaje recibido de crear direccion de paciente');

		return {
			message: 'Create address patient successfully',
		};
	}
}
