export class CreatePatientCommand {
    constructor(
        public readonly id:string,
        public readonly identityCard:string,
        public readonly fullName:string,
        public readonly lastName:string,
        public readonly cellPhone:number
    ){}
}