import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'account', passwordField: 'password' });
  }

  async validate(account: string, password: string) {
    const result = await this.authService.validateUser(account, password);
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
