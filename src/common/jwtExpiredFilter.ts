import * as jwt from 'jsonwebtoken';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

class jwtExpiredFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    if (exception instanceof jwt.TokenExpiredError) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        message: 'token過期',
      });
    } else {
      response.status(exception.getStatus()).json({
        message: exception.getResponse(),
      });
    }
  }
}

export default jwtExpiredFilter;
