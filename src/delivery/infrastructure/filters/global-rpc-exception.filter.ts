import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

interface RpcErrorResponse {
	statusCode: number;
	message: string;
	code: string;
}

@Catch()
export class GlobalRpcExceptionFilter implements RpcExceptionFilter {
	catch(exception: unknown): Observable<RpcErrorResponse> {
		if (exception instanceof RpcException) {
			return throwError(() => exception.getError() as RpcErrorResponse);
		}

		const err = exception as Record<string, unknown>;

		if (err && typeof err.statusCode === 'number') {
			return throwError(() => ({
				statusCode: err.statusCode as number,
				message: (err.message as string) || 'Error',
				code: (err.code as string) || 'BUSINESS_ERROR',
			}));
		}

		return throwError(() => ({
			statusCode: 500,
			message: 'Internal microservice error',
			code: 'INTERNAL_ERROR',
		}));
	}
}
