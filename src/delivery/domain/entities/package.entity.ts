import { PackageCreatedEvent } from '../events/package-create.event';
import { PackageDeliveredEvent } from '../events/package-delivered.event';
import { Address } from '../value-objects/address.vo';

export class Package {
	constructor(
		public readonly id: string,
		public patientId: string,
		public deliveryDate: Date | null = null,
		public address: Address,
		public deliveryRouteId?: string,
		private status: 'pending' | 'in_transit' | 'delivered' = 'pending',
	) {}

	//marcar  como en transito
	markInTransit() {
		this.status = 'in_transit';
		// new PackageInTransitEvent(this.id, dealerId, this.deliveryDate);
	}

	//marcar el paquete como entregado
	markDelivered() {
		this.status = 'delivered';
		this.deliveryDate = new Date();
		new PackageDeliveredEvent(this.id, this.deliveryDate);
	}

	//obtener el estado del paquete
	getStatus(): string {
		return this.status;
	}

	toPersistence(): any {
		return {
			id: this.id,
			patientId: this.patientId,
			deliveryDate: this.deliveryDate || null,
			status: this.getStatus(),
			addressStreet: this.address.street,
			addressCity: this.address.city,
			lat: this.address.lat,
			lng: this.address.lng,
			deliveryRouteId: this.deliveryRouteId,
		};
	}
	//crear paquete
	static create(
		id: string,
		patientId: string,
		deliveryDate: Date,
		address: Address,
	): Package {
		const pkg = new Package(id, patientId, deliveryDate, address);
		new PackageCreatedEvent(id, patientId, deliveryDate);
		return pkg;
	}
}
