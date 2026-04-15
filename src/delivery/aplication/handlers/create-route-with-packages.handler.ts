import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRouteWithPackagesCommand } from '../commands/create-route-with-packages.command';
import type { UnitOfWorkRepository } from '../../domain/repositories/unit-of-work.interface';
import { DeliveryRoute } from '../../domain/entities/delivery-route.entity';
import { Package } from '../../domain/entities/package.entity';
import { Address } from '../../domain/value-objects/address.vo';

import { Inject } from '@nestjs/common';

interface CreateRouteResult {
	routeId: string;
	status: boolean;
}

@CommandHandler(CreateRouteWithPackagesCommand)
export class CreateRouteWithPackagesHandler
	implements ICommandHandler<CreateRouteWithPackagesCommand>
{
	constructor(
		@Inject('UnitOfWorkRepository')
		private readonly uow: UnitOfWorkRepository,
	) {}

	async execute(
		command: CreateRouteWithPackagesCommand,
	): Promise<CreateRouteResult> {
		await this.uow.start();

		try {
			const dealer = await this.uow.dealerRepository.findById(
				command.deliveryId,
			);

			if (!dealer) {
				throw new Error('Dealer no encontrado');
			}

			const newRoute = new DeliveryRoute(
				crypto.randomUUID(),
				new Date(command.deliveryDate),
				dealer,
			);

			const route = await this.uow.deliveryRouteRepository.save(newRoute);
			const deliveryRouteId = route.id;

			console.log('route', route.id);
			const packageDeliveryDate = null;

			for (const pkg of command.packages) {
				const address = new Address(
					pkg.addressStreet,
					pkg.addressCity,
					pkg.lat,
					pkg.lng,
				);

				const packageEntity = new Package(
					crypto.randomUUID(),
					pkg.patientId,
					packageDeliveryDate,
					address,
					deliveryRouteId,
				);
				await this.uow.packageRepository.save(packageEntity);
			}

			await this.uow.complete();
			return { routeId: route.id, status: true };
		} catch (err) {
			await this.uow.rollback();
			throw err;
		}
	}
}
