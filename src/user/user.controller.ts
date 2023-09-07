import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Result } from 'src/common/standardResult';
import { RoleGuard } from 'src/role/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getUsers() {
    const user = await this.userService.getAllUsers();
    user.data = user.data.map((data) => {
      delete data.salt;
      delete data.password;
      return data;
    });
    return Result.ok(user.data, '查詢成功');
  }

  @Get(':id')
  async getUser(@Request() req, @Param('id') id: string) {
    const jwtToken = (req.headers['authorization'] as string).replace(
      'Bearer ',
      '',
    );
    const reqUser = this.jwtService.verify(jwtToken, {
      secret: this.configService.get('jwt.secret'),
    });

    let user = await this.userService.getUserById(id);
    if (user instanceof Array && user.length == 1) {
      user = user[0];
      delete user.salt;
      delete user.password;
    }

    // console.log(reqUser['role']);
    if (reqUser['role'] === 'employee') {
      if (reqUser['id'] !== user.id) {
        throw new HttpException(
          '只開放一般員工查詢自己的資料！',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return Result.ok(user, '查詢成功');
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMettingRoomDto: UpdateUserDto) {
    return this.userService.update(id, updateMettingRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
