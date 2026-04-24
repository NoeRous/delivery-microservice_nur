import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { DealerRepository } from '../../domain/repositories/dealer.repository.interface';
import { GetAllDealersQuery } from '../queries/get-all-dealers.query';

@QueryHandler(GetAllDealersQuery)
export class GetAllDealersHandler implements IQueryHandler<GetAllDealersQuery> {
	constructor(
		@Inject('DealerRepository')
		private readonly dealerRepository: DealerRepository,
	) {}

	async execute(): Promise<
		{ id: string; identityCard: string; fullName: string; cellPhone: number }[]
	> {
		const dealers = await this.dealerRepository.findAll();
		return dealers.map((dealer) => ({
			id: dealer.id,
			identityCard: dealer.identityCard,
			fullName: dealer.fullName,
			cellPhone: dealer.cellPhone.getValue(),
		}));
	}
}
