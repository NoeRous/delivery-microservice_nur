import { DealerRepository } from './dealer.repository.interface';
import { DeliveryRouteRepository } from './delivery-route.repository.interface';
import { PackageRepository } from './package.repository.interface';

export interface UnitOfWorkRepository {
	start(): Promise<void>;
	complete(): Promise<void>;
	rollback(): Promise<void>;

	deliveryRouteRepository: DeliveryRouteRepository;
	packageRepository: PackageRepository;
	dealerRepository: DealerRepository;
}
