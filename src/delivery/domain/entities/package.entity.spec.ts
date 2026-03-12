import { Package } from './package.entity';
import { Address } from '../value-objects/address.vo';

describe('Package Entity', () => {
	it('debería crear un paquete con estado pending por defecto', () => {
		const address = new Address(
			'Calle Principal 123',
			'La Paz',
			-16.5,
			-68.1,
		);
		const pkg = new Package(
			'PKG001',
			'PATIENT001',
			new Date('2024-01-20'),
			address,
			'ROUTE001',
		);

		expect(pkg.id).toBe('PKG001');
		expect(pkg.patientId).toBe('PATIENT001');
		expect(pkg.getStatus()).toBe('pending');
		expect(pkg.address).toBe(address);
	});

	it('debería marcar un paquete como en tránsito', () => {
		const address = new Address('Calle Principal 123', 'La Paz');
		const pkg = new Package('PKG002', 'PATIENT002', null, address);

		pkg.markInTransit();

		expect(pkg.getStatus()).toBe('in_transit');
	});

	it('debería marcar un paquete como entregado', () => {
		const address = new Address('Calle Test', 'Cochabamba');
		const pkg = new Package('PKG003', 'PATIENT003', null, address);

		pkg.markDelivered();

		expect(pkg.getStatus()).toBe('delivered');
		expect(pkg.deliveryDate).not.toBeNull();
	});

	it('debería convertir el paquete a objeto de persistencia correctamente', () => {
		const address = new Address(
			'Calle Principal 123',
			'La Paz',
			-16.5,
			-68.1,
		);
		const deliveryDate = new Date('2024-01-20');
		const pkg = new Package(
			'PKG004',
			'PATIENT004',
			deliveryDate,
			address,
			'ROUTE001',
		);

		const persistence = pkg.toPersistence();

		expect(persistence).toEqual({
			id: 'PKG004',
			patientId: 'PATIENT004',
			deliveryDate: deliveryDate,
			status: 'pending',
			addressStreet: 'Calle Principal 123',
			addressCity: 'La Paz',
			lat: -16.5,
			lng: -68.1,
			deliveryRouteId: 'ROUTE001',
		});
	});

	it('debería crear un paquete mediante el método estático create', () => {
		const address = new Address(
			'Avenida Secundaria 456',
			'Cochabamba',
			-17.4,
			-66.2,
		);
		const deliveryDate = new Date('2024-01-21');

		const pkg = Package.create(
			'PKG005',
			'PATIENT005',
			deliveryDate,
			address,
		);

		expect(pkg.id).toBe('PKG005');
		expect(pkg.patientId).toBe('PATIENT005');
		expect(pkg.deliveryDate).toEqual(deliveryDate);
		expect(pkg.address).toEqual(address);
	});

	it('debería mantener el estado pending si no se marcan transiciones de estado', () => {
		const address = new Address('Calle Prueba', 'La Paz');
		const pkg = new Package('PKG006', 'PATIENT006', null, address);

		expect(pkg.getStatus()).toBe('pending');
	});

	it('debería permitir crear paquete sin deliveryRouteId', () => {
		const address = new Address('Calle Sin Ruta', 'Oruro');
		const pkg = new Package('PKG007', 'PATIENT007', new Date(), address);

		expect(pkg.deliveryRouteId).toBeUndefined();
		const persistence = pkg.toPersistence();
		expect(persistence.deliveryRouteId).toBeUndefined();
	});
});
