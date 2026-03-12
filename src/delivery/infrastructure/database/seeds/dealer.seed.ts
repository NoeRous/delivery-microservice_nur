import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { PatientEntity } from '../../typeorm/patient.entity';
import { DealerEntity } from '../../typeorm/dealer.entity';

export default class DealerSeeder implements Seeder {
	async run(dataSource: DataSource): Promise<void> {
		const repo = dataSource.getRepository(DealerEntity);

		const exists = await repo.count();
		if (exists > 0) return;

		await repo.insert([
			{
				identityCard: '88888888',
				firstName: 'Noemi',
				lastName: 'Ancari',
				cellPhone: 8888888,
			},
			{
				identityCard: '7777777',
				firstName: 'Rosario',
				lastName: 'Gómez',
				cellPhone: 7777777,
			},
		]);

		console.log(' Repartidores cargados por defecto');
	}
}
