import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dealer } from '../../domain/entities/dealer.entity';
import { Patient } from 'src/delivery/domain/entities/patient.entity';
import { PatientEntity } from '../typeorm/patient.entity';
import { PatientRepository } from 'src/delivery/domain/repositories/patient.repository.interface';

@Injectable()
export class PatientTypeOrmRepositoryImpl implements PatientRepository {
	constructor(
		@InjectRepository(PatientEntity)
		private readonly ormRepo: Repository<PatientEntity>,
	) {}

	async findById(id: string): Promise<Patient | null> {
		const entity = await this.ormRepo.findOne({ where: { id } });
		return entity ? Patient.fromEntity(entity) : null;
	}

	async findByIdentityCard(identityCard: string): Promise<Patient | null> {
		const entity = await this.ormRepo.findOne({ where: { identityCard } });
		return entity ? Patient.fromEntity(entity) : null;
	}

	async findByCellPhone(cellPhone: number): Promise<Patient | null> {
		const entity = await this.ormRepo.findOne({ where: { cellPhone } });
		return entity ? Patient.fromEntity(entity) : null;
	}

	async save(patient: Patient): Promise<any> {
		const entity = this.ormRepo.create(patient.toPersistence());
		return await this.ormRepo.save(entity);
	}
}
