import { CellPhone } from '../value-objects/cell-phone.vo';
import { PatientEntity } from 'src/delivery/infrastructure/typeorm/patient.entity';

export class Patient {
	constructor(
		public readonly _id: string,
		public _identityCard: string,
		public _name: string,
		public _lastName: string,
		public _cellPhone: CellPhone,
	) {
		if (!_id) throw new Error('El ID del paciente es obligatorio');
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

	static fromEntity(entity: PatientEntity): Patient {
		return new Patient(
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
