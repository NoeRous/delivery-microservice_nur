import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from 'uuid';
import { CellPhone } from "../../domain/value-objects/cell-phone.vo";
import { Dealer } from "../../domain/entities/dealer.entity";
import { Inject } from "@nestjs/common";
import type { DealerRepository } from "../../domain/repositories/dealer.repository.interface";
import { CreateDealerCommand } from "../commands/create-dealer.command";


@CommandHandler(CreateDealerCommand)
export class CreateDealerHandler implements ICommandHandler<CreateDealerCommand> {

    constructor(
         @Inject('DealerRepository')
         private readonly dealerRepository: DealerRepository) { }

    async execute(command: CreateDealerCommand): Promise<void> {
        const cellPhone = new CellPhone(command.cellPhone);
        //validamos el duplicado
        //await Dealer.ensureDealerIsUnique(this.dealerRepository, command.identityCard, cellPhone);
        const id = uuidv4()
        const dealer = new Dealer(id, command.identityCard, command.firstName, command.lastName, cellPhone);
        await this.dealerRepository.save(dealer)
    }

}