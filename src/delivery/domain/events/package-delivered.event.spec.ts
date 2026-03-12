import { PackageDeliveredEvent } from './package-delivered.event';

describe('PackageDeliveredEvent', () => {
	it('debería crear un evento de paquete entregado', () => {
		const packageId = 'PKG001';
		const deliveryDate = new Date('2024-01-20');

		const event = new PackageDeliveredEvent(packageId, deliveryDate);

		expect(event.packageId).toBe(packageId);
		expect(event.deliveryDate).toEqual(deliveryDate);
	});

	it('debería mantener la información del evento sin cambios', () => {
		const event = new PackageDeliveredEvent(
			'PKG002',
			new Date('2024-01-21'),
		);

		expect(event.packageId).toBe('PKG002');
	});

	it('debería registrar la fecha de entrega correcta', () => {
		const deliveryDate = new Date('2024-01-25T14:30:00');
		const event = new PackageDeliveredEvent('PKG003', deliveryDate);

		expect(event.deliveryDate).toEqual(deliveryDate);
	});

	it('debería permitir múltiples eventos para diferentes paquetes', () => {
		const event1 = new PackageDeliveredEvent(
			'PKG001',
			new Date('2024-01-20'),
		);
		const event2 = new PackageDeliveredEvent(
			'PKG002',
			new Date('2024-01-21'),
		);

		expect(event1.packageId).toBe('PKG001');
		expect(event2.packageId).toBe('PKG002');
		expect(event1.deliveryDate).not.toEqual(event2.deliveryDate);
	});
});
