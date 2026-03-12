import { Dealer } from './dealer.entity';
import { Package } from './package.entity';

export class DeliveryRoute {
	private packages: Package[] = [];
	constructor(
		public readonly id: string,
		public readonly date: Date,
		public readonly dealer: Dealer,
	) {}

	//adicionar paquete a ruta de entrega
	addPackage(pkg: Package) {
		this.packages.push(pkg);
	}

	//obtener paquetes de la ruta
	getPackages(): Package[] {
		return this.packages;
	}
}
