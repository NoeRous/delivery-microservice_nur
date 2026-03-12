export class CreatePackageCommand {
	constructor(
		public readonly patientId: string,
		public readonly deliveryDate: Date,
		public readonly addressStreet: string,
		public readonly addressCity: string,
		public readonly lat?: number,
		public readonly lng?: number,
		public readonly deliveryRouteId?: string,
	) {}
}
