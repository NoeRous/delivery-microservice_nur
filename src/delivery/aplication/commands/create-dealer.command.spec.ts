import { CreateDealerCommand } from './create-dealer.command';

describe('CreateDealerCommand', () => {
	it('debería crear un comando de creación de repartidor', () => {
		const command = new CreateDealerCommand(
			'123456',
			'Juan',
			'Perez',
			78900000,
		);

		expect(command.identityCard).toBe('123456');
		expect(command.firstName).toBe('Juan');
		expect(command.lastName).toBe('Perez');
		expect(command.cellPhone).toBe(78900000);
	});

	it('debería mantener los datos del comando sin cambios', () => {
		const command = new CreateDealerCommand(
			'654321',
			'Maria',
			'Garcia',
			67800000,
		);

		expect(command.identityCard).toBe('654321');
		expect(command.firstName).toBe('Maria');
		expect(command.lastName).toBe('Garcia');
		expect(command.cellPhone).toBe(67800000);
	});

	it('debería permitir números de carnet alfanuméricos como string', () => {
		const command = new CreateDealerCommand(
			'CE-12345678',
			'Carlos',
			'Lopez',
			77800000,
		);

		expect(command.identityCard).toBe('CE-12345678');
	});

	it('debería crear múltiples comandos independientes', () => {
		const command1 = new CreateDealerCommand(
			'111111',
			'Ana',
			'Silva',
			71111111,
		);
		const command2 = new CreateDealerCommand(
			'222222',
			'Luis',
			'Torres',
			72222222,
		);

		expect(command1.identityCard).not.toBe(command2.identityCard);
		expect(command1.firstName).not.toBe(command2.firstName);
	});
});
