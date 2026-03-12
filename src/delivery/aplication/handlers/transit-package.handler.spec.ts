import { TransitPackageHandler } from './transit-package.handler';
import { TransitPackageCommand } from '../commands/transit-package.command';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';

describe('TransitPackageHandler', () => {
	it('debería marcar un paquete en tránsito correctamente', async () => {
		// Crear un paquete de prueba
		const pkg = new Package(
			'PKG001',
			'PATIENT001',
			new Date('2024-01-20'),
			new Address('Calle Principal 123', 'La Paz', -16.5, -68.1),
		);

		// Mock del repositorio
		const mockRepository = {
			findById: jest.fn().mockResolvedValue(pkg),
			save: jest.fn().mockResolvedValue(true),
		};

		const handler = new TransitPackageHandler(mockRepository as any);

		const command = new TransitPackageCommand('PKG001');

		await handler.execute(command);

		// Validar que findById fue llamado
		expect(mockRepository.findById).toHaveBeenCalledWith('PKG001');

		// Validar que el paquete fue marcado como en tránsito
		expect(pkg.getStatus()).toBe('in_transit');

		// Validar que save fue llamado
		expect(mockRepository.save).toHaveBeenCalledTimes(1);
		expect(mockRepository.save).toHaveBeenCalledWith(pkg);
	});

	it('debería lanzar error si el paquete no existe', async () => {
		const mockRepository = {
			findById: jest.fn().mockResolvedValue(null),
			save: jest.fn(),
		};

		const handler = new TransitPackageHandler(mockRepository as any);

		const command = new TransitPackageCommand('PKG_INVALID');

		await expect(handler.execute(command)).rejects.toThrow(
			'Paquete no encontrado',
		);
		expect(mockRepository.save).not.toHaveBeenCalled();
	});
});
