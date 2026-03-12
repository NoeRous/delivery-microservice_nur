import { TransitPackageCommand } from './transit-package.command';

describe('TransitPackageCommand', () => {
	it('debería crear un comando de transporte de paquete', () => {
		const command = new TransitPackageCommand('PKG001');

		expect(command.packageId).toBe('PKG001');
	});

	it('debería mantener el ID del paquete sin cambios', () => {
		const command = new TransitPackageCommand('PKG_TEST_123');

		expect(command.packageId).toBe('PKG_TEST_123');
	});

	it('debería permitir diferentes IDs de paquete', () => {
		const command1 = new TransitPackageCommand('PKG001');
		const command2 = new TransitPackageCommand('PKG002');

		expect(command1.packageId).not.toBe(command2.packageId);
	});

	it('debería crear múltiples comandos independientes', () => {
		const commands = [
			new TransitPackageCommand('PKG001'),
			new TransitPackageCommand('PKG002'),
			new TransitPackageCommand('PKG003'),
		];

		expect(commands).toHaveLength(3);
		expect(commands[0].packageId).toBe('PKG001');
		expect(commands[1].packageId).toBe('PKG002');
		expect(commands[2].packageId).toBe('PKG003');
	});
});
