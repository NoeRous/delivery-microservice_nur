import 'dotenv/config';
import dataSource from './data-source';
import PatientSeeder from './seeds/patient.seed';
import DealerSeeder from './seeds/dealer.seed';

async function run() {
	try {
		await dataSource.initialize();
		console.log('DataSource inicializado');

		const seederPatient = new PatientSeeder();
		await seederPatient.run(dataSource);

		const seederDealer = new DealerSeeder();
		await seederDealer.run(dataSource);

		console.log('Seed completado');

		await dataSource.destroy();
	} catch (error) {
		console.error('Error ejecutando seed:', error);
	}
}

run().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
