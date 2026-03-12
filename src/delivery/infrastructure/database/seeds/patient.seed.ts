import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { PatientEntity } from '../../typeorm/patient.entity';

export default class PatientSeeder implements Seeder {
	async run(dataSource: DataSource): Promise<void> {
		const repo = dataSource.getRepository(PatientEntity);

		const exists = await repo.count();
		if (exists > 0) return;

		await repo.insert([
			{
				identityCard: '1234567',
				firstName: 'noe',
				lastName: 'Pérez',
				cellPhone: 76543210,
			},
			{
				identityCard: '7654321',
				firstName: 'María',
				lastName: 'Gómez',
				cellPhone: 71234567,
			},
		]);

		console.log(' Pacientes cargados por defecto');
	}
}
