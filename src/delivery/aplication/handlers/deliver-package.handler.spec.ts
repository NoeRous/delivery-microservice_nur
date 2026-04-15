/* eslint-disable @typescript-eslint/unbound-method */
import { DeliverPackageHandler } from './deliver-package.handler';
import { DeliverPackageCommand } from '../commands/deliver-package.command';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';
import type { PackageRepository } from '../../domain/repositories/package.repository.interface';

describe('DeliverPackageHandler', () => {
	it('debería marcar un paquete como entregado correctamente', async () => {
		const pkg = new Package(
			'PKG001',
			'PATIENT001',
			null,
			new Address('Calle Principal 123', 'La Paz', -16.5, -68.1),
		);
		pkg.markInTransit();

		const mockRepository: PackageRepository = {
			findById: jest.fn().mockResolvedValue(pkg),
			save: jest.fn().mockResolvedValue(undefined),
			findAllPending: jest.fn(),
		};

		const handler = new DeliverPackageHandler(mockRepository);

		const command = new DeliverPackageCommand('PKG001');

		await handler.execute(command);

		expect(mockRepository.findById).toHaveBeenCalledWith('PKG001');

		expect(pkg.getStatus()).toBe('delivered');

		expect(mockRepository.save).toHaveBeenCalledTimes(1);
		expect(mockRepository.save).toHaveBeenCalledWith(pkg);

		expect(pkg.deliveryDate).not.toBeNull();
	});

	it('debería lanzar error si el paquete no existe', async () => {
		const mockRepository: PackageRepository = {
			findById: jest.fn().mockResolvedValue(null),
			save: jest.fn(),
			findAllPending: jest.fn(),
		};

		const handler = new DeliverPackageHandler(mockRepository);

		const command = new DeliverPackageCommand('PKG_INVALID');

		await expect(handler.execute(command)).rejects.toThrow(
			'Paquete no encontrado',
		);
		expect(mockRepository.save).not.toHaveBeenCalled();
	});
});
