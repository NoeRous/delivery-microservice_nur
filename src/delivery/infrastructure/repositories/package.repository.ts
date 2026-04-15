import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageRepository } from 'src/delivery/domain/repositories/package.repository.interface';
import { PackageEntity } from '../typeorm/package.entity';

import { Address } from 'src/delivery/domain/value-objects/address.vo';
import { Package } from 'src/delivery/domain/entities/package.entity';

@Injectable()
export class PackageTypeOrmRepositoryImpl implements PackageRepository {
	constructor(
		@InjectRepository(PackageEntity)
		private readonly ormRepo: Repository<PackageEntity>,
	) {}

	async save(pkg: Package): Promise<void> {
		const entity = this.ormRepo.create(
			pkg.toPersistence() as DeepPartial<PackageEntity>,
		);

		await this.ormRepo.save(entity);
	}

	async findById(id: string): Promise<Package | null> {
		const entity = await this.ormRepo.findOne({ where: { id } });
		if (!entity) return null;

		return this.mapToPackage(entity);
	}

	async findAllPending(): Promise<Package[]> {
		const entities = await this.ormRepo.find({
			where: { status: 'pending' },
		});
		return entities.map((e) => this.mapToPackage(e));
	}

	private mapToPackage(entity: PackageEntity): Package {
		return new Package(
			entity.id,
			entity.patientId,
			entity.deliveryDate,
			new Address(
				entity.addressStreet,
				entity.addressStreet,
				entity.lat,
				entity.lng,
			),
			entity.deliveryRouteId,
		);
	}
}
