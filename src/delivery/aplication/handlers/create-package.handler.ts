import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePackageCommand } from '../commands/create-package.command';
import { Package } from '../../domain/entities/package.entity';
import { v4 as uuidv4 } from 'uuid';
import { Inject } from '@nestjs/common';
import type { PackageRepository } from '../../domain/repositories/package.repository.interface';
import { Address } from '../../domain/value-objects/address.vo';

@CommandHandler(CreatePackageCommand)
export class CreatePackageHandler implements ICommandHandler<CreatePackageCommand> {
  constructor(
    @Inject('PackageRepository') private readonly packageRepo: PackageRepository
  ) {}

  async execute(command: CreatePackageCommand): Promise<void> {
    
    const address = new Address(command.addressStreet, command.addressCity, command.lat, command.lng);
    const pkg = new Package(
      uuidv4(),
      command.patientId,
      command.deliveryDate,
      address,
      command.deliveryRouteId
    );

    await this.packageRepo.save(pkg);
  }
}