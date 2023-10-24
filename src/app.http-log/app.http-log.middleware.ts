import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppHttpLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, baseUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('close', () => {
      const { statusCode } = res;
      const contenType = res.get('content-type');

      this.logger.log(`${method} route: ${baseUrl} statusCode: ${statusCode}`);
      this.logger.log(
        `userAgent: ${userAgent} contenType: ${contenType} ip: ${ip}`,
      );
    });
    next();
  }
}
