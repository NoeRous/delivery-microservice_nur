// infrastructure/typeorm/dealer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DeliveryRouteEntity } from './delivery_routes.entity';

@Entity('dealers')
export class DealerEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'identity_card' })
	identityCard: string;

	@Column({ name: 'first_name' })
	firstName: string;

	@Column({ name: 'last_name' })
	lastName: string;

	@Column({ name: 'cell_phone' })
	cellPhone: number;

	@OneToMany(() => DeliveryRouteEntity, (route) => route.dealer, {
		cascade: true,
	})
	deliveryRoutes: DeliveryRouteEntity[];
}
