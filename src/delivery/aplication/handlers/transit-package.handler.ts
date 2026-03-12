import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { TransitPackageCommand } from '../commands/transit-package.command';
import type { PackageRepository } from 'src/delivery/domain/repositories/package.repository.interface';

@CommandHandler(TransitPackageCommand)
export class TransitPackageHandler
	implements ICommandHandler<TransitPackageCommand>
{
	constructor(
		@Inject('PackageRepository')
		private readonly packageRepository: PackageRepository,
	) {}

	async execute(command: TransitPackageCommand): Promise<void> {
		const pkg = await this.packageRepository.findById(command.packageId);

		if (!pkg) {
			throw new Error('Paquete no encontrado');
		}

		pkg.markInTransit();

		await this.packageRepository.save(pkg);
	}
}
