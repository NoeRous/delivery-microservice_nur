import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { PackageRepository } from '../../domain/repositories/package.repository.interface';
import { AssingPackageToDealerCommand } from '../commands/assign-package-to-dealer.command';
import type { DealerRepository } from '../../domain/repositories/dealer.repository.interface';
import type { DeliveryRouteRepository } from '../../domain/repositories/delivery-route.repository.interface';
import { v4 as uuidv4 } from 'uuid';
import { DeliveryRoute } from '../../domain/entities/delivery-route.entity';

@CommandHandler(AssingPackageToDealerCommand)
export class AssignPackageToDealerHandler
	implements ICommandHandler<AssingPackageToDealerCommand>
{
	constructor(
		@Inject('PackageRepository')
		private readonly packageRepo: PackageRepository,

		@Inject('DealerRepository')
		private readonly dealerRepo: DealerRepository,

		@Inject('DeliveryRouteRepository')
		private readonly deliveryRouteRepo: DeliveryRouteRepository,
	) {}

	async execute(command: AssingPackageToDealerCommand): Promise<void> {
		const pkg = await this.packageRepo.findById(command.packageId);
		if (!pkg) throw new Error('Package not found');

		const dealer = await this.dealerRepo.findById(command.dealerId);
		if (!dealer) throw new Error('Repartidor no encontrado');

		const dateNow = new Date();
		const routes = await this.deliveryRouteRepo.findByDealerAndDate(
			dealer.id,
			dateNow,
		);

		let route: DeliveryRoute;
		if (routes.length > 0) {
			route = routes[0];
		} else {
			route = new DeliveryRoute(uuidv4(), dateNow, dealer);
		}

		route.addPackage(pkg);

		await this.deliveryRouteRepo.save(route);
		pkg.markInTransit();
		await this.packageRepo.save(pkg);
	}
}
