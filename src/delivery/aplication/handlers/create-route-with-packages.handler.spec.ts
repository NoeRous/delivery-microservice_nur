import { CreateRouteWithPackagesHandler } from './create-route-with-packages.handler';
import { CreateRouteWithPackagesCommand } from '../commands/create-route-with-packages.command';
import { Dealer } from '../../domain/entities/dealer.entity';
import { DeliveryRoute } from '../../domain/entities/delivery-route.entity';
import { CellPhone } from '../../domain/value-objects/cell-phone.vo';
import { v4 as uuidv4 } from 'uuid';

describe('CreateRouteWithPackagesHandler', () => {
  it('debería crear una ruta con paquetes correctamente', async () => {
    const dealerId = uuidv4();
    const dealer = new Dealer(
      dealerId,
      '123456',
      'Juan',
      'Perez',
      new CellPhone(78900000)
    );

    const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

    // Mock de UnitOfWork
    const mockUnitOfWork = {
      start: jest.fn().mockResolvedValue(true),
      complete: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true),
      dealerRepository: {
        findById: jest.fn().mockResolvedValue(dealer),
      },
      deliveryRouteRepository: {
        save: jest.fn().mockResolvedValue(route),
      },
      packageRepository: {
        save: jest.fn().mockResolvedValue(true),
      },
    };

    const handler = new CreateRouteWithPackagesHandler(mockUnitOfWork as any);

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
      ]
    );

    await handler.execute(command);

    // Validaciones
    expect(mockUnitOfWork.start).toHaveBeenCalled();
    expect(mockUnitOfWork.dealerRepository.findById).toHaveBeenCalledWith(dealerId);
    expect(mockUnitOfWork.deliveryRouteRepository.save).toHaveBeenCalled();
  });

  it('debería lanzar error si el repartidor no existe', async () => {
    const mockUnitOfWork = {
      start: jest.fn().mockResolvedValue(true),
      complete: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true),
      dealerRepository: {
        findById: jest.fn().mockResolvedValue(null),
      },
      rollback: jest.fn().mockResolvedValue(true),
    };

    const handler = new CreateRouteWithPackagesHandler(mockUnitOfWork as any);

    const command = new CreateRouteWithPackagesCommand(
      'DEALER_INVALID',
      new Date('2024-01-20'),
      []
    );

    await expect(handler.execute(command)).rejects.toThrow('Dealer no encontrado');
    expect(mockUnitOfWork.start).toHaveBeenCalled();
  });

  it('debería manejar múltiples paquetes en la ruta', async () => {
    const dealerId = uuidv4();
    const dealer = new Dealer(
      dealerId,
      '123456',
      'Juan',
      'Perez',
      new CellPhone(78900000)
    );

    const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

    const mockUnitOfWork = {
      start: jest.fn().mockResolvedValue(true),
      complete: jest.fn().mockResolvedValue(true),
      rollback: jest.fn().mockResolvedValue(true),
      dealerRepository: {
        findById: jest.fn().mockResolvedValue(dealer),
      },
      deliveryRouteRepository: {
        save: jest.fn().mockResolvedValue(route),
      },
      packageRepository: {
        save: jest.fn().mockResolvedValue(true),
      },
    };

    const handler = new CreateRouteWithPackagesHandler(mockUnitOfWork as any);

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
      ]
    );

    await handler.execute(command);

    expect(mockUnitOfWork.deliveryRouteRepository.save).toHaveBeenCalled();
    // Al menos 2 llamadas al packageRepository (una por cada paquete)
    expect(mockUnitOfWork.packageRepository.save.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
