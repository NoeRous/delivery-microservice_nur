import { ApiProperty } from '@nestjs/swagger';
export class CreatePackageDto {
	@ApiProperty({ example: 'uuid-patient', description: 'ID del paciente' })
	patientId: string;

	@ApiProperty({ example: '2025-10-30', description: 'Fecha de entrega' })
	deliveryDate: string;

	@ApiProperty({ example: 'Calle 123', description: 'Dirección' })
	addressStreet: string;

	@ApiProperty({ example: 'Ciudad', description: 'Ciudad' })
	addressCity: string;

	@ApiProperty({ example: -17.393, description: 'Latitud' })
	lat: number;

	@ApiProperty({ example: -66.157, description: 'Longitud' })
	lng: number;

	@ApiProperty({
		example: 'uuid-route',
		description: 'ID de la ruta de entrega',
	})
	deliveryRouteId: string;
}
