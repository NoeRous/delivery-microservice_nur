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
  async createPatient(@Payload() event: any) {
    try {
      const firstParse = JSON.parse(event);
      const data =
        typeof firstParse === 'string'
          ? JSON.parse(firstParse)
          : firstParse;

      const command = new CreatePatientCommand(
        data.id,
        data.identityCard,
        data.fullName,
        data.lastName,
        data.cellPhone,
      );

      await this.commandBus.execute(command);

    } catch (error) {
      console.error('ERROR REAL ===>', error);
    }
  }
}

