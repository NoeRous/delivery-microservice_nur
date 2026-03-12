// infrastructure/typeorm/delivery-route.entity.ts
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from 'typeorm';

import { PackageEntity } from './package.entity';
import { DealerEntity } from './dealer.entity';

@Entity('delivery_routes')
export class DeliveryRouteEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	date: Date;

	@ManyToOne(() => DealerEntity, (dealer) => dealer.deliveryRoutes, {
		eager: true,
	})
	@JoinColumn({ name: 'dealer_id' })
	dealer: DealerEntity;

	@OneToMany(() => PackageEntity, (pkg) => pkg.deliveryRoute, {
		cascade: true,
	})
	packages: PackageEntity[];
}
