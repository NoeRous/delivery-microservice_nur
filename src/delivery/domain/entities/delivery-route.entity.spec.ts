import { DeliveryRoute } from './delivery-route.entity';
import { Dealer } from './dealer.entity';
import { Package } from './package.entity';
import { Address } from '../value-objects/address.vo';
import { CellPhone } from '../value-objects/cell-phone.vo';
import { v4 as uuidv4 } from 'uuid';

describe('DeliveryRoute Entity', () => {
	it('debería crear una ruta de entrega correctamente', () => {
		const dealerId = uuidv4();
		const dealer = new Dealer(
			dealerId,
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);
		const date = new Date('2024-01-20');
		const routeId = uuidv4();

		const route = new DeliveryRoute(routeId, date, dealer);

		expect(route.id).toBe(routeId);
		expect(route.date).toEqual(date);
		expect(route.dealer).toBe(dealer);
		expect(route.getPackages()).toEqual([]);
	});

	it('debería agregar un paquete a la ruta', () => {
		const dealer = new Dealer(
			uuidv4(),
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);
		const route = new DeliveryRoute(uuidv4(), new Date(), dealer);
		const pkg = new Package(
			'PKG001',
			'PATIENT001',
			null,
			new Address('Calle Test', 'La Paz'),
		);

		route.addPackage(pkg);

		expect(route.getPackages()).toHaveLength(1);
		expect(route.getPackages()[0]).toBe(pkg);
	});

	it('debería agregar múltiples paquetes a la ruta', () => {
		const dealer = new Dealer(
			uuidv4(),
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);
		const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

		const pkg1 = new Package(
			'PKG001',
			'PATIENT001',
			null,
			new Address('Calle 1', 'La Paz'),
		);
		const pkg2 = new Package(
			'PKG002',
			'PATIENT002',
			null,
			new Address('Calle 2', 'La Paz'),
		);
		const pkg3 = new Package(
			'PKG003',
			'PATIENT003',
			null,
			new Address('Calle 3', 'Cochabamba'),
		);

		route.addPackage(pkg1);
		route.addPackage(pkg2);
		route.addPackage(pkg3);

		expect(route.getPackages()).toHaveLength(3);
		expect(route.getPackages()).toContain(pkg1);
		expect(route.getPackages()).toContain(pkg2);
		expect(route.getPackages()).toContain(pkg3);
	});

	it('debería retornar un array de paquetes', () => {
		const dealer = new Dealer(
			uuidv4(),
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);
		const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

		const packages = route.getPackages();

		expect(Array.isArray(packages)).toBe(true);
	});

	it('debería permitir reutilizar la misma ruta para múltiples paquetes', () => {
		const dealer = new Dealer(
			uuidv4(),
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);
		const date = new Date('2024-01-20');
		const route = new DeliveryRoute(uuidv4(), date, date);

		const pkg1 = new Package(
			'PKG001',
			'PATIENT001',
			null,
			new Address('Calle 1', 'La Paz'),
		);
		const pkg2 = new Package(
			'PKG002',
			'PATIENT002',
			null,
			new Address('Calle 2', 'La Paz'),
		);

		route.addPackage(pkg1);
		route.addPackage(pkg2);

		const deliveryPackages = route.getPackages();
		expect(deliveryPackages.length).toBe(2);
	});
});
