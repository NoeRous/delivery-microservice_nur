import { Patient } from '../entities/patient.entity';

export interface PatientRepository {
	findById(id: string): Promise<Patient | null>;
	findByIdentityCard(identityCard: string): Promise<Patient | null>;
	findByCellPhone(cellPhone: number): Promise<Patient | null>;
	save(patient: Patient): Promise<any>;
}
