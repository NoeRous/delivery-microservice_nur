import { Controller, Inject, Logger, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { CreatePatientCommand } from "../aplication/commands/create-patient.command";
import { CommandBus } from "@nestjs/cqrs";


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

@EventPattern('patient.created')
async createPatient(@Payload() message: any) {
  try {
    console.log('MENSAJE RAW:', JSON.stringify(message));

    const data = message.value ?? message;

    console.log('DATA:', data);

    const command = new CreatePatientCommand(
      data.patient.id,
      data.patient.identityCard,
      data.patient.fullName,
      data.patient.lastName,
      data.patient.cellPhone,
    );

    const result = await this.commandBus.execute(command);

    console.log('COMANDO EJECUTADO OK', result);

  } catch (error) {
    console.error('ERROR REAL ===>', error);
  }
}
}