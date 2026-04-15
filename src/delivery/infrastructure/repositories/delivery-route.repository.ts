import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import type { DeliveryRouteRepository } from 'src/delivery/domain/repositories/delivery-route.repository.interface';
import { DeliveryRoute } from 'src/delivery/domain/entities/delivery-route.entity';
import { Package } from 'src/delivery/domain/entities/package.entity';
import { Address } from 'src/delivery/domain/value-objects/address.vo';

import { DealerEntity } from '../typeorm/dealer.entity';
import { DeliveryRouteEntity } from '../typeorm/delivery_routes.entity';
import { Dealer } from 'src/delivery/domain/entities/dealer.entity';

@Injectable()
export class DeliveryRouteTypeOrmRepositoryImpl
	implements DeliveryRouteRepository
{
	constructor(
		@InjectRepository(DeliveryRouteEntity)
		private readonly ormRepo: Repository<DeliveryRouteEntity>,
	) {}

	async save(route: DeliveryRoute): Promise<DeliveryRoute> {
		const entity = this.ormRepo.create({
			id: route.id,
			date: route.date,
			dealer: {
				id: route.dealer.id,
				firstName: route.dealer._name,
				lastName: route.dealer._lastName,
				identityCard: route.dealer._identityCard,
				cellPhone: Number(route.dealer._cellPhone),
			} as DeepPartial<DealerEntity>,
		});
		const saved = await this.ormRepo.save(entity);
		const domainRoute = new DeliveryRoute(
			saved.id,
			saved.date,
			route.dealer,
		);

		console.log('domainRoute-->', domainRoute);

		return domainRoute;
	}

	async findById(id: string): Promise<DeliveryRoute | null> {
		const entity = await this.ormRepo.findOne({
			where: { id },
			relations: ['dealer', 'packages'],
		});
		if (!entity) return null;

		const dealer = Dealer.fromEntity(entity.dealer);
		const route = new DeliveryRoute(entity.id, entity.date, dealer);
		entity.packages.forEach((pkg) =>
			route.addPackage(this.mapToPackage(pkg)),
		);
		return route;
	}

	async findByDealerAndDate(
		dealerId: string,
		date: Date,
	): Promise<DeliveryRoute[]> {
		const entities = await this.ormRepo.find({
			where: {
				dealer: { id: dealerId },
				date,
			},
			relations: ['dealer', 'packages'],
		});

		return entities.map((e) => {
			const dealer = Dealer.fromEntity(e.dealer);
			const route = new DeliveryRoute(e.id, e.date, dealer);
			e.packages.forEach((pkg) =>
				route.addPackage(this.mapToPackage(pkg)),
			);
			return route;
		});
	}

	async delete(id: string): Promise<void> {
		await this.ormRepo.delete(id);
	}

	async findByDate(date: Date): Promise<DeliveryRoute[]> {
		const entities = await this.ormRepo.find({
			where: { date },
			relations: ['dealer', 'packages'],
		});

		return entities.map((e) => {
			const dealer = Dealer.fromEntity(e.dealer);
			const route = new DeliveryRoute(e.id, e.date, dealer);
			e.packages.forEach((pkg) =>
				route.addPackage(this.mapToPackage(pkg)),
			);
			return route;
		});
	}

	private mapToPackage(
		entity: DeliveryRouteEntity['packages'][number],
	): Package {
		return new Package(
			entity.id,
			entity.patientId,
			entity.deliveryDate,
			new Address(
				entity.addressStreet,
				'',
				entity.lat ?? 0,
				entity.lng ?? 0,
			),
			entity.deliveryRouteId,
		);
	}
}
