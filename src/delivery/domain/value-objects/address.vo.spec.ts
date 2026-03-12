import { Address } from './address.vo';

describe('Address Value Object', () => {
	it('debería crear una dirección correctamente', () => {
		const address = new Address(
			'Calle Principal 123',
			'La Paz',
			-16.5,
			-68.1,
		);

		expect(address.street).toBe('Calle Principal 123');
		expect(address.city).toBe('La Paz');
		expect(address.lat).toBe(-16.5);
		expect(address.lng).toBe(-68.1);
	});

	it('debería crear una dirección sin coordenadas', () => {
		const address = new Address('Avenida Secundaria 456', 'Cochabamba');

		expect(address.street).toBe('Avenida Secundaria 456');
		expect(address.city).toBe('Cochabamba');
		expect(address.lat).toBeUndefined();
		expect(address.lng).toBeUndefined();
	});

	it('debería lanzar error si la calle está vacía', () => {
		expect(() => {
			new Address('', 'La Paz');
		}).toThrow('Street is required');
	});

	it('debería lanzar error si la calle es solo espacios', () => {
		expect(() => {
			new Address('   ', 'La Paz');
		}).toThrow('Street is required');
	});

	it('debería lanzar error si la ciudad está vacía', () => {
		expect(() => {
			new Address('Calle Principal 123', '');
		}).toThrow('City is required');
	});

	it('debería lanzar error si la ciudad es solo espacios', () => {
		expect(() => {
			new Address('Calle Principal 123', '   ');
		}).toThrow('City is required');
	});

	it('debería retornar la dirección completa formateada', () => {
		const address = new Address('Calle Test 789', 'Sucre');

		const fullAddress = address.fullAddress();

		expect(fullAddress).toBe('Calle Test 789, Sucre');
	});

	it('debería permitir coordenadas cero', () => {
		const address = new Address('Calle Central', 'La Paz', 0, 0);

		expect(address.lat).toBe(0);
		expect(address.lng).toBe(0);
	});

	it('debería permitir coordenadas negativas', () => {
		const address = new Address('Calle Sur', 'Oruro', -16.5, -68.1);

		expect(address.lat).toBe(-16.5);
		expect(address.lng).toBe(-68.1);
	});

	it('debería permitir coordenadas positivas', () => {
		const address = new Address('Calle Norte', 'Santa Cruz', 17.4, 63.2);

		expect(address.lat).toBe(17.4);
		expect(address.lng).toBe(63.2);
	});
});
