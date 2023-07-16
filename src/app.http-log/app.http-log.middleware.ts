import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppHttpLogMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

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
