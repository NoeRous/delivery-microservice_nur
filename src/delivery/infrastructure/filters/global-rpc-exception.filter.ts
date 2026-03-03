import { Catch, ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GlobalRpcExceptionFilter implements RpcExceptionFilter {

  catch(exception: any, host: ArgumentsHost): Observable<any> {

    // Si ya es RpcException, lo dejamos pasar
    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }

    // Si tiene statusCode personalizado
    if (exception.statusCode) {
      return throwError(() => ({
        statusCode: exception.statusCode,
        message: exception.message,
        code: exception.code || 'BUSINESS_ERROR',
      }));
    }

    // Error inesperado
    return throwError(() => ({
      statusCode: 500,
      message: 'Internal microservice error',
      code: 'INTERNAL_ERROR',
    }));
  }
}