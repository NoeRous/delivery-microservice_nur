// infrastructure/typeorm/address.entity.ts

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { DeliveryScheduleEntity } from './delivery-schedule.entity';
import { PatientEntity } from './patient.entity';

@Entity('addresses')
export class AddressEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'patient_id', type: 'uuid' })
	patientId: string; // External reference (Paciente MS)

	@Column({ type: 'decimal', precision: 10, scale: 7 })
	latitude: number;

	@Column({ type: 'decimal', precision: 10, scale: 7 })
	longitude: number;

	@Column({ type: 'varchar', length: 255 })
	description: string;

	@Column({ type: 'boolean', default: true })
	active: boolean;

	@ManyToOne(() => PatientEntity, (patient) => patient.addresses)
	@JoinColumn({ name: 'patient_id' })
	patient: PatientEntity;

	@OneToMany(() => DeliveryScheduleEntity, (schedule) => schedule.address)
	deliverySchedules: DeliveryScheduleEntity[];
}
