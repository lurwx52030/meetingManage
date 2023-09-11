import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Result } from 'src/common/standardResult';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() user: CreateUserDto) {
    const newUser = await this.userService.create(user);
    delete newUser.password;
    delete newUser.salt;
    return Result.ok(newUser, '註冊成功');
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  signin(@Req() request: Request) {
    const user = request.user;
    const token = this.authService.generateJwt(user as User);
    return { status: HttpStatus.OK, ...token };
  }
}
