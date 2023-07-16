import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleService } from './role.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
    const jwtToken = (request.headers['authorization'] as string).replace(
      'Bearer ',
      '',
    );
    const user = this.jwtService.verify(jwtToken, {
      secret: this.configService.get('jwt.secret'),
    });
    // (request as any).user = {
    //   role: 'admin',
    // }; // 塞假資料來實測驗證功能
    const { path, method } = request as any;
    const action = this.RoleService.mappingAction(method);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.RoleService.checkPermission(
      `role:${user['role']}`,
      path,
      action,
    );
  }
}
