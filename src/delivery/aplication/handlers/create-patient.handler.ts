import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CellPhone } from '../../domain/value-objects/cell-phone.vo';
import { Inject } from '@nestjs/common';
import type { PatientRepository } from 'src/delivery/domain/repositories/patient.repository.interface';
import { Patient } from 'src/delivery/domain/entities/patient.entity';
import { CreatePatientCommand } from '../commands/create-patient.command';

@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler
	implements ICommandHandler<CreatePatientCommand>
{
	constructor(
		@Inject('PatientRepository')
		private readonly patientRepository: PatientRepository,
	) {}

	async execute(command: CreatePatientCommand): Promise<Patient> {
		const cellPhone = new CellPhone(command.cellPhone);
		const patient = new Patient(
			command.id,
			command.identityCard,
			command.fullName,
			command.lastName,
			cellPhone,
		);
		const result = await this.patientRepository.save(patient);
		return result;
	}
}
