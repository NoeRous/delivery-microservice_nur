export class CreateRouteWithPackagesCommand {
	constructor(
		public readonly deliveryId: string,
		public readonly deliveryDate: Date,
		public readonly packages: {
			patientId: string;
			addressStreet: string;
			addressCity: string;
			lat: number;
			lng: number;
		}[],
	) {}
}
