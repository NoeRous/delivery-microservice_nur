import { CreatePackageCommand } from './create-package.command';

describe('CreatePackageCommand', () => {
  it('debería crear un comando de creación de paquete con todos los parámetros', () => {
    const command = new CreatePackageCommand(
      'PATIENT001',
      new Date('2024-01-20'),
      'Calle Principal 123',
      'La Paz',
      -16.5,
      -68.1,
      'ROUTE001'
    );

    expect(command.patientId).toBe('PATIENT001');
    expect(command.addressStreet).toBe('Calle Principal 123');
    expect(command.addressCity).toBe('La Paz');
    expect(command.lat).toBe(-16.5);
    expect(command.lng).toBe(-68.1);
    expect(command.deliveryRouteId).toBe('ROUTE001');
  });

  it('debería crear un comando de creación de paquete sin coordenadas', () => {
    const command = new CreatePackageCommand(
      'PATIENT002',
      new Date('2024-01-21'),
      'Avenida Secundaria 456',
      'Cochabamba'
    );

    expect(command.patientId).toBe('PATIENT002');
    expect(command.lat).toBeUndefined();
    expect(command.lng).toBeUndefined();
    expect(command.deliveryRouteId).toBeUndefined();
  });

  it('debería crear un comando sin deliveryRouteId', () => {
    const command = new CreatePackageCommand(
      'PATIENT003',
      new Date('2024-01-22'),
      'Calle Test',
      'Oruro',
      -17.4,
      -66.2
    );

    expect(command.deliveryRouteId).toBeUndefined();
  });

  it('debería mantener los datos del comando sin cambios', () => {
    const date = new Date('2024-01-20');
    const command = new CreatePackageCommand(
      'PATIENT004',
      date,
      'Calle Principal',
      'La Paz',
      -16.5,
      -68.1
    );

    expect(command.patientId).toBe('PATIENT004');
    expect(command.deliveryDate).toEqual(date);
  });

  it('debería permitir coordenadas cero', () => {
    const command = new CreatePackageCommand(
      'PATIENT005',
      new Date(),
      'Calle Central',
      'La Paz',
      0,
      0
    );

    expect(command.lat).toBe(0);
    expect(command.lng).toBe(0);
  });

  it('debería crear múltiples comandos independientes', () => {
    const command1 = new CreatePackageCommand('PAT001', new Date('2024-01-20'), 'Calle 1', 'La Paz');
    const command2 = new CreatePackageCommand('PAT002', new Date('2024-01-21'), 'Calle 2', 'Cochabamba');

    expect(command1.patientId).not.toBe(command2.patientId);
    expect(command1.addressCity).not.toBe(command2.addressCity);
  });
});
