import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, KafkaOptions } from '@nestjs/microservices';
import { GlobalRpcExceptionFilter } from './delivery/infrastructure/filters/global-rpc-exception.filter';

async function bootstrap() {
	// ✅ HTTP APP
	const app = await NestFactory.create(AppModule);

	// ✅ Kafka microservice
	app.connectMicroservice<KafkaOptions>({
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: ['kafka:9092'],
			},
			consumer: {
				groupId: 'delivery-group',
			},
		},
	});

	app.useGlobalFilters(new GlobalRpcExceptionFilter());

	// 🔥 arrancar Kafka
	await app.startAllMicroservices();

	// 🔥 arrancar HTTP
	await app.listen(3000, '0.0.0.0');

	console.log('🚀 HTTP running on port 3000');
	console.log('📨 Kafka connected');
}

void bootstrap();
