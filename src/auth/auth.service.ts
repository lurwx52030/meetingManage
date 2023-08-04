import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { encryptBySalt } from 'src/common/encryptBySalt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(account: string, password: string) {
    const user = (await this.userService.getUserByAccount(account)).data;
    if (user !== null) {
      const { hash } = encryptBySalt(password, user.salt);
      if (user.password == hash) {
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
    };
  }
}
