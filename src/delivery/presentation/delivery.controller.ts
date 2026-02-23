import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

import { AssingPackageToDealerCommand } from '../aplication/commands/assign-package-to-dealer.command';
import { CreateDealerCommand } from '../aplication/commands/create-dealer.command';
import { DeliverPackageCommand } from '../aplication/commands/deliver-package.command';
import { CreatePackageCommand } from '../aplication/commands/create-package.command';
import { CreateRouteWithPackagesCommand } from '../aplication/commands/create-route-with-packages.command';
import { TransitPackageCommand } from '../aplication/commands/transit-package.command';
import { CreateDealerDto } from './dto/create-dealer.dto';

@Controller()
export class DeliveryController {
    private readonly logger = new Logger(DeliveryController.name);

    constructor(private readonly commandBus: CommandBus) {}

  // CREAR REPARTIDOR
    @MessagePattern('create_dealer')
    async createDealer(@Payload() body: CreateDealerDto) {
        console.log('Mensaje recibido:', body);
        const command = new CreateDealerCommand(
        body.identityCard,
        body.firstName,
        body.lastName,
        body.cellPhone,
        );

        const dealer = await this.commandBus.execute(command);
        return { message: 'Dealer created successfully', dealer };
    }

    // ASIGNAR PAQUETE
    @MessagePattern('assign_package')
    async assignPackage(@Payload() body: any) {
        const command = new AssingPackageToDealerCommand(
        body.packageId,
        body.dealerId,
        new Date(),
        );

        await this.commandBus.execute(command);

        return { message: 'Package asignado correctamente' };
    }

    // ENTREGAR PAQUETE
    @MessagePattern('deliver_package')
    async markAsDelivered(@Payload() id: string) {
        await this.commandBus.execute(new DeliverPackageCommand(id));

        return {
        status: true,
        message: `Paquete ${id} marcado como entregado.`,
        };
    }

    // MARCAR EN CAMINO
    @MessagePattern('transit_package')
    async markAsTransit(@Payload() id: string) {
        await this.commandBus.execute(new TransitPackageCommand(id));

        return {
        status: true,
        message: `Paquete ${id} marcado como en camino.`,
        };
    }

    // CREAR PAQUETE
    @MessagePattern('create_package')
    async createPackage(@Payload() body: any) {
        await this.commandBus.execute(
        new CreatePackageCommand(
            body.patientId,
            new Date(body.deliveryDate),
            body.addressStreet,
            body.addressCity,
            body.lat,
            body.lng,
            body.deliveryRouteId,
        ),
        );

        return { message: 'Paquete creado correctamente' };
    }

    // ASIGNAR RUTA
    @MessagePattern('assign_packages_route')
    async assignPackagesRoute(@Payload() body: any) {
        const command = new CreateRouteWithPackagesCommand(
        body.deliveryId,
        body.deliveryDate,
        body.packages,
        );

        return this.commandBus.execute(command);
    }

    @MessagePattern()
    async handleUnknownMessage(@Payload() data: any) {
        this.logger.warn(`Mensaje recibido sin manejador: ${JSON.stringify(data)}`);
        return { error: 'No handler found for this message' };
    }
}
