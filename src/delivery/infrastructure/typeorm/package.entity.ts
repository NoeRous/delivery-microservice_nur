// infrastructure/typeorm/package.entity.ts
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { DeliveryRouteEntity } from './delivery_routes.entity';

@Entity('packages')
export class PackageEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'patient_id' })
	patientId: string;

	@Column({ name: 'delivery_date', nullable: true })
	deliveryDate: Date;

	@Column()
	status: string;

	@Column({ nullable: true, name: 'address_street' })
	addressStreet: string;

	@Column({ nullable: true, type: 'float' })
	lat?: number;

	@Column({ nullable: true, type: 'float' })
	lng?: number;

	@Column({ name: 'delivery_route_id', nullable: true })
	deliveryRouteId: string;

	@ManyToOne(() => DeliveryRouteEntity, (route) => route.packages, {
		eager: false,
	})
	@JoinColumn({ name: 'delivery_route_id' })
	deliveryRoute: DeliveryRouteEntity;
}
