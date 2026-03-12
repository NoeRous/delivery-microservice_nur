import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeliverPackageCommand } from '../commands/deliver-package.command';
import type { PackageRepository } from 'src/delivery/domain/repositories/package.repository.interface';

@CommandHandler(DeliverPackageCommand)
export class DeliverPackageHandler
	implements ICommandHandler<DeliverPackageCommand>
{
	constructor(
		@Inject('PackageRepository')
		private readonly packageRepository: PackageRepository,
	) {}

	async execute(command: DeliverPackageCommand): Promise<void> {
		const pkg = await this.packageRepository.findById(command.packageId);

		if (!pkg) {
			throw new Error('Paquete no encontrado');
		}

		pkg.markDelivered();

		await this.packageRepository.save(pkg);
	}
}
