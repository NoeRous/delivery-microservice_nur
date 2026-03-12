import { ApiProperty } from '@nestjs/swagger';

export class AssignPackageDto {
	@ApiProperty({ example: 'uuid-package', description: 'ID del paquete' })
	packageId: string;

	@ApiProperty({ example: 'uuid-dealer', description: 'ID del repartidor' })
	dealerId: string;

	// @ApiProperty({ example: '2025-10-28', description: 'Fecha opcional', required: false })
	// date?: string;
}
