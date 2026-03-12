export class Address {
	constructor(
		public readonly street: string,
		public readonly city: string,
		public readonly lat?: number,
		public readonly lng?: number,
	) {
		if (!street || street.trim() === '')
			throw new Error('Street is required');
		if (!city || city.trim() === '') throw new Error('City is required');
	}

	fullAddress(): string {
		return `${this.street}, ${this.city}`;
	}
}
