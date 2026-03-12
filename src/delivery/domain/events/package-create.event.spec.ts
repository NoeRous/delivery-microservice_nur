import { PackageCreatedEvent } from './package-create.event';

describe('PackageCreatedEvent', () => {
	it('debería crear un evento de paquete creado', () => {
		const packageId = 'PKG001';
		const dealerId = 'DEALER001';
		const deliveryDate = new Date('2024-01-20');

		const event = new PackageCreatedEvent(
			packageId,
			dealerId,
			deliveryDate,
		);

		expect(event.packageId).toBe(packageId);
		expect(event.dealerId).toBe(dealerId);
		expect(event.deliveryDate).toEqual(deliveryDate);
	});

	it('debería mantener la información del evento sin cambios', () => {
		const event = new PackageCreatedEvent(
			'PKG002',
			'DEALER002',
			new Date('2024-01-21'),
		);

		expect(event.packageId).toBe('PKG002');
		expect(event.dealerId).toBe('DEALER002');
	});

	it('debería permitir fechas en el futuro', () => {
		const futureDate = new Date('2025-12-31');
		const event = new PackageCreatedEvent(
			'PKG003',
			'DEALER003',
			futureDate,
		);

		expect(event.deliveryDate).toEqual(futureDate);
	});

	it('debería permitir fechas en el pasado', () => {
		const pastDate = new Date('2020-01-01');
		const event = new PackageCreatedEvent('PKG004', 'DEALER004', pastDate);

		expect(event.deliveryDate).toEqual(pastDate);
	});
});
