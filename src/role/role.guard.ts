import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { RoleService } from './role.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly RoleService: RoleService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (
      request.headers['authorization'] === null ||
      request.headers['authorization'] === undefined
    ) {
      throw new HttpException('token empty', HttpStatus.UNAUTHORIZED);
    }

    const jwtToken = (request.headers['authorization'] as string).replace(
      'Bearer ',
      '',
    );

    try {
      // 塞假資料來實測驗證功能
      // (request as any).user = {
      //   role: 'admin',
      // };

      const user = this.jwtService.verify(jwtToken, {
        secret: this.configService.get('jwt.secret'),
      });
      if (!user) {
        throw new UnauthorizedException();
      }

      const { path, method } = request as any;
      const action = this.RoleService.mappingAction(method);

      return this.RoleService.checkPermission(
        `role:${user['role']}`,
        path,
        action,
      );
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new HttpException(
          'token已過期，請重新登入',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (err instanceof jwt.JsonWebTokenError) {
        throw new HttpException('token格式不正確', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
