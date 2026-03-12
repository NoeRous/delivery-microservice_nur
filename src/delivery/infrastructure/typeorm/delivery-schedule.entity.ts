// infrastructure/typeorm/delivery_schedule.entity.ts

import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';

export enum DeliveryScheduleStatus {
	SCHEDULED = 'SCHEDULED',
	CANCELLED = 'CANCELLED',
	DELIVERED = 'DELIVERED',
}

@Entity('delivery_schedules')
export class DeliveryScheduleEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'service_id', type: 'uuid' })
	serviceId: string; // External reference (Servicios MS)

	@Column({ type: 'date' })
	date: Date;

	@Column({ name: 'address_id', type: 'uuid' })
	addressId: string;

	@Column({
		type: 'enum',
		enum: DeliveryScheduleStatus,
		default: DeliveryScheduleStatus.SCHEDULED,
	})
	status: DeliveryScheduleStatus;

	@ManyToOne(() => AddressEntity, (address) => address.deliverySchedules)
	@JoinColumn({ name: 'address_id' })
	address: AddressEntity;

	/*@OneToMany(() => DeliveryEntity, (delivery) => delivery.deliverySchedule)
  deliveries: DeliveryEntity[];*/
}
