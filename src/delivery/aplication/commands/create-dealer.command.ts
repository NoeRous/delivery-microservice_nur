export class CreateDealerCommand {
	constructor(
		public readonly identityCard: string,
		public readonly firstName: string,
		public readonly lastName: string,
		public readonly cellPhone: number,
	) {}
}
