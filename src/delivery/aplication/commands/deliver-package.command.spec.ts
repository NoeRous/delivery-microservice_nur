import { DeliverPackageCommand } from './deliver-package.command';

describe('DeliverPackageCommand', () => {
	it('debería crear un comando de entrega de paquete', () => {
		const command = new DeliverPackageCommand('PKG001');

		expect(command.packageId).toBe('PKG001');
	});

	it('debería mantener el ID del paquete sin cambios', () => {
		const command = new DeliverPackageCommand('PKG_DELIVERY_001');

		expect(command.packageId).toBe('PKG_DELIVERY_001');
	});

	it('debería permitir diferentes IDs de paquete', () => {
		const command1 = new DeliverPackageCommand('PKG001');
		const command2 = new DeliverPackageCommand('PKG002');

		expect(command1.packageId).not.toBe(command2.packageId);
	});

	it('debería crear múltiples comandos independientes', () => {
		const commands = [
			new DeliverPackageCommand('PKG001'),
			new DeliverPackageCommand('PKG002'),
			new DeliverPackageCommand('PKG003'),
		];

		expect(commands).toHaveLength(3);
		expect(commands[0].packageId).toBe('PKG001');
		expect(commands[2].packageId).toBe('PKG003');
	});

	it('debería permitir UUIDs como IDs de paquete', () => {
		const uuidFormat = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
		const command = new DeliverPackageCommand(uuidFormat);

		expect(command.packageId).toBe(uuidFormat);
	});
});
