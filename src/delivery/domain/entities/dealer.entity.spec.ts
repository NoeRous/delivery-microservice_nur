import { Dealer } from './dealer.entity';
import { CellPhone } from '../value-objects/cell-phone.vo';
import { v4 as uuidv4 } from 'uuid';

describe('Dealer Entity', () => {
	it('debería crear un repartidor correctamente', () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);
		const dealer = new Dealer(
			dealerId,
			'123456',
			'Juan',
			'Perez',
			cellPhone,
		);

		expect(dealer.id).toBe(dealerId);
		expect(dealer.identityCard).toBe('123456');
		expect(dealer.fullName).toBe('Juan Perez');
		expect(dealer.cellPhone.getValue()).toBe(78900000);
	});

	it('debería lanzar error si el ID es vacío', () => {
		const cellPhone = new CellPhone(78900000);

		expect(() => {
			new Dealer('', '123456', 'Juan', 'Perez', cellPhone);
		}).toThrow('El ID del repartidor es obligatorio');
	});

	it('debería lanzar error si el carnet es vacío', () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);

		expect(() => {
			new Dealer(dealerId, '', 'Juan', 'Perez', cellPhone);
		}).toThrow('El número de carnet es obligatorio');
	});

	it('debería lanzar error si el nombre es vacío', () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);

		expect(() => {
			new Dealer(dealerId, '123456', '', 'Perez', cellPhone);
		}).toThrow('El nombre es obligatorio');
	});

	it('debería lanzar error si el apellido es vacío', () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);

		expect(() => {
			new Dealer(dealerId, '123456', 'Juan', '', cellPhone);
		}).toThrow('El apellido es obligatorio');
	});

	it('debería convertir el repartidor a objeto de persistencia correctamente', () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);
		const dealer = new Dealer(
			dealerId,
			'123456',
			'Juan',
			'Perez',
			cellPhone,
		);

		const persistence = dealer.toPersistence();

		expect(persistence).toEqual({
			id: dealerId,
			identityCard: '123456',
			firstName: 'Juan',
			lastName: 'Perez',
			cellPhone: 78900000,
		});
	});

	it('debería crear un repartidor desde una entidad TypeORM', () => {
		const dealerEntity = {
			id: 'DEALER001',
			identityCard: '654321',
			firstName: 'Maria',
			lastName: 'Garcia',
			cellPhone: 67800000,
		};

		const dealer = Dealer.fromEntity(dealerEntity as any);

		expect(dealer.id).toBe('DEALER001');
		expect(dealer.identityCard).toBe('654321');
		expect(dealer.fullName).toBe('Maria Garcia');
		expect(dealer.cellPhone.getValue()).toBe(67800000);
	});

	it('debería validar que los repartidores sean únicos por carnet', async () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);
		const dealer = new Dealer(
			dealerId,
			'123456',
			'Juan',
			'Perez',
			cellPhone,
		);

		// Mock del repositorio que simula un repartidor existente
		const mockRepository = {
			findById: jest.fn().mockResolvedValue(dealer),
			findByCellPhone: jest.fn().mockResolvedValue(null),
		};

		await expect(
			Dealer.ensureDealerIsUnique(
				mockRepository as any,
				'123456',
				new CellPhone(98765432),
			),
		).rejects.toThrow('Ya existe un repartidor con el carnet 123456');
	});

	it('debería validar que los repartidores sean únicos por celular', async () => {
		const dealerId = uuidv4();
		const cellPhone = new CellPhone(78900000);

		const mockRepository = {
			findById: jest.fn().mockResolvedValue(null),
			findByCellPhone: jest.fn().mockResolvedValue(true),
		};

		await expect(
			Dealer.ensureDealerIsUnique(
				mockRepository as any,
				'111111',
				cellPhone,
			),
		).rejects.toThrow('Ya existe un repartidor con el celular 78900000');
	});

	it('debería permitir crear un repartidor único', async () => {
		const mockRepository = {
			findById: jest.fn().mockResolvedValue(null),
			findByCellPhone: jest.fn().mockResolvedValue(null),
		};

		// No debe lanzar error
		await expect(
			Dealer.ensureDealerIsUnique(
				mockRepository as any,
				'999999',
				new CellPhone(77777777),
			),
		).resolves.toBeUndefined();
	});
});
