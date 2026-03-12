import { DealerEntity } from 'src/delivery/infrastructure/typeorm/dealer.entity';
import { DealerRepository } from '../repositories/dealer.repository.interface';
import { CellPhone } from '../value-objects/cell-phone.vo';

export class Dealer {
	constructor(
		public readonly _id: string,
		public _identityCard: string,
		public _name: string,
		public _lastName: string,
		public _cellPhone: CellPhone,
	) {
		if (!_id) throw new Error('El ID del repartidor es obligatorio');
		if (!_identityCard?.trim())
			throw new Error('El número de carnet es obligatorio');
		if (!_name?.trim()) throw new Error('El nombre es obligatorio');
		if (!_lastName?.trim()) throw new Error('El apellido es obligatorio');
	}

	get id(): string {
		return this._id;
	}

	get identityCard(): string {
		return this._identityCard;
	}

	get cellPhone(): CellPhone {
		return this._cellPhone;
	}

	get fullName(): string {
		return `${this._name} ${this._lastName}`;
	}

	//Regla: no exista repartidores duplicados

	static async ensureDealerIsUnique(
		repository: DealerRepository,
		identityCard: string,
		cellPhone: CellPhone,
	): Promise<void> {
		const existingByCard = await repository.findById(identityCard); //aqui metodo para buscar por carnet
		if (existingByCard) {
			throw new Error(
				`Ya existe un repartidor con el carnet ${identityCard}`,
			);
		}

		const existingByPhone = await repository.findByCellPhone(
			cellPhone.getValue(),
		);
		if (existingByPhone) {
			throw new Error(
				`Ya existe un repartidor con el celular ${cellPhone.getValue()}`,
			);
		}
	}

	static fromEntity(entity: DealerEntity): Dealer {
		return new Dealer(
			entity.id,
			entity.identityCard,
			entity.firstName,
			entity.lastName,
			new CellPhone(entity.cellPhone),
		);
	}

	toPersistence(): any {
		return {
			id: this.id,
			identityCard: this.identityCard,
			firstName: this._name,
			lastName: this._lastName,
			cellPhone: this.cellPhone.getValue(), // solo el valor primitivo
		};
	}
}
