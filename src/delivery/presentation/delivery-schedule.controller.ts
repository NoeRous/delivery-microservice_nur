import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
	ClientKafka,
	EventPattern,
	MessagePattern,
	Payload,
} from '@nestjs/microservices';

@Controller()
export class DeliveryScheduleController implements OnModuleInit {
	public readonly logger = new Logger(DeliveryScheduleController.name);

	constructor(
		private readonly commandBus: CommandBus,
		@Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
	) {}

	async onModuleInit() {
		await this.client.connect();
	}

	@MessagePattern('create_schedule_patient')
	createSchedulePatient(): { message: string } {
		this.logger.log('Mensaje recibido de crear calendario de paciente');

		return {
			message: 'Create schedule patient successfully',
		};
	}

	@MessagePattern('get_confirmed_deliveries_by_date')
	deliveryConfirm(@Payload() date: string) {
		this.logger.log(`Listing confirmed deliveries for ${date}`);

		const confirmedDeliveries = [
			{
				deliveryId: 'DEL-001',
				patientName: 'John Doe',
				status: 'CONFIRMED',
			},
			{
				deliveryId: 'DEL-002',
				patientName: 'Jane Smith',
				status: 'CONFIRMED',
			},
		];

		const response = {
			message: 'Confirmed deliveries listed successfully',
			date,
		};

		this.client.emit('confirmed_deliveries_listed', {
			eventName: 'ConfirmedDeliveriesListed',
			eventDate: new Date(),
			data: confirmedDeliveries,
		});

		return response;
	}

	@EventPattern('confirmed_deliveries_listed')
	handleConfirmedDeliveriesListed(@Payload() message: any) {
		this.logger.log('Confirmed deliveries event received');

		console.log('Event payload:', message);
	}
}
