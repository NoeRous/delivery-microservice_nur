export class CellPhone {
	private readonly value: number;

	constructor(value: string | number) {
		let numValue: number;

		if (typeof value === 'string') {
			if (!/^\d{8}$/.test(value)) {
				throw new Error(
					'El celular debe tener exactamente 8 dígitos numéricos',
				);
			}
			numValue = parseInt(value, 10);
		} else if (typeof value === 'number') {
			if (value < 0) throw new Error('El celular no puede ser negativo');
			const stringValue = value.toString();
			if (stringValue.length !== 8) {
				throw new Error('El celular debe tener exactamente 8 dígitos');
			}
			numValue = value;
		} else {
			throw new Error('Tipo de celular inválido');
		}

		this.value = numValue;
	}

	getValue(): number {
		return this.value;
	}

	toString(): string {
		return this.value.toString().padStart(8, '0');
	}
}
