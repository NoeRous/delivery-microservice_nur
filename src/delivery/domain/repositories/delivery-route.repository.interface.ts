import { DeliveryRoute } from '../entities/delivery-route.entity';

export interface DeliveryRouteRepository {
	save(route: DeliveryRoute): Promise<DeliveryRoute>;
	findById(id: string): Promise<DeliveryRoute | null>;
	findByDate(date: Date): Promise<DeliveryRoute[]>;
	delete(id: string): Promise<void>;
	findByDealerAndDate(dealerId: string, date: Date): Promise<DeliveryRoute[]>;
}
