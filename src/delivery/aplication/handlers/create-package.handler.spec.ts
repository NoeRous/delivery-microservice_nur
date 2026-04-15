/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-member-access */
import { CreatePackageHandler } from './create-package.handler';
import { CreatePackageCommand } from '../commands/create-package.command';
import { Package } from '../../domain/entities/package.entity';
import type { PackageRepository } from '../../domain/repositories/package.repository.interface';

describe('CreatePackageHandler', () => {
	it('debería crear un paquete correctamente', async () => {
		const mockRepository: PackageRepository = {
			save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
			findById: jest.fn(),
			findAllPending: jest.fn(),
		};

		const handler = new CreatePackageHandler(mockRepository);

		const command = new CreatePackageCommand(
			'PATIENT001',
			new Date('2024-01-20'),
			'Calle Principal 123',
			'La Paz',
			-16.5,
			-68.1,
			'ROUTE001',
		);

		await handler.execute(command);

		expect(mockRepository.save).toHaveBeenCalledTimes(1);

		const savedPackage = mockRepository.save.mock.calls[0][0] as Package;

		expect(savedPackage.patientId).toBe('PATIENT001');
		expect(savedPackage.address.street).toBe('Calle Principal 123');
		expect(savedPackage.address.city).toBe('La Paz');
		expect(savedPackage.deliveryRouteId).toBe('ROUTE001');
		expect(savedPackage.getStatus()).toBe('pending');
	});

	it('debería crear un paquete sin deliveryRouteId', async () => {
		const mockRepository: PackageRepository = {
			save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
			findById: jest.fn(),
			findAllPending: jest.fn(),
		};

		const handler = new CreatePackageHandler(mockRepository);

		const command = new CreatePackageCommand(
			'PATIENT002',
			new Date('2024-01-21'),
			'Avenida Secundaria 456',
			'Cochabamba',
		);

		await handler.execute(command);

		expect(mockRepository.save).toHaveBeenCalledTimes(1);

		const savedPackage = mockRepository.save.mock.calls[0][0] as Package;
		expect(savedPackage.deliveryRouteId).toBeUndefined();
	});
});
