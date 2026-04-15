import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { CreatePatientCommand } from '../aplication/commands/create-patient.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('patient')
export class PatientController implements OnModuleInit {
	private readonly logger = new Logger(PatientController.name);

	constructor(
		@Inject('KAFKA_SERVICE')
		private readonly kafkaClient: ClientKafka,
		private readonly commandBus: CommandBus,
	) {}

	async onModuleInit() {
		// this.kafkaClient.subscribeToResponseOf('patient.created'); // 👈 IMPORTANTE
		await this.kafkaClient.connect();
	}

	@EventPattern('outbox.event.Advice')
	async createPatient(@Payload() event: string): Promise<void> {
		try {
			const parsed = JSON.parse(event) as Record<string, string>;
			const data: Record<string, string> =
				typeof parsed === 'object' && parsed !== null
					? parsed
					: {
							id: '',
							identityCard: '',
							fullName: '',
							lastName: '',
							cellPhone: '',
						};

			const command = new CreatePatientCommand(
				data.id || '',
				data.identityCard || '',
				data.fullName || '',
				data.lastName || '',
				data.cellPhone || '',
			);

			await this.commandBus.execute(command);
		} catch (error) {
			console.error('ERROR REAL ===>', error);
		}
	}
}
