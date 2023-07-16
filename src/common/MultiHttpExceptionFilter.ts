import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export class MultiHttpException extends Error {
  constructor(public readonly exceptions: HttpException[]) {
    super();
  }
}

@Catch(MultiHttpException)
export class MultiHttpExceptionFilter implements ExceptionFilter {
  catch(exception: MultiHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(200).json({
      exceptions: exception.exceptions.map((e) => ({
        status: e.getStatus(),
        message: e.message,
      })),
    });
  }
}
