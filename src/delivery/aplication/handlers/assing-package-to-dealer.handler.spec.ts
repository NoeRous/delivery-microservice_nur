import { AssignPackageToDealerHandler } from './assing-package-to-dealer.handler';
import { AssingPackageToDealerCommand } from '../commands/assign-package-to-dealer.command';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';
import { Dealer } from '../../domain/entities/dealer.entity';
import { DeliveryRoute } from '../../domain/entities/delivery-route.entity';
import { CellPhone } from '../../domain/value-objects/cell-phone.vo';
import { v4 as uuidv4 } from 'uuid';

describe('AssignPackageToDealerHandler', () => {
  it('debería asignar un paquete a un repartidor correctamente', async () => {
    // Crear entidades de prueba
    const dealerId = uuidv4();
    const dealer = new Dealer(
      dealerId,
      '123456',
      'Juan',
      'Perez',
      new CellPhone(78900000)
    );

    const pkg = new Package(
      'PKG001',
      'PATIENT001',
      new Date('2024-01-20'),
      new Address('Calle Principal 123', 'La Paz', -16.5, -68.1)
    );

    const route = new DeliveryRoute(uuidv4(), new Date(), dealer);

    // Mock de repositorios
    const mockPackageRepo = {
      findById: jest.fn().mockResolvedValue(pkg),
      save: jest.fn().mockResolvedValue(true),
    };

    const mockDealerRepo = {
      findById: jest.fn().mockResolvedValue(dealer),
    };

    const mockDeliveryRouteRepo = {
      findByDealerAndDate: jest.fn().mockResolvedValue([route]),
      save: jest.fn().mockResolvedValue(route),
    };

    const handler = new AssignPackageToDealerHandler(
      mockPackageRepo as any,
      mockDealerRepo as any,
      mockDeliveryRouteRepo as any
    );

    const command = new AssingPackageToDealerCommand('PKG001', dealerId);

    await handler.execute(command);

    // Validaciones
    expect(mockPackageRepo.findById).toHaveBeenCalledWith('PKG001');
    expect(mockDealerRepo.findById).toHaveBeenCalledWith(dealerId);
    expect(mockDeliveryRouteRepo.findByDealerAndDate).toHaveBeenCalled();
    expect(mockDeliveryRouteRepo.save).toHaveBeenCalled();
    expect(mockPackageRepo.save).toHaveBeenCalledTimes(1);
    expect(pkg.getStatus()).toBe('in_transit');
  });

  it('debería crear una nueva ruta si no existe una para ese repartidor', async () => {
    const dealerId = uuidv4();
    const dealer = new Dealer(
      dealerId,
      '123456',
      'Juan',
      'Perez',
      new CellPhone(78900000)
    );

    const pkg = new Package(
      'PKG002',
      'PATIENT002',
      new Date('2024-01-21'),
      new Address('Avenida Secundaria 456', 'Cochabamba')
    );

    const mockPackageRepo = {
      findById: jest.fn().mockResolvedValue(pkg),
      save: jest.fn().mockResolvedValue(true),
    };

    const mockDealerRepo = {
      findById: jest.fn().mockResolvedValue(dealer),
    };

    const mockDeliveryRouteRepo = {
      findByDealerAndDate: jest.fn().mockResolvedValue([]),
      save: jest.fn().mockResolvedValue(new DeliveryRoute(uuidv4(), new Date(), dealer)),
    };

    const handler = new AssignPackageToDealerHandler(
      mockPackageRepo as any,
      mockDealerRepo as any,
      mockDeliveryRouteRepo as any
    );

    const command = new AssingPackageToDealerCommand('PKG002', dealerId);

    await handler.execute(command);

    expect(mockDeliveryRouteRepo.save).toHaveBeenCalled();
    expect(pkg.getStatus()).toBe('in_transit');
  });

  it('debería lanzar error si el paquete no existe', async () => {
    const mockPackageRepo = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const mockDealerRepo = {
      findById: jest.fn(),
    };

    const mockDeliveryRouteRepo = {
      findByDealerAndDate: jest.fn(),
    };

    const handler = new AssignPackageToDealerHandler(
      mockPackageRepo as any,
      mockDealerRepo as any,
      mockDeliveryRouteRepo as any
    );

    const command = new AssingPackageToDealerCommand('PKG_INVALID', 'DEALER001');

    await expect(handler.execute(command)).rejects.toThrow('Package not found');
  });

  it('debería lanzar error si el repartidor no existe', async () => {
    const pkg = new Package(
      'PKG003',
      'PATIENT003',
      new Date(),
      new Address('Calle Test', 'La Paz')
    );

    const mockPackageRepo = {
      findById: jest.fn().mockResolvedValue(pkg),
    };

    const mockDealerRepo = {
      findById: jest.fn().mockResolvedValue(null),
    };

    const mockDeliveryRouteRepo = {
      findByDealerAndDate: jest.fn(),
    };

    const handler = new AssignPackageToDealerHandler(
      mockPackageRepo as any,
      mockDealerRepo as any,
      mockDeliveryRouteRepo as any
    );

    const command = new AssingPackageToDealerCommand('PKG003', 'DEALER_INVALID');

    await expect(handler.execute(command)).rejects.toThrow('Repartidor no encontrado');
  });
});
