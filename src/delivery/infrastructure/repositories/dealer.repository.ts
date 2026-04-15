import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { DealerRepository } from '../../domain/repositories/dealer.repository.interface';
import { Dealer } from '../../domain/entities/dealer.entity';
import { DealerEntity } from '../typeorm/dealer.entity';

@Injectable()
export class DealerTypeOrmRepositoryImpl implements DealerRepository {
	constructor(
		@InjectRepository(DealerEntity)
		private readonly ormRepo: Repository<DealerEntity>,
	) {}

	async findById(id: string): Promise<Dealer | null> {
		const entity = await this.ormRepo.findOne({ where: { id } });
		return entity ? Dealer.fromEntity(entity) : null;
	}

	async findByIdentityCard(identityCard: string): Promise<Dealer | null> {
		const entity = await this.ormRepo.findOne({ where: { identityCard } });
		return entity ? Dealer.fromEntity(entity) : null;
	}

	async findByCellPhone(cellPhone: number): Promise<Dealer | null> {
		const entity = await this.ormRepo.findOne({ where: { cellPhone } });
		return entity ? Dealer.fromEntity(entity) : null;
	}

	async save(dealer: Dealer): Promise<void> {
		const entity = this.ormRepo.create({
			id: dealer.id,
			identityCard: dealer.identityCard,
			firstName: dealer.fullName.split(' ')[0],
			lastName: dealer.fullName.split(' ')[1] || '',
			cellPhone: dealer.cellPhone.getValue(),
		});

		await this.ormRepo.save(entity);
	}
}
