import { CreatePackageHandler } from './create-package.handler';
import { CreatePackageCommand } from '../commands/create-package.command';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';

describe('CreatePackageHandler', () => {
  it('debería crear un paquete correctamente', async () => {
    // Mock del repositorio
    const mockRepository = {
      save: jest.fn().mockResolvedValue(true),
    };

    const handler = new CreatePackageHandler(mockRepository as any);

    const command = new CreatePackageCommand(
      'PATIENT001',           // patientId
      new Date('2024-01-20'), // deliveryDate
      'Calle Principal 123',  // addressStreet
      'La Paz',               // addressCity
      -16.5,                  // lat
      -68.1,                  // lng
      'ROUTE001'              // deliveryRouteId
    );

    // Ejecutar handler
    await handler.execute(command);

    // Validar que save fue llamado
    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    // Obtener el paquete que se pasó al save
    const savedPackage = mockRepository.save.mock.calls[0][0] as Package;

    // Validar propiedades del paquete
    expect(savedPackage.patientId).toBe('PATIENT001');
    expect(savedPackage.address.street).toBe('Calle Principal 123');
    expect(savedPackage.address.city).toBe('La Paz');
    expect(savedPackage.deliveryRouteId).toBe('ROUTE001');
    expect(savedPackage.getStatus()).toBe('pending');
  });

  it('debería crear un paquete sin deliveryRouteId', async () => {
    const mockRepository = {
      save: jest.fn().mockResolvedValue(true),
    };

    const handler = new CreatePackageHandler(mockRepository as any);

    const command = new CreatePackageCommand(
      'PATIENT002',
      new Date('2024-01-21'),
      'Avenida Secundaria 456',
      'Cochabamba'
    );

    await handler.execute(command);

    expect(mockRepository.save).toHaveBeenCalledTimes(1);

    const savedPackage = mockRepository.save.mock.calls[0][0] as Package;
    expect(savedPackage.deliveryRouteId).toBeUndefined();
  });
});
