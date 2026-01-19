import { CreateRouteWithPackagesCommand } from './create-route-with-packages.command';

describe('CreateRouteWithPackagesCommand', () => {
  it('debería crear un comando de ruta con paquetes', () => {
    const deliveryDate = new Date('2024-01-20');
    const packages = [
      {
        patientId: 'PATIENT001',
        addressStreet: 'Calle Principal 123',
        addressCity: 'La Paz',
        lat: -16.5,
        lng: -68.1,
      },
    ];

    const command = new CreateRouteWithPackagesCommand(
      'DEALER001',
      deliveryDate,
      packages
    );

    expect(command.deliveryId).toBe('DEALER001');
    expect(command.deliveryDate).toEqual(deliveryDate);
    expect(command.packages).toHaveLength(1);
    expect(command.packages[0].patientId).toBe('PATIENT001');
  });

  it('debería manejar múltiples paquetes', () => {
    const packages = [
      {
        patientId: 'PATIENT001',
        addressStreet: 'Calle 1',
        addressCity: 'La Paz',
        lat: -16.5,
        lng: -68.1,
      },
      {
        patientId: 'PATIENT002',
        addressStreet: 'Calle 2',
        addressCity: 'Cochabamba',
        lat: -17.4,
        lng: -66.2,
      },
      {
        patientId: 'PATIENT003',
        addressStreet: 'Calle 3',
        addressCity: 'Oruro',
        lat: -18.1,
        lng: -66.8,
      },
    ];

    const command = new CreateRouteWithPackagesCommand(
      'DEALER002',
      new Date('2024-01-21'),
      packages
    );

    expect(command.packages).toHaveLength(3);
    expect(command.packages[0].patientId).toBe('PATIENT001');
    expect(command.packages[2].patientId).toBe('PATIENT003');
  });

  it('debería manejar ruta con lista vacía de paquetes', () => {
    const command = new CreateRouteWithPackagesCommand(
      'DEALER003',
      new Date('2024-01-22'),
      []
    );

    expect(command.packages).toHaveLength(0);
  });

  it('debería mantener la información sin cambios', () => {
    const deliveryDate = new Date('2024-01-20');
    const packages = [
      {
        patientId: 'PATIENT001',
        addressStreet: 'Calle Test',
        addressCity: 'La Paz',
        lat: -16.5,
        lng: -68.1,
      },
    ];

    const command = new CreateRouteWithPackagesCommand('DEALER001', deliveryDate, packages);

    expect(command.deliveryId).toBe('DEALER001');
    expect(command.deliveryDate).toEqual(deliveryDate);
  });

  it('debería permitir UUIDs como IDs de repartidor', () => {
    const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const command = new CreateRouteWithPackagesCommand(
      uuid,
      new Date('2024-01-20'),
      []
    );

    expect(command.deliveryId).toBe(uuid);
  });
});
