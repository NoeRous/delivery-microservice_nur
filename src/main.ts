import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, KafkaOptions } from '@nestjs/microservices';
import { GlobalRpcExceptionFilter } from './delivery/infrastructure/filters/global-rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<KafkaOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'delivery-group', 
        },
      },
    },
  );
  app.useGlobalFilters(new GlobalRpcExceptionFilter());

  await app.listen();
}
bootstrap();