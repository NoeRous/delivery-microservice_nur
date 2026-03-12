export class AssingPackageToDealerCommand {
	constructor(
		public readonly packageId: string,
		public readonly dealerId: string,
		public readonly date: Date,
	) {}
}
