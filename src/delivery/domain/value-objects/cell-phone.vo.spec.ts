import { CellPhone } from './cell-phone.vo';

describe('CellPhone Value Object', () => {
	it('debería crear un celular con número válido de 8 dígitos', () => {
		const cellPhone = new CellPhone(78900000);

		expect(cellPhone.getValue()).toBe(78900000);
	});

	it('debería crear un celular desde string válido', () => {
		const cellPhone = new CellPhone('67800000');

		expect(cellPhone.getValue()).toBe(67800000);
	});

	it('debería lanzar error si el string no tiene 8 dígitos', () => {
		expect(() => {
			new CellPhone('123456');
		}).toThrow('El celular debe tener exactamente 8 dígitos numéricos');
	});

	it('debería lanzar error si el string tiene caracteres no numéricos', () => {
		expect(() => {
			new CellPhone('7890000a');
		}).toThrow('El celular debe tener exactamente 8 dígitos numéricos');
	});

	it('debería lanzar error si el número es negativo', () => {
		expect(() => {
			new CellPhone(-78900000);
		}).toThrow('El celular no puede ser negativo');
	});

	it('debería lanzar error si el número no tiene 8 dígitos', () => {
		expect(() => {
			new CellPhone(123456);
		}).toThrow('El celular debe tener exactamente 8 dígitos');
	});

	it('debería lanzar error si el tipo es inválido', () => {
		expect(() => {
			new CellPhone(null as any);
		}).toThrow('Tipo de celular inválido');
	});

	it('debería retornar el celular como string con padding', () => {
		const cellPhone = new CellPhone(12345678);

		const stringValue = cellPhone.toString();

		expect(stringValue).toBe('12345678');
	});

	it('debería retornar el celular sin padding si tiene 8 dígitos', () => {
		const cellPhone = new CellPhone(78900000);

		const stringValue = cellPhone.toString();

		expect(stringValue).toBe('78900000');
	});

	it('debería aceptar números de 8 dígitos en el rango válido', () => {
		const validNumbers = [10000000, 50000000, 99999999];

		validNumbers.forEach((num) => {
			expect(() => {
				new CellPhone(num);
			}).not.toThrow();
		});
	});

	it('debería lanzar error para números con menos de 8 dígitos', () => {
		const invalidNumbers = [1, 100, 1000000, 9999999];

		invalidNumbers.forEach((num) => {
			expect(() => {
				new CellPhone(num);
			}).toThrow();
		});
	});

	it('debería lanzar error para números con más de 8 dígitos', () => {
		expect(() => {
			new CellPhone(100000000);
		}).toThrow('El celular debe tener exactamente 8 dígitos');
	});
});
