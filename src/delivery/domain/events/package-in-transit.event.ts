export class PackageInTransitEvent {
	constructor(
		public readonly packageId: string,
		public readonly dealerId: string,
		public readonly deliveryDate: Date,
	) {}
}
