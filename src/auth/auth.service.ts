import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { encryptBySalt } from 'src/common/encryptBySalt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(account: string, password: string) {
    const result = await this.userService.getUserByAccount(account);
    if (result instanceof Array && result.length >= 1) {
      const user = result[0];
      const { hash } = encryptBySalt(password, user.salt);
      if (user.password === hash) {
        return user;
      } else {
        throw new HttpException('密碼錯誤', HttpStatus.UNAUTHORIZED);
      }
    } else {
      throw new HttpException('找不到帳號', HttpStatus.NOT_FOUND);
    }
  }

  generateJwt(user: User) {
    const { id, account, role } = user;
    const payload = { id, account, role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
      }),
      id,
    };
  }
}
