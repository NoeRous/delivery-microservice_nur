import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DeliveryController } from './presentation/delivery.controller';

// Entities
import { PackageEntity } from './infrastructure/typeorm/package.entity';
import { DeliveryRouteEntity } from './infrastructure/typeorm/delivery_routes.entity';
import { DealerEntity } from './infrastructure/typeorm/dealer.entity';
import { PatientEntity } from './infrastructure/typeorm/patient.entity';

// Handlers
import { AssignPackageToDealerHandler } from './aplication/handlers/assing-package-to-dealer.handler';
import { CreateDealerHandler } from './aplication/handlers/create-dealer.handler';
import { DeliverPackageHandler } from './aplication/handlers/deliver-package.handler';
import { CreatePackageHandler } from './aplication/handlers/create-package.handler';
import { CreateRouteWithPackagesHandler } from './aplication/handlers/create-route-with-packages.handler';
import { TransitPackageHandler } from './aplication/handlers/transit-package.handler';

// Repositories
import { DealerTypeOrmRepositoryImpl } from './infrastructure/repositories/dealer.repository';
import { PackageTypeOrmRepositoryImpl } from './infrastructure/repositories/package.repository';
import { DeliveryRouteTypeOrmRepositoryImpl } from './infrastructure/repositories/delivery-route.repository';
import { UnitOfWorkRepositoryImpl } from './infrastructure/repositories/unit-of-work.repository';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      PackageEntity,
      DeliveryRouteEntity,
      DealerEntity,
      PatientEntity,
    ]),

    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // 👈 fijo
          },
          consumer: {
            groupId: 'delivery-group',
          },
          subscribe: {
            fromBeginning: true,
          },
          run: {
            autoCommit: true,
          },
        },
      },
    ]),
  ],

  controllers: [DeliveryController],

  providers: [
    AssignPackageToDealerHandler,
    CreateDealerHandler,
    DeliverPackageHandler,
    CreatePackageHandler,
    CreateRouteWithPackagesHandler,
    TransitPackageHandler,

    { provide: 'DealerRepository', useClass: DealerTypeOrmRepositoryImpl },
    { provide: 'PackageRepository', useClass: PackageTypeOrmRepositoryImpl },
    {
      provide: 'DeliveryRouteRepository',
      useClass: DeliveryRouteTypeOrmRepositoryImpl,
    },
    { provide: 'UnitOfWorkRepository', useClass: UnitOfWorkRepositoryImpl },
  ],
})
export class DeliveryModule {}
