import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Result } from 'src/common/standardResult';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() user: CreateUserDto) {
    const newUser = await this.userService.create(user);
    return Result.ok(newUser);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  signin(@Req() request: Request) {
    const user = request.user;
    return this.authService.generateJwt(user as User);
  }
}
