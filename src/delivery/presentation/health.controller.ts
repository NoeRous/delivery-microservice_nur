import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
	@Get()
	check() {
		return {
			status: 'ok',
			service: 'delivery-api',
			serverTime: new Date().toISOString(),
			uptime: process.uptime(),
			version: '1.0.0',
			database: 'connected', // Aquí podrías agregar lógica para verificar la conexión a la base de datos
		};
	}
}
