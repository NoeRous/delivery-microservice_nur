import { Package } from '../entities/package.entity';

export interface PackageRepository {
	save(pkg: Package): Promise<void>;
	findById(id: string): Promise<Package | null>;
	findAllPending(): Promise<Package[]>;
	//findByDate(date:Date):Promise<Package[]>
}
