/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-member-access */
import { CreateRouteWithPackagesHandler } from './create-route-with-packages.handler';
import { CreateRouteWithPackagesCommand } from '../commands/create-route-with-packages.command';
import { Dealer } from '../../domain/entities/dealer.entity';
import { DeliveryRoute } from '../../domain/entities/delivery-route.entity';
import { CellPhone } from '../../domain/value-objects/cell-phone.vo';
import { v4 as uuidv4 } from 'uuid';
import type { UnitOfWorkRepository } from '../../domain/repositories/unit-of-work.interface';

describe('CreateRouteWithPackagesHandler', () => {
	it('debería crear una ruta con paquetes correctamente', async () => {
		const dealerId = uuidv4();
		const dealer = new Dealer(
			dealerId,
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);

		const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

		const mockUnitOfWork: UnitOfWorkRepository = {
			start: jest.fn().mockResolvedValue(undefined),
			complete: jest.fn().mockResolvedValue(undefined),
			rollback: jest.fn().mockResolvedValue(undefined),
			dealerRepository: {
				findById: jest.fn().mockResolvedValue(dealer),
				findByIdentityCard: jest.fn(),
				findByCellPhone: jest.fn(),
				save: jest.fn(),
			},
			deliveryRouteRepository: {
				save: jest.fn().mockResolvedValue(route),
				findById: jest.fn(),
				findByDate: jest.fn(),
				delete: jest.fn(),
				findByDealerAndDate: jest.fn(),
			},
			packageRepository: {
				save: jest.fn().mockResolvedValue(undefined),
				findById: jest.fn(),
				findAllPending: jest.fn(),
			},
		};

		const handler = new CreateRouteWithPackagesHandler(mockUnitOfWork);

		const command = new CreateRouteWithPackagesCommand(
			dealerId,
			new Date('2024-01-20'),
			[
				{
					patientId: 'PATIENT001',
					addressStreet: 'Calle Principal 123',
					addressCity: 'La Paz',
					lat: -16.5,
					lng: -68.1,
				},
			],
		);

		await handler.execute(command);

		expect(mockUnitOfWork.start).toHaveBeenCalled();
		expect(mockUnitOfWork.dealerRepository.findById).toHaveBeenCalledWith(
			dealerId,
		);
		expect(mockUnitOfWork.deliveryRouteRepository.save).toHaveBeenCalled();
	});

	it('debería lanzar error si el repartidor no existe', async () => {
		const mockUnitOfWork: UnitOfWorkRepository = {
			start: jest.fn().mockResolvedValue(undefined),
			complete: jest.fn().mockResolvedValue(undefined),
			rollback: jest.fn().mockResolvedValue(undefined),
			dealerRepository: {
				findById: jest.fn().mockResolvedValue(null),
				findByIdentityCard: jest.fn(),
				findByCellPhone: jest.fn(),
				save: jest.fn(),
			},
			deliveryRouteRepository: {
				save: jest.fn(),
				findById: jest.fn(),
				findByDate: jest.fn(),
				delete: jest.fn(),
				findByDealerAndDate: jest.fn(),
			},
			packageRepository: {
				save: jest.fn(),
				findById: jest.fn(),
				findAllPending: jest.fn(),
			},
		};

		const handler = new CreateRouteWithPackagesHandler(mockUnitOfWork);

		const command = new CreateRouteWithPackagesCommand(
			'DEALER_INVALID',
			new Date('2024-01-20'),
			[],
		);

		await expect(handler.execute(command)).rejects.toThrow(
			'Dealer no encontrado',
		);
		expect(mockUnitOfWork.start).toHaveBeenCalled();
	});

	it('debería manejar múltiples paquetes en la ruta', async () => {
		const dealerId = uuidv4();
		const dealer = new Dealer(
			dealerId,
			'123456',
			'Juan',
			'Perez',
			new CellPhone(78900000),
		);

		const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

		const mockUnitOfWork: UnitOfWorkRepository = {
			start: jest.fn().mockResolvedValue(undefined),
			complete: jest.fn().mockResolvedValue(undefined),
			rollback: jest.fn().mockResolvedValue(undefined),
			dealerRepository: {
				findById: jest.fn().mockResolvedValue(dealer),
				findByIdentityCard: jest.fn(),
				findByCellPhone: jest.fn(),
				save: jest.fn(),
			},
			deliveryRouteRepository: {
				save: jest.fn().mockResolvedValue(route),
				findById: jest.fn(),
				findByDate: jest.fn(),
				delete: jest.fn(),
				findByDealerAndDate: jest.fn(),
			},
			packageRepository: {
				save: jest.fn().mockResolvedValue(undefined),
				findById: jest.fn(),
				findAllPending: jest.fn(),
			},
		};

		const handler = new CreateRouteWithPackagesHandler(mockUnitOfWork);

		const command = new CreateRouteWithPackagesCommand(
			dealerId,
			new Date('2024-01-20'),
			[
				{
					patientId: 'PATIENT001',
					addressStreet: 'Calle Principal 123',
					addressCity: 'La Paz',
					lat: -16.5,
					lng: -68.1,
				},
				{
					patientId: 'PATIENT002',
					addressStreet: 'Avenida Secundaria 456',
					addressCity: 'Cochabamba',
					lat: -17.4,
					lng: -66.2,
				},
			],
		);

		await handler.execute(command);

		expect(mockUnitOfWork.deliveryRouteRepository.save).toHaveBeenCalled();
		expect(
			mockUnitOfWork.packageRepository.save.mock.calls.length,
		).toBeGreaterThanOrEqual(2);
	});
});
