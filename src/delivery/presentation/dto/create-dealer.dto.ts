import { ApiProperty } from '@nestjs/swagger';

export class CreateDealerDto {
	@ApiProperty({ example: '12345678', description: 'Cédula de identidad' })
	identityCard: string;

	@ApiProperty({ example: 'Juan', description: 'Nombre' })
	firstName: string;

	@ApiProperty({ example: 'Perez', description: 'Apellido' })
	lastName: string;

	@ApiProperty({ example: 77777777, description: 'Celular' })
	cellPhone: number;
}
