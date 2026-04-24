import { Dealer } from '../entities/dealer.entity';

export interface DealerRepository {
	findById(id: string): Promise<Dealer | null>;
	findByIdentityCard(identityCard: string): Promise<Dealer | null>;
	findByCellPhone(cellPhone: number): Promise<Dealer | null>;
	findAll(): Promise<Dealer[]>;
	save(dealer: Dealer): Promise<void>;
}
