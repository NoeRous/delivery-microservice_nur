import { AssingPackageToDealerCommand } from './assign-package-to-dealer.command';

describe('AssingPackageToDealerCommand', () => {
  it('debería crear un comando de asignación de paquete a repartidor', () => {
    const date = new Date('2024-01-20');
    const command = new AssingPackageToDealerCommand('PKG001', 'DEALER001', date);

    expect(command.packageId).toBe('PKG001');
    expect(command.dealerId).toBe('DEALER001');
    expect(command.date).toEqual(date);
  });

  it('debería mantener los datos del comando sin cambios', () => {
    const date = new Date('2024-01-21');
    const command = new AssingPackageToDealerCommand('PKG002', 'DEALER002', date);

    expect(command.packageId).toBe('PKG002');
    expect(command.dealerId).toBe('DEALER002');
    expect(command.date).toEqual(date);
  });

  it('debería permitir UUIDs como identificadores', () => {
    const uuid1 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
    const uuid2 = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
    const date = new Date();

    const command = new AssingPackageToDealerCommand(uuid1, uuid2, date);

    expect(command.packageId).toBe(uuid1);
    expect(command.dealerId).toBe(uuid2);
  });

  it('debería crear múltiples comandos independientes', () => {
    const date1 = new Date('2024-01-20');
    const date2 = new Date('2024-01-21');

    const command1 = new AssingPackageToDealerCommand('PKG001', 'DEALER001', date1);
    const command2 = new AssingPackageToDealerCommand('PKG002', 'DEALER002', date2);

    expect(command1.packageId).not.toBe(command2.packageId);
    expect(command1.dealerId).not.toBe(command2.dealerId);
    expect(command1.date).not.toEqual(command2.date);
  });

  it('debería permitir la misma fecha para múltiples asignaciones', () => {
    const sameDate = new Date('2024-01-20');

    const command1 = new AssingPackageToDealerCommand('PKG001', 'DEALER001', sameDate);
    const command2 = new AssingPackageToDealerCommand('PKG002', 'DEALER001', sameDate);

    expect(command1.date).toEqual(command2.date);
  });
});
