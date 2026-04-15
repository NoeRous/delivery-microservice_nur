/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-member-access */
import { CreateDealerHandler } from './create-dealer.handler';
import { CreateDealerCommand } from '../commands/create-dealer.command';
import { Dealer } from 'src/delivery/domain/entities/dealer.entity';
import type { DealerRepository } from 'src/delivery/domain/repositories/dealer.repository.interface';

describe('CreateDealerCommandHandler', () => {
	it('debería llamar al repositorio y retornar el objeto creado', async () => {
		const mockRepository: DealerRepository = {
			save: jest.fn().mockResolvedValue(undefined),
			findById: jest.fn(),
			findByIdentityCard: jest.fn(),
			findByCellPhone: jest.fn(),
		};

		const handler = new CreateDealerHandler(mockRepository);

		const command = new CreateDealerCommand(
			'123456',
			'Juan',
			'Perez',
			12345678,
		);

		await handler.execute(command);

		const savedDealer = mockRepository.save.mock.calls[0][0] as Dealer;

		expect(savedDealer.toPersistence()).toMatchObject({
			firstName: 'Juan',
			lastName: 'Perez',
			identityCard: '123456',
			cellPhone: 12345678,
		});

		expect(mockRepository.save).toHaveBeenCalledTimes(1);
	});
});
