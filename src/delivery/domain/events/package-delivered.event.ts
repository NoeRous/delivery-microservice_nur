export class PackageDeliveredEvent {
	constructor(
		public readonly packageId: string,
		public readonly deliveryDate: Date,
	) {}
}
