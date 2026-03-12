import { ApiProperty } from '@nestjs/swagger';

export class PackageDto {
	@ApiProperty({
		example: '8794c5c8-5189-4e89-8f34-fbcbaed96ec2',
		description: 'ID del paciente al que se le entregará el paquete',
	})
	patientId: string;

	@ApiProperty({
		example: 'Av. Central',
		description: 'Calle o avenida de la dirección del paciente',
	})
	addressStreet: string;

	@ApiProperty({
		example: 'Cochabamba',
		description: 'Ciudad de la dirección del paciente',
	})
	addressCity: string;

	@ApiProperty({ example: -17.38, description: 'Latitud de la dirección' })
	lat: number;

	@ApiProperty({ example: -66.16, description: 'Longitud de la dirección' })
	lng: number;
}

export class AssignPackagesDto {
	@ApiProperty({
		example: 'uuid-Delivery',
		description: 'ID único del delivery',
	})
	deliveryId: string;

	@ApiProperty({ example: '02-10-2025', description: 'Fecha de la ruta' })
	deliveryDate: Date;

	@ApiProperty({
		type: [PackageDto],
		description: 'Lista de paquetes que se asignarán al delivery',
		example: [
			{
				patientId: 'ef732abf-301c-4e04-a3b4-6e12d8a96893',
				addressStreet: 'Av. Central',
				addressCity: 'Cochabamba',
				lat: -17.38,
				lng: -66.16,
			},
			{
				patientId: '8794c5c8-5189-4e89-8f34-fbcbaed96ec2',
				addressStreet: 'Av. Blanco Galindo',
				addressCity: 'Cochabamba',
				lat: -17.4,
				lng: -66.15,
			},
		],
	})
	packages: PackageDto[];
}
