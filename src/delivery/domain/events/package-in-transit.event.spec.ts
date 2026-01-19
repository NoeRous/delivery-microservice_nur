import { PackageInTransitEvent } from './package-in-transit.event';

describe('PackageInTransitEvent', () => {
  it('debería crear un evento de paquete en tránsito', () => {
    const packageId = 'PKG001';
    const dealerId = 'DEALER001';
    const deliveryDate = new Date('2024-01-20');

    const event = new PackageInTransitEvent(packageId, dealerId, deliveryDate);

    expect(event.packageId).toBe(packageId);
    expect(event.dealerId).toBe(dealerId);
    expect(event.deliveryDate).toEqual(deliveryDate);
  });

  it('debería mantener la información del evento sin cambios', () => {
    const event = new PackageInTransitEvent('PKG002', 'DEALER002', new Date('2024-01-21'));

    expect(event.packageId).toBe('PKG002');
    expect(event.dealerId).toBe('DEALER002');
  });

  it('debería registrar el repartidor responsable', () => {
    const event = new PackageInTransitEvent('PKG003', 'DEALER003', new Date());

    expect(event.dealerId).toBe('DEALER003');
  });

  it('debería permitir múltiples eventos para diferentes paquetes', () => {
    const event1 = new PackageInTransitEvent('PKG001', 'DEALER001', new Date('2024-01-20'));
    const event2 = new PackageInTransitEvent('PKG002', 'DEALER002', new Date('2024-01-21'));

    expect(event1.packageId).toBe('PKG001');
    expect(event2.packageId).toBe('PKG002');
    expect(event1.dealerId).toBe('DEALER001');
    expect(event2.dealerId).toBe('DEALER002');
  });
});
