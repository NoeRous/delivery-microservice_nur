import { DataSource, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UnitOfWorkRepository } from 'src/delivery/domain/repositories/unit-of-work.interface';

import { PackageTypeOrmRepositoryImpl } from './package.repository';
import { DealerTypeOrmRepositoryImpl } from './dealer.repository';
import { DeliveryRouteTypeOrmRepositoryImpl } from './delivery-route.repository';

import { PackageEntity } from '../typeorm/package.entity';
import { DealerEntity } from '../typeorm/dealer.entity';
import { DeliveryRouteEntity } from '../typeorm/delivery_routes.entity';

@Injectable()
export class UnitOfWorkRepositoryImpl implements UnitOfWorkRepository {
	private queryRunner: QueryRunner;

	packageRepository: PackageTypeOrmRepositoryImpl;
	dealerRepository: DealerTypeOrmRepositoryImpl;
	deliveryRouteRepository: DeliveryRouteTypeOrmRepositoryImpl;

	constructor(private readonly dataSource: DataSource) {}

	async start(): Promise<void> {
		this.queryRunner = this.dataSource.createQueryRunner();
		await this.queryRunner.startTransaction();

		const manager = this.queryRunner.manager;

		this.packageRepository = new PackageTypeOrmRepositoryImpl(
			manager.getRepository(PackageEntity),
		);

		this.dealerRepository = new DealerTypeOrmRepositoryImpl(
			manager.getRepository(DealerEntity),
		);

		this.deliveryRouteRepository = new DeliveryRouteTypeOrmRepositoryImpl(
			manager.getRepository(DeliveryRouteEntity),
		);
	}

	async complete(): Promise<void> {
		await this.queryRunner.commitTransaction();
		await this.queryRunner.release();
	}

	async rollback(): Promise<void> {
		await this.queryRunner.rollbackTransaction();
		await this.queryRunner.release();
	}
}
