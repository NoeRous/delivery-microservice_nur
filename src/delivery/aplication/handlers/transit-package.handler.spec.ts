/* eslint-disable @typescript-eslint/unbound-method */
import { TransitPackageHandler } from './transit-package.handler';
import { TransitPackageCommand } from '../commands/transit-package.command';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';
import type { PackageRepository } from '../../domain/repositories/package.repository.interface';

describe('TransitPackageHandler', () => {
	it('debería marcar un paquete en tránsito correctamente', async () => {
		const pkg = new Package(
			'PKG001',
			'PATIENT001',
			new Date('2024-01-20'),
			new Address('Calle Principal 123', 'La Paz', -16.5, -68.1),
		);

		const mockRepository: PackageRepository = {
			findById: jest.fn().mockResolvedValue(pkg),
			save: jest.fn().mockResolvedValue(undefined),
			findAllPending: jest.fn(),
		};

		const handler = new TransitPackageHandler(mockRepository);

		const command = new TransitPackageCommand('PKG001');

		await handler.execute(command);

		expect(mockRepository.findById).toHaveBeenCalledWith('PKG001');

		expect(pkg.getStatus()).toBe('in_transit');

		expect(mockRepository.save).toHaveBeenCalledTimes(1);
		expect(mockRepository.save).toHaveBeenCalledWith(pkg);
	});

	it('debería lanzar error si el paquete no existe', async () => {
		const mockRepository: PackageRepository = {
			findById: jest.fn().mockResolvedValue(null),
			save: jest.fn(),
			findAllPending: jest.fn(),
		};

		const handler = new TransitPackageHandler(mockRepository);

		const command = new TransitPackageCommand('PKG_INVALID');

		await expect(handler.execute(command)).rejects.toThrow(
			'Paquete no encontrado',
		);
		expect(mockRepository.save).not.toHaveBeenCalled();
	});
});
