import { DeliverPackageHandler } from './deliver-package.handler';
import { DeliverPackageCommand } from '../commands/deliver-package.command';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';

describe('DeliverPackageHandler', () => {
	it('debería marcar un paquete como entregado correctamente', async () => {
		// Crear un paquete de prueba en tránsito
		const pkg = new Package(
			'PKG001',
			'PATIENT001',
			null,
			new Address('Calle Principal 123', 'La Paz', -16.5, -68.1),
		);
		pkg.markInTransit();

		// Mock del repositorio
		const mockRepository = {
			findById: jest.fn().mockResolvedValue(pkg),
			save: jest.fn().mockResolvedValue(true),
		};

		const handler = new DeliverPackageHandler(mockRepository as any);

		const command = new DeliverPackageCommand('PKG001');

		await handler.execute(command);

		// Validar que findById fue llamado
		expect(mockRepository.findById).toHaveBeenCalledWith('PKG001');

		// Validar que el paquete fue marcado como entregado
		expect(pkg.getStatus()).toBe('delivered');

		// Validar que save fue llamado
		expect(mockRepository.save).toHaveBeenCalledTimes(1);
		expect(mockRepository.save).toHaveBeenCalledWith(pkg);

		// Validar que se estableció la fecha de entrega
		expect(pkg.deliveryDate).not.toBeNull();
	});

	it('debería lanzar error si el paquete no existe', async () => {
		const mockRepository = {
			findById: jest.fn().mockResolvedValue(null),
			save: jest.fn(),
		};

		const handler = new DeliverPackageHandler(mockRepository as any);

		const command = new DeliverPackageCommand('PKG_INVALID');

		await expect(handler.execute(command)).rejects.toThrow(
			'Paquete no encontrado',
		);
		expect(mockRepository.save).not.toHaveBeenCalled();
	});
});
