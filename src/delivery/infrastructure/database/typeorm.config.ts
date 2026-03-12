import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import PatientSeeder from './seeds/patient.seed';
import { PatientEntity } from '../typeorm/patient.entity';
import { DealerEntity } from '../typeorm/dealer.entity';
import { DeliveryRouteEntity } from '../typeorm/delivery_routes.entity';
import { PackageEntity } from '../typeorm/package.entity';
import { AddressEntity } from '../typeorm/address.entity';
import { DeliveryScheduleEntity } from '../typeorm/delivery-schedule.entity';
import { OutboxEntity } from '../typeorm/outbox.entity';

// Valores con fallback para TS seguro
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || 'admin';
const DB_NAME = process.env.DB_NAME || 'delivery';

export const ormConfig: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: DB_HOST,
	port: DB_PORT,
	username: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
	entities: [
		PatientEntity,
		DealerEntity,
		DeliveryRouteEntity,
		PackageEntity,
		AddressEntity,
		DeliveryScheduleEntity,
		OutboxEntity,
	],
	synchronize: true,
	migrationsRun: false,
	logging: true,
	//migrations: ["src/infrastructure/database/migrations/*.ts"],
	// Seeders
	seeds: [PatientSeeder],
};

// Exporta el DataSource para migraciones y seeders
export const dataSource = new DataSource(ormConfig);
